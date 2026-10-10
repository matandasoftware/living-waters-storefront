import Link from "next/link";
import { SUBSCRIPTION_TYPES } from "./subscriptions";

export default function SubscriptionPlans() {
  return (
    <section
      aria-labelledby="subscription-type-heading"
      className="mx-auto w-full max-w-6xl px-4 py-8"
    >
      <header className="mb-5">
        <h2
          id="subscription-type-heading"
          className="text-2xl font-bold text-[#184d2d]"
        >
          Choose Subscription Type
        </h2>
        <p className="mt-1 text-gray-600">
          Start by selecting Fruit & Veg Box or Wellness Subscription.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {SUBSCRIPTION_TYPES.map((type) => (
          <article
            key={type.id}
            className="rounded-xl border border-[#dbe7c5] bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[#184d2d]">{type.name}</h3>
            <p className="mt-2 text-sm text-gray-700">{type.description}</p>

            <div className="mt-4">
              <Link
                href={`/subscription?type=${type.id}`}
                className="inline-flex min-h-10 items-center rounded-md bg-[#556B2F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3f5222]"
              >
                Continue
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}