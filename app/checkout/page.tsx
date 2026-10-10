"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { getCart } from "../lib/cart";
import type { CartItem } from "../lib/cart";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

    useEffect(() => {
    setItems(getCart());

    const handlePageShow = () => {
      setLoading(false);
      setError("");
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  async function handlePay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;
    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      setError("Please fill in all customer details.");
      return;
    }

    if (
      items.length === 0 ||
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      setError("Your cart is empty or has an invalid total.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          amount: subtotal,
          metadata: {
            name: name.trim(),
            phone: phone.trim(),
            address: address.trim(),
            items,
          },
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.authorization_url) {
        throw new Error(
          data?.message ||
            `Could not start payment (HTTP ${response.status}).`
        );
      }

      // Open Paystack checkout, NOT our payment-results page.
      window.location.assign(data.authorization_url);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not start payment. Please try again."
      );
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900";

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-4xl font-bold text-[#7b9b42]">
          Checkout
        </h1>
        <p className="mt-2 text-gray-300">
          Paystack test checkout — do not use real card details.
        </p>

        <form onSubmit={handlePay} className="mt-8 grid gap-6">
          <section className="rounded-xl bg-white p-6 text-gray-900">
            <h2 className="mb-4 text-xl font-bold">
              Customer Details
            </h2>

            <div className="grid gap-4">
              <label className="grid gap-1">
                <span>Full name</span>
                <input
                  className={inputClass}
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>

              <label className="grid gap-1">
                <span>Email address</span>
                <input
                  className={inputClass}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label className="grid gap-1">
                <span>Phone number</span>
                <input
                  className={inputClass}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>

              <label className="grid gap-1">
                <span>Delivery address</span>
                <textarea
                  className={inputClass}
                  name="address"
                  autoComplete="street-address"
                  placeholder="Street, suburb, city, province and postal code"
                  required
                  rows={3}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="rounded-xl bg-[#f6f8f2] p-6 text-gray-900">
            <h2 className="mb-3 text-xl font-bold">
              Order Summary
            </h2>

            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.slug}
                    className="flex justify-between gap-4"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      R {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 text-lg font-bold">
              Total: R {subtotal.toFixed(2)}
            </p>

            {error && (
              <p role="alert" className="mt-4 text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || items.length === 0}
              className="mt-4 rounded-md bg-[#556B2F] px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Starting payment..." : "Pay by Card"}
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}