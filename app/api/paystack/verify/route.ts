import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { message: "Missing PAYSTACK_SECRET_KEY" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { message: "Reference is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        { message: data?.message || "Verification failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      paid: data.data.status === "success",
      reference: data.data.reference,
      amount: data.data.amount / 100,
      currency: data.data.currency,
      customerEmail: data.data.customer?.email ?? null,
      rawStatus: data.data.status,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error while verifying payment", error },
      { status: 500 }
    );
  }
}