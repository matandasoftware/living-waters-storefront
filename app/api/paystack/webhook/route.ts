import { NextResponse } from "next/server";
import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

export const runtime = "nodejs";

type JsonObject = Record<string, unknown>;

function asObject(value: unknown): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }

  return value as JsonObject;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== ""
    ? value
    : undefined;
}

function verifySignature(
  rawBody: Buffer,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature || !/^[a-f0-9]{128}$/i.test(signature)) {
    return false;
  }

  const expected = createHmac("sha512", secret)
    .update(rawBody)
    .digest();

  const received = Buffer.from(signature, "hex");

  return (
    expected.length === received.length &&
    timingSafeEqual(expected, received)
  );
}

function parseDate(value: unknown): Date | undefined {
  const text = asString(value);
  if (!text) return undefined;

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid next payment date.");
  }

  return date;
}

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    console.error("Paystack webhook: secret key is missing.");

    return NextResponse.json(
      { message: "Webhook is not configured." },
      { status: 500 },
    );
  }

  const rawBody = Buffer.from(await req.arrayBuffer());
  const signature = req.headers.get("x-paystack-signature");

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json(
      { message: "Invalid signature." },
      { status: 401 },
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON." },
      { status: 400 },
    );
  }

  const event = asObject(parsed);
  const eventType = asString(event.event);

  if (
    !eventType ||
    typeof event.data !== "object" ||
    event.data === null ||
    Array.isArray(event.data)
  ) {
    return NextResponse.json(
      { message: "Invalid event payload." },
      { status: 400 },
    );
  }

  const data = asObject(event.data);
  const customer = asObject(data.customer);
  const subscription = asObject(data.subscription);
  const plan = asObject(data.plan);
  const metadata = asObject(data.metadata);

  const subscriptionCode =
    asString(data.subscription_code) ??
    asString(subscription.subscription_code);

  // Identical request bodies receive the same key on every retry.
  // This does not depend on timestamps or IDs shared by different events.
  const eventKey = createHash("sha256")
    .update(rawBody)
    .digest("hex");

  try {
    const result = await prisma.$transaction(async (tx) => {
      // The unique eventKey prevents concurrent identical deliveries
      // from processing the same payload twice.
      const inserted = await tx.webhookEvent.createMany({
        data: [
          {
            eventKey,
            eventType,
            payload: parsed as Prisma.InputJsonValue,
          },
        ],
        skipDuplicates: true,
      });

      if (inserted.count === 0) {
        return { duplicate: true };
      }

      if (eventType === "subscription.create") {
        const customerEmail = asString(customer.email);

        if (!subscriptionCode || !customerEmail) {
          throw new Error("Subscription event is missing identifiers.");
        }

        const details = {
          customerEmail,
          paystackCustomerCode: asString(customer.customer_code),
          paystackEmailToken: asString(data.email_token),
          planCode:
            asString(plan.plan_code) ?? asString(data.plan_code),
          nextBillingDate: parseDate(data.next_payment_date),
          subscriptionType: asString(metadata.subscriptionType),
          subscriptionPlan: asString(metadata.subscriptionPlan),
        };

        await tx.subscription.upsert({
          where: { subscriptionCode },
          create: {
            subscriptionCode,
            status: "active",
            ...details,
          },
          // Don't reactivate an existing cancelled subscription
          // if a creation event is delivered again later.
          update: details,
        });
      }

      if (
        eventType === "subscription.disable" ||
        eventType === "subscription.not_renew" ||
        eventType === "invoice.payment_failed"
      ) {
        if (!subscriptionCode) {
          throw new Error("Subscription code is missing.");
        }

        const current = await tx.subscription.findUnique({
          where: { subscriptionCode },
        });

        if (!current) {
          // Roll back the event record too, allowing a later retry
          // if this arrived before subscription.create.
          throw new Error("Subscription record is not available yet.");
        }

        if (eventType === "subscription.disable") {
          await tx.subscription.update({
            where: { subscriptionCode },
            data: { status: "cancelled" },
          });
        }

        if (
          eventType === "subscription.not_renew" &&
          current.status !== "cancelled"
        ) {
          await tx.subscription.update({
            where: { subscriptionCode },
            data: { status: "non_renewing" },
          });
        }

        if (
          eventType === "invoice.payment_failed" &&
          current.status === "active"
        ) {
          await tx.subscription.update({
            where: { subscriptionCode },
            data: { status: "past_due" },
          });
        }
      }

      // Other events, including charge.success and invoice events,
      // are saved for subsequent reconciliation.
      //
      // Never activate subscriptions using only a customer's email:
      // the same customer can have multiple subscriptions.

      return { duplicate: false };
    });

    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
    });
  } catch (error) {
    // Do not log payloads, email tokens, or connection strings.
    console.error("Paystack webhook processing failed.", {
      eventType,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });

    // Failed processing rolls back the transaction, including
    // the event record, so a retry can attempt processing again.
    return NextResponse.json(
      { message: "Webhook processing failed. Please retry." },
      { status: 500 },
    );
  }
}