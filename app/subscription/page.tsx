"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PLAN_OPTIONS,
  PLAN_PRICING,
  SUBSCRIPTION_TYPES,
  SubscriptionPlan,
  SubscriptionType,
} from "../components/subscriptions";

export default function SubscriptionPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-4 py-8">
          Loading subscription options…
        </main>
      }
    >
      <SubscriptionRoute />
    </Suspense>
  );
}

function SubscriptionRoute() {
  const params = useSearchParams();

  const initialType =
    SUBSCRIPTION_TYPES.find((item) => item.id === params.get("type"))?.id ?? "";

  const initialPlan =
    PLAN_OPTIONS.find((item) => item.id === params.get("plan"))?.id ?? "";

  return (
    <SubscriptionForm
      key={`${initialType}:${initialPlan}`}
      initialType={initialType as SubscriptionType | ""}
      initialPlan={initialPlan as SubscriptionPlan | ""}
    />
  );
}

function SubscriptionForm({
  initialType,
  initialPlan,
}: {
  initialType: SubscriptionType | "";
  initialPlan: SubscriptionPlan | "";
}) {
  const router = useRouter();

  const [type, setType] = useState<SubscriptionType | "">(initialType);
  const [plan, setPlan] = useState<SubscriptionPlan | "">(initialPlan);

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [householdSize, setHouseholdSize] = useState("");
  const [excludeItems, setExcludeItems] = useState("");
  const [deliveryDay, setDeliveryDay] = useState("");

  const [wellnessGoals, setWellnessGoals] = useState("");
  const [conditions, setConditions] = useState("");
  const [preferredProducts, setPreferredProducts] = useState("");

  const [notes, setNotes] = useState("");

  const visibleTypes = initialType
    ? SUBSCRIPTION_TYPES.filter((item) => item.id === initialType)
    : SUBSCRIPTION_TYPES;

  const selectedType = useMemo(
    () => SUBSCRIPTION_TYPES.find((t) => t.id === type),
    [type]
  );

  const selectedPlan = useMemo(
    () => PLAN_OPTIONS.find((p) => p.id === plan),
    [plan]
  );

  const amount = useMemo(() => {
    if (!type || !plan) return 0;
    return PLAN_PRICING[type][plan];
  }, [type, plan]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!type || !plan || !name || !whatsapp || !email || !address) {
      alert("Please complete all required fields.");
      return;
    }

    if (type === "fruit-veg" && (!householdSize || !deliveryDay)) {
      alert("Please complete Fruit & Veg specific fields.");
      return;
    }

    if (type === "wellness" && !wellnessGoals) {
      alert("Please complete Wellness specific fields.");
      return;
    }

    const payload = {
      type,
      plan,
      typeLabel: selectedType?.name,
      planLabel: selectedPlan?.name,
      amount,
      name,
      whatsapp,
      email,
      address,
      notes,
      fruitVeg: {
        householdSize,
        excludeItems,
        deliveryDay,
      },
      wellness: {
        wellnessGoals,
        conditions,
        preferredProducts,
      },
    };

    if (amount === 0) {
      const message = encodeURIComponent(
        `Custom subscription request\nType: ${selectedType?.name}\nPlan: ${selectedPlan?.name}\nName: ${name}\nWhatsApp: ${whatsapp}\nEmail: ${email}\nAddress: ${address}\nDetails: ${JSON.stringify(
          type === "fruit-veg" ? payload.fruitVeg : payload.wellness
        )}\nNotes: ${notes || "-"}`
      );

      window.open(`https://wa.me/27649354540?text=${message}`, "_blank");
      return;
    }

    const qp = new URLSearchParams({
      type,
      plan,
      amount: String(amount),
      name,
      email,
      whatsapp,
    });

    sessionStorage.setItem("pending-subscription", JSON.stringify(payload));
    router.push(`/checkout/subscription?${qp.toString()}`);
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#184d2d]">
        {initialType === "fruit-veg"
          ? "Farm Box Subscription"
          : initialType === "wellness"
            ? "Wellness Subscription"
            : "Choose Your Subscription"}
      </h1>

      <p className="mt-1 text-gray-600">
        Choose your subscription type and plan.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <section className="rounded-xl border border-[#dbe7c5] bg-white p-4">
          <h2 className="text-lg font-semibold text-[#184d2d]">
            1) Subscription Type
          </h2>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {visibleTypes.map((item) => (
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
          <h2 className="text-lg font-semibold text-[#184d2d]">2) Plan</h2>

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
                  checked={plan === item.id}
                  onChange={() => setPlan(item.id)}
                  className="mr-2"
                />
                <span className="font-semibold text-[#184d2d]">{item.name}</span>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </label>
            ))}
          </div>

          {type && plan && (
            <p className="mt-3 text-sm font-semibold text-[#556B2F]">
              Price: {amount === 0 ? "Custom quote" : `$${(amount / 100).toFixed(2)}`}
            </p>
          )}
        </section>

        <section className="rounded-xl border border-[#dbe7c5] bg-white p-4">
          <h2 className="text-lg font-semibold text-[#184d2d]">3) Your Details</h2>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-md border border-[#dbe7c5] px-3 py-2"
              placeholder="Full name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className="rounded-md border border-[#dbe7c5] px-3 py-2"
              placeholder="WhatsApp *"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
            />

            <input
              type="email"
              className="rounded-md border border-[#dbe7c5] px-3 py-2"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="rounded-md border border-[#dbe7c5] px-3 py-2"
              placeholder="Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </section>

        {type === "fruit-veg" && (
          <section className="rounded-xl border border-[#dbe7c5] bg-white p-4">
            <h2 className="text-lg font-semibold text-[#184d2d]">
              4) Fruit & Veg Preferences
            </h2>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                className="rounded-md border border-[#dbe7c5] px-3 py-2"
                placeholder="Household size *"
                value={householdSize}
                onChange={(e) => setHouseholdSize(e.target.value)}
                required
              />

              <input
                className="rounded-md border border-[#dbe7c5] px-3 py-2"
                placeholder="Preferred delivery day *"
                value={deliveryDay}
                onChange={(e) => setDeliveryDay(e.target.value)}
                required
              />
            </div>

            <textarea
              className="mt-3 w-full rounded-md border border-[#dbe7c5] px-3 py-2"
              rows={3}
              placeholder="Items to exclude (optional)"
              value={excludeItems}
              onChange={(e) => setExcludeItems(e.target.value)}
            />
          </section>
        )}

        {type === "wellness" && (
          <section className="rounded-xl border border-[#dbe7c5] bg-white p-4">
            <h2 className="text-lg font-semibold text-[#184d2d]">
              4) Wellness Preferences
            </h2>

            <textarea
              className="w-full rounded-md border border-[#dbe7c5] px-3 py-2"
              rows={3}
              placeholder="Wellness goals *"
              value={wellnessGoals}
              onChange={(e) => setWellnessGoals(e.target.value)}
              required
            />

            <textarea
              className="mt-3 w-full rounded-md border border-[#dbe7c5] px-3 py-2"
              rows={3}
              placeholder="Conditions/allergies (optional)"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
            />

            <textarea
              className="mt-3 w-full rounded-md border border-[#dbe7c5] px-3 py-2"
              rows={3}
              placeholder="Preferred products (optional)"
              value={preferredProducts}
              onChange={(e) => setPreferredProducts(e.target.value)}
            />
          </section>
        )}

        <section className="rounded-xl border border-[#dbe7c5] bg-white p-4">
          <h2 className="text-lg font-semibold text-[#184d2d]">5) Notes</h2>

          <textarea
            className="mt-3 w-full rounded-md border border-[#dbe7c5] px-3 py-2"
            rows={4}
            placeholder="Any extra notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        <button
          type="submit"
          className="rounded-md bg-[#556B2F] px-5 py-2.5 font-semibold text-white hover:bg-[#3f5222]"
        >
          {amount === 0 ? "Send Custom Request" : "Proceed to Payment"}
        </button>
      </form>
    </main>
  );
}