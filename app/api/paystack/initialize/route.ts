import { NextResponse } from "next/server";
import {
  PAYSTACK_PLAN_CODES,
  PLAN_PRICING,
  SubscriptionPlan,
  SubscriptionType,
} from "../../../components/subscriptions";

type InitializeBody = {
  email: string;
  type: SubscriptionType;
  plan: SubscriptionPlan;
  metadata?: {
    name?: string;
    phone?: string;
    address?: string;
    notes?: string;
    deliveryDay?: string;
  };
};

const VALID_TYPES: SubscriptionType[] = ["fruit-veg", "wellness"];
const VALID_PLANS: SubscriptionPlan[] = [
  "weekly-seasonal",
  "monthly-seasonal",
  "custom-weekly",
  "custom-monthly",
];

function isValidType(value: string): value is SubscriptionType {
  return VALID_TYPES.includes(value as SubscriptionType);
}

function isValidPlan(value: string): value is SubscriptionPlan {
  return VALID_PLANS.includes(value as SubscriptionPlan);
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!secretKey || !baseUrl) {
      return NextResponse.json(
        { message: "Missing PAYSTACK_SECRET_KEY or NEXT_PUBLIC_BASE_URL" },
        { status: 500 }
      );
    }

    const body = (await request.json()) as InitializeBody;
    const { email, metadata } = body;
    const rawType = body.type;
    const rawPlan = body.plan;

    if (!email || !rawType || !rawPlan) {
      return NextResponse.json(
        { message: "email, type and plan are required" },
        { status: 400 }
      );
    }

    if (!isValidType(rawType) || !isValidPlan(rawPlan)) {
      return NextResponse.json(
        { message: "Invalid subscription type or plan" },
        { status: 400 }
      );
    }

    const type = rawType;
    const plan = rawPlan;

    // Server-authoritative pricing (DO NOT trust client amount)
    const expectedAmountMinor = PLAN_PRICING[type][plan];
    if (!expectedAmountMinor || expectedAmountMinor <= 0) {
      return NextResponse.json(
        { message: "Invalid configured amount for selected plan" },
        { status: 500 }
      );
    }

    // Plan code for recurring renewals
     const planCode = PAYSTACK_PLAN_CODES[type][plan];
     if (!planCode || !planCode.startsWith("PLN_")) {
      return NextResponse.json(
        {
          message:
            "Paystack plan code is not configured. Set real values in app/components/subscriptions.ts",
        },
        { status: 500 }
      );
    }

    const callbackUrl = `${baseUrl}/checkout/success?flow=subscription`;

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: expectedAmountMinor, // already in minor units (kobo/cents)
        currency: "ZAR",
        plan: planCode, // attaches recurring plan
        callback_url: callbackUrl,
        metadata: {
          kind: "subscription",
          subscriptionType: type,
          subscriptionPlan: plan,
          ...metadata,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData?.status) {
      return NextResponse.json(
        {
          message: paystackData?.message || "Failed to initialize payment",
          debug: paystackData,
        },
        { status: 500 }
      );
    }

    const authorizationUrl = paystackData?.data?.authorization_url;
    const reference = paystackData?.data?.reference;

    if (!authorizationUrl) {
      return NextResponse.json(
        {
          message: "Paystack did not return authorization_url",
          debug: paystackData,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      authorization_url: authorizationUrl,
      reference,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error while initializing payment", error },
      { status: 500 }
    );
  }
}