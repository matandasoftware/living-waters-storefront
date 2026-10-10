import Link from "next/link";

async function verifyPayment(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    return { ok: false, paid: false, message: "Server is missing PAYSTACK_SECRET_KEY." };
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.status) {
      return {
        ok: false,
        paid: false,
        message: json?.message || `Verify failed (HTTP ${res.status}).`,
      };
    }

    const status = json?.data?.status;
    const paid = status === "success";

    return {
      ok: true,
      paid,
      message: paid
        ? "Payment successful. Subscription started."
        : `Payment not successful. Status: ${status || "unknown"}`,
      raw: status,
    };
  } catch {
    return { ok: false, paid: false, message: "Could not contact Paystack to verify payment." };
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string; flow?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference || params.trxref || "";
  const isSubscriptionFlow = params.flow === "subscription";

  let result = {
    ok: false,
    paid: false,
    message: "Missing payment reference in URL.",
  };

  if (reference) {
    result = await verifyPayment(reference);
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-[#556B2F]">Payment Result</h1>

        <div className="mt-6 rounded-xl border p-6">
          <p className={result.paid ? "font-medium text-green-700" : "font-medium text-red-700"}>
            {result.message}
          </p>

          {reference ? (
            <p className="mt-2 text-sm text-gray-600">Reference: {reference}</p>
          ) : null}

          {isSubscriptionFlow && result.paid ? (
            <p className="mt-2 text-sm text-gray-700">
              Your plan will renew automatically on its schedule until you unsubscribe.
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/subscription" className="rounded-md bg-[#556B2F] px-4 py-2 text-white">
            Back to Subscription
          </Link>
          <Link href="/shop" className="rounded-md border px-4 py-2">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}