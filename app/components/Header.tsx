import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#dbe7c5] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="mailto:stellarmazibuko@gmail.com"
          className="text-sm font-medium text-[#556B2F] hover:underline"
        >
          Email
        </Link>

        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/brand/living-waters-logo.png.jpeg"
            alt="Living Waters"
            width={42}
            height={42}
            className="rounded-full"
          />
          <span className="hidden text-lg font-extrabold tracking-wide text-[#184d2d] sm:inline">
            LIVING WATERS
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="rounded-md border border-[#556B2F] px-3 py-1.5 text-sm font-medium text-[#556B2F] hover:bg-[#edf4df]"
          >
            Cart
          </Link>
          <a
            href="https://wa.me/27649354540"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-[#25D366] px-3 py-1.5 text-sm font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}