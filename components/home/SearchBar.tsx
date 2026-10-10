"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();

    if (!query) {
      router.push("/shop");
      return;
    }

    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products..."
        className="h-11 w-full rounded-md border px-3 outline-none focus:ring-2 focus:ring-[#556B2F]"
      />
      <button
        type="submit"
        className="h-11 rounded-md bg-[#556B2F] px-5 text-white"
      >
        Search
      </button>
    </form>
  );
}