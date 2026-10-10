"use client";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { getCart, saveCart, CartItem } from "../lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const increase = (slug: string) => {
    const updated = items.map((item) =>
      item.slug === slug ? { ...item, quantity: item.quantity + 1 } : item
    );
    setItems(updated);
    saveCart(updated);
  };

  const decrease = (slug: string) => {
    const updated = items
      .map((item) =>
        item.slug === slug ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    setItems(updated);
    saveCart(updated);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[#556B2F]">Your Cart</h1>

      {items.length === 0 ? (
        <p className="mt-4 text-gray-700">Your cart is empty.</p>
      ) : (
        <>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <article
                key={item.slug}
                className="rounded-xl border border-[#d9e2c3] p-4 flex items-center justify-between"
              >
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrease(item.slug)}
                    className="rounded-md border px-3 py-1"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increase(item.slug)}
                    className="rounded-md border px-3 py-1"
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-[#f6f8f2] p-4">
            <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
            <Link
  href="/checkout"
  className="mt-3 inline-block rounded-md bg-[#556B2F] text-white px-4 py-2"
>
  Proceed to Checkout
</Link>
          </div>
        </>
      )}
    </main>
  );
}