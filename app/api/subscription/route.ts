import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ message: "Missing PAYSTACK_SECRET_KEY" }, { status: 500 });
    }

    const body = await req.json();
    const { subscriptionCode, customerEmail } = body as {
      subscriptionCode?: string;
      customerEmail?: string;
    };

    if (!subscriptionCode && !customerEmail) {
      return NextResponse.json(
        { message: "subscriptionCode or customerEmail is required" },
        { status: 400 }
      );
    }

    const sub = subscriptionCode
      ? await prisma.subscription.findUnique({ where: { subscriptionCode } })
      : await prisma.subscription.findFirst({ where: { customerEmail } });

    if (!sub) {
      return NextResponse.json({ message: "Subscription not found" }, { status: 404 });
    }

    if (!sub.paystackCustomerCode || !sub.subscriptionCode) {
      return NextResponse.json(
        { message: "Missing Paystack identifiers on subscription record" },
        { status: 400 }
      );
    }

    const res = await fetch("https://api.paystack.co/subscription/disable", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: sub.subscriptionCode,
        token: sub.paystackCustomerCode,
      }),
    });

    const json = await res.json();

    if (!res.ok || !json?.status) {
      return NextResponse.json(
        { message: json?.message || "Failed to disable subscription" },
        { status: 500 }
      );
    }

    await prisma.subscription.update({
      where: { subscriptionCode: sub.subscriptionCode },
      data: { status: "cancelled" },
    });

    return NextResponse.json({ ok: true, message: "Subscription cancelled" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}