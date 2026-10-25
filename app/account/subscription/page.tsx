"use client";

import { useState } from "react";

export default function AccountSubscriptionPage() {
  const [subscriptionCode, setSubscriptionCode] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function cancelSubscription() {
    setResult("");
    setLoading(true);

    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionCode: subscriptionCode || undefined,
          customerEmail: customerEmail || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResult(data?.message || "Failed to cancel subscription.");
      } else {
        setResult("Subscription cancelled successfully.");
      }
    } catch {
      setResult("Could not contact server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#184d2d]">Manage Subscription</h1>
      <p className="mt-2 text-sm text-gray-700">
        Enter your subscription code or email to cancel your recurring subscription.
      </p>

      <div className="mt-6 space-y-3 rounded-xl border border-[#dbe7c5] bg-white p-4">
        <input
          value={subscriptionCode}
          onChange={(e) => setSubscriptionCode(e.target.value)}
          placeholder="Subscription code (e.g. SUB_xxx)"
          className="w-full rounded-md border px-3 py-2"
        />

        <input
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="Email address"
          className="w-full rounded-md border px-3 py-2"
        />

        <button
          onClick={cancelSubscription}
          disabled={loading}
          className="rounded-md bg-red-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Cancelling..." : "Cancel Subscription"}
        </button>

        {result ? (
          <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-800">{result}</p>
        ) : null}
      </div>
    </main>
  );
}