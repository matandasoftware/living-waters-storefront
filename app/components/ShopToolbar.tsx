"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const categories = ["all", "subscription", "baby", "beauty", "wellness"];

export default function ShopToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQ = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "all";

  const [q, setQ] = useState(urlQ);
  const [category, setCategory] = useState(urlCategory);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Keep local state synced with URL (important for back/forward nav)
  useEffect(() => {
    setQ(urlQ);
    setCategory(urlCategory);
  }, [urlQ, urlCategory]);

  const pushFilters = (nextQ: string, nextCategory: string) => {
    const params = new URLSearchParams();

    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (nextCategory !== "all") params.set("category", nextCategory);

    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop");
  };

  // Instant search as user types (debounced)
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextQ = e.target.value;
    setQ(nextQ);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushFilters(nextQ, category);
    }, 250);
  };

  const onCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextCategory = e.target.value;
    setCategory(nextCategory);

    // Your requested behavior:
    // - picking any category clears old search
    // - picking "all" also clears search and shows all products
    setQ("");
    pushFilters("", nextCategory);
  };

  const clearAll = () => {
    setQ("");
    setCategory("all");
    router.replace("/shop");
  };

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_180px_auto]">
      <input
        value={q}
        onChange={onSearchChange}
        placeholder="Search products..."
        className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-[#556B2F]"
      />

      <select
        value={category}
        onChange={onCategoryChange}
        className="h-11 rounded-md border px-3 outline-none focus:ring-2 focus:ring-[#556B2F]"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c[0].toUpperCase() + c.slice(1)}
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