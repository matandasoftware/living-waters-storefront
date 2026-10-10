"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  PLAN_OPTIONS,
  SUBSCRIPTION_TYPES,
  SubscriptionPlan,
  SubscriptionType,
} from "../components/subscriptions";

export default function SubscriptionPage() {
  const [type, setType] = useState<SubscriptionType | "">("");
  const [plan, setPlan] = useState<SubscriptionPlan | "">("");

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedType = useMemo(
    () => SUBSCRIPTION_TYPES.find((t) => t.id === type),
    [type]
  );
  const selectedPlan = useMemo(
    () => PLAN_OPTIONS.find((p) => p.id === plan),
    [plan]
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!type || !plan || !name || !whatsapp || !email || !address) return;

    // Placeholder for backend/API save
    setSubmitted(true);

    // Optional: prefill WhatsApp message
    const msg = encodeURIComponent(
      `Hello Living Waters, I want to subscribe.\nType: ${selectedType?.name}\nPlan: ${selectedPlan?.name}\nName: ${name}\nWhatsApp: ${whatsapp}\nEmail: ${email}\nAddress: ${address}\nNotes: ${notes || "-"}`
    );
    window.open(`https://wa.me/27649354540?text=${msg}`, "_blank");
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#184d2d]">Start Subscription</h1>
      <p className="mt-1 text-gray-600">
        Choose your subscription type and plan.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <section className="rounded-xl border border-[#dbe7c5] bg-white p-4">
          <h2 className="text-lg font-semibold text-[#184d2d]">
            1) Choose Subscription Type
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {SUBSCRIPTION_TYPES.map((item) => (
              <label
                key={item.id}
                className={`cursor-pointer rounded-lg border p-3 ${
                  type === item.id
                    ? "border-[#556B2F] bg-[#edf4df]"
                    : "border-[#dbe7c5]"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={item.id}
                  checked={type === item.id}
                  onChange={() => setType(item.id)}
                  className="mr-2"
                />
                <span className="font-semibold text-[#184d2d]">{item.name}</span>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#dbe7c5] bg-white p-4">
          <h2 className="text-lg font-semibold text-[#184d2d]">
            2) Choose Plan
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {PLAN_OPTIONS.map((item) => (
              <label
                key={item.id}
                className={`cursor-pointer rounded-lg border p-3 ${
                  plan === item.id
                    ? "border-[#556B2F] bg-[#edf4df]"
                    : "border-[#dbe7c5]"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={item.id}
                  checked={plan === item.id}
                  onChange={() => setPlan(item.id)}
                  className="mr-2"
                />
                <span className="font-semibold text-[#184d2d]">{item.name}</span>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#dbe7c5] bg-white p-4">
          <h2 className="text-lg font-semibold text-[#184d2d]">
            3) Your Details
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-md border border-[#dbe7c5] px-3 py-2"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="rounded-md border border-[#dbe7c5] px-3 py-2"
              placeholder="WhatsApp number"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />
            <input
              type="email"
              className="rounded-md border border-[#dbe7c5] px-3 py-2"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="rounded-md border border-[#dbe7c5] px-3 py-2"
              placeholder="Delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <textarea
            className="mt-3 w-full rounded-md border border-[#dbe7c5] px-3 py-2"
            placeholder="Preferences / allergies / items to include or exclude"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <button
          type="submit"
          className="rounded-md bg-[#556B2F] px-5 py-2.5 font-semibold text-white hover:bg-[#3f5222]"
        >
          Submit Subscription
        </button>

        {submitted && (
          <p className="text-sm text-green-700">
            Subscription request captured. We also opened WhatsApp to confirm faster.
          </p>
        )}
      </form>
    </main>
  );
}