"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SubscriptionCheckoutPage() {
  const params = useSearchParams();

  const type = params.get("type") || "";
  const plan = params.get("plan") || "";
  const name = params.get("name") || "";
  const email = params.get("email") || "";
  const whatsapp = params.get("whatsapp") || "";
  const amount = Number(params.get("amount") || 0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amountLabel = useMemo(
    () => `R${(amount / 100).toFixed(2)}`,
    [amount]
  );

  async function handlePay() {
    setError("");

    if (!email || !type || !plan) {
      setError("Missing required subscription details.");
      return;
    }

    setLoading(true);
    try {
      const pendingRaw =
        typeof window !== "undefined"
          ? sessionStorage.getItem("pending-subscription")
          : null;

      const pending = pendingRaw ? JSON.parse(pendingRaw) : null;

      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          type,
          plan,
          metadata: {
            name,
            phone: whatsapp,
            address: pending?.address ?? "",
            notes: pending?.notes ?? "",
            deliveryDay:
              type === "fruit-veg"
                ? pending?.fruitVeg?.deliveryDay ?? ""
                : "",
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Unable to initialize payment.");
        return;
      }

      if (!data?.authorization_url) {
        setError("Payment link not received from Paystack.");
        return;
      }

      window.location.href = data.authorization_url;
    } catch {
      setError("Could not connect to payment service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#184d2d]">Subscription Checkout</h1>

      <div className="mt-4 rounded-xl border border-[#dbe7c5] bg-white p-5">
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Plan:</strong> {plan}</p>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p className="mt-2 text-lg font-bold text-[#184d2d]">Amount: {amountLabel}</p>

        <p className="mt-3 text-sm text-gray-700">
          By paying, you authorize recurring charges for this subscription plan
          until you unsubscribe.
        </p>

        {error ? (
          <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          onClick={handlePay}
          disabled={loading}
          className="mt-4 rounded-md bg-[#556B2F] px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Redirecting..." : "Pay now"}
        </button>
      </div>
    </main>
  );
}