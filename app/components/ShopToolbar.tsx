"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

const categories = ["all", "subscription", "baby", "beauty", "wellness"];

export default function ShopToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQ = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "all";

  const [q, setQ] = useState(urlQ);
  const [category, setCategory] = useState(urlCategory);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelPendingSearch() {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }

  useEffect(() => {
    setQ(urlQ);
    setCategory(urlCategory);
  }, [urlQ, urlCategory]);

  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function pushFilters(nextQ: string, nextCategory: string) {
    const params = new URLSearchParams();

    if (nextQ.trim()) {
      params.set("q", nextQ.trim());
    }

    if (nextCategory !== "all") {
      params.set("category", nextCategory);
    }

    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop");
  }

  function onSearchChange(e: ChangeEvent<HTMLInputElement>) {
    const nextQ = e.target.value;
    setQ(nextQ);
    cancelPendingSearch();

    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      pushFilters(nextQ, category);
    }, 250);
  }

  function onCategoryChange(e: ChangeEvent<HTMLSelectElement>) {
    const nextCategory = e.target.value;
    cancelPendingSearch();

    // Subscription opens both Farm Box and Wellness options.
    if (nextCategory === "subscription") {
      router.push("/subscription");
      return;
    }

    // Other categories remain normal product filters.
    setCategory(nextCategory);
    setQ("");
    pushFilters("", nextCategory);
  }

  function clearAll() {
    cancelPendingSearch();
    setQ("");
    setCategory("all");
    router.replace("/shop");
  }

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
      <input
        aria-label="Search products"
        value={q}
        onChange={onSearchChange}
        placeholder="Search products..."
        className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-[#556B2F]"
      />

      <select
        aria-label="Filter by category"
        value={category}
        onChange={onCategoryChange}
        className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-[#556B2F]"
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            {item[0].toUpperCase() + item.slice(1)}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={clearAll}
        className="h-11 rounded-md border border-[#556B2F] px-5 text-[#556B2F] hover:bg-[#f3f7ea]"
      >
        Reset
      </button>
    </div>
  );
}