"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const items = [
  { label: "Home", href: "/", icon: "⌂" },
  { label: "Subscriptions", href: "/subscription", icon: "📦" },
  { label: "Farm Box", href: "/subscription?type=fruit-veg", icon: "🥬" },
  { label: "Shop All", href: "/shop", icon: "🛒" },
  { label: "Baby", href: "/shop?category=baby", icon: "🍼" },
  { label: "Beauty", href: "/shop?category=beauty", icon: "✨" },
  { label: "Wellness", href: "/subscription?type=wellness", icon: "🌿" },
];

export default function CategoryGrid() {
  const topNavRef = useRef<HTMLElement>(null);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    const topNav = topNavRef.current;
    if (!topNav) return;

    // Bottom bar shows only while the top menu is off-screen.
    const observer = new IntersectionObserver(([entry]) => {
      setShowBottom(!entry.isIntersecting);
    });

    observer.observe(topNav);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Small top menu */}
      <nav
        ref={topNavRef}
        aria-label="Shop categories"
        className="border-b border-[#dbe7c5] bg-white"
      >
        <ul className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 py-2">
          {items.map((item) => (
            <li key={item.label} className="shrink-0">
              <Link
                href={item.href}
                className="flex min-h-10 items-center gap-1.5 rounded-full border border-[#dbe7c5] px-4 text-sm font-semibold text-[#184d2d] hover:bg-[#edf4df]"
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom bar: appears instantly once the top menu scrolls away */}
      <nav
        aria-label="Quick shop navigation"
        hidden={!showBottom}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dbe7c5] bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <ul className="mx-auto grid h-16 w-full max-w-6xl grid-cols-7">
          {items.map((item) => (
            <li key={item.label} className="min-w-0">
              <Link
                href={item.href}
                className="flex h-full flex-col items-center justify-center gap-0.5 px-1 text-[#184d2d] hover:bg-[#edf4df]"
              >
                <span aria-hidden="true" className="text-xl">
                  {item.icon}
                </span>
                <span className="text-center text-[10px] font-semibold sm:text-xs">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}