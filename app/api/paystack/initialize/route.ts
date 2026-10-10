import { NextResponse } from "next/server";

type CartItem = {
  slug: string;
  name: string;
  price: number;
  quantity: number;
};

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

    const body = await request.json();
    const { email, amount, metadata } = body as {
      email: string;
      amount: number;
      metadata?: {
        name?: string;
        phone?: string;
        address?: string;
        items?: CartItem[];
      };
    };

    if (!email || !amount || amount <= 0) {
      return NextResponse.json(
        { message: "Email and valid amount are required" },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(amount * 100);

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInCents,
        currency: "ZAR",
        callback_url: `${baseUrl}/checkout/success`,
        metadata: metadata ?? {},
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