"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Farm Subscription Box",
    subtitle: "Explore our farm-fresh produce boxes.",
    image: "/images/hero/slide-1.jpg",
    cta: "Shop Farm Box",
    href: "/shop?category=subscription",
  },
  {
    title: "Wellness & Nutrition",
    subtitle: "Explore our wellness collection.",
    image: "/images/hero/slide-2.jpg",
    cta: "Shop Wellness",
    href: "/shop?category=wellness",
  },
  {
    title: "Essentials for Your Family",
    subtitle: "Browse baby, beauty, and everyday essentials.",
    image: "/images/hero/slide-3.jpg",
    cta: "Shop All",
    href: "/shop",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovering, setHovering] = useState(false);

  const current = slides[index];

  // Autoplay unless the visitor prefers reduced motion
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPlaying(!reduce.matches);
  }, []);

  useEffect(() => {
    if (!playing || hovering) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [playing, hovering]);

  function go(direction: number) {
    setPlaying(false);
    setIndex((i) => (i + direction + slides.length) % slides.length);
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Living Waters adverts"
      className="mx-auto w-full max-w-6xl px-4 py-4"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <article
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${slides.length}`}
        className="grid items-center gap-4 rounded-2xl border border-[#dbe7c5] bg-white p-3 md:grid-cols-[3fr_2fr] md:p-4"
      >
        <figure className="relative h-[190px] w-full overflow-hidden rounded-2xl sm:h-[240px] lg:h-[300px]">
          <Image
            key={current.image}
            src={current.image}
            alt={current.title}
            fill
            unoptimized
            loading="eager"
            sizes="(min-width: 768px) 60vw, 100vw"
            className="rounded-2xl object-cover"
          />
        </figure>

        <div className="px-1 pb-1 md:px-2">
          <h2 className="text-xl font-bold text-[#184d2d] sm:text-2xl">
            {current.title}
          </h2>
          <p className="mt-2 text-gray-700">{current.subtitle}</p>

          <Link
            href={current.href}
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#556B2F] px-6 font-semibold text-white hover:bg-[#3f5222]"
          >
            {current.cta}
          </Link>
        </div>
      </article>

      <div
        role="group"
        aria-label="Advert controls"
        className="mt-2 flex items-center justify-center gap-2"
      >
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous advert"
          className="h-10 w-10 rounded-full border border-[#dbe7c5] text-xl text-[#184d2d]"
        >
          ‹
        </button>

        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => {
              setPlaying(false);
              setIndex(i);
            }}
            aria-label={`Show advert ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className="flex h-10 w-7 items-center justify-center"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                i === index ? "bg-[#556B2F]" : "bg-[#dbe7c5]"
              }`}
            />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="min-h-10 rounded-full border border-[#dbe7c5] px-4 text-sm font-semibold text-[#184d2d]"
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next advert"
          className="h-10 w-10 rounded-full border border-[#dbe7c5] text-xl text-[#184d2d]"
        >
          ›
        </button>
      </div>
    </section>
  );
}