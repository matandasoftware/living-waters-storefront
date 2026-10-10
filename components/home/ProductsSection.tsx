import Link from "next/link";
import Image from "next/image";
import { PRODUCTS } from "../../lib/products";

export default function ProductsSection() {
  const top = PRODUCTS.slice(0, 4);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#556B2F]">Best Sellers</h2>
        <Link href="/shop" className="text-sm text-[#556B2F] hover:underline">
          Browse shop
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {top.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            className="group block overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
          >
            <div className="relative h-44 w-full sm:h-48">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">{p.category}</p>
              <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900">{p.name}</h3>
              <p className="mt-2 text-sm font-medium text-[#556B2F]">{p.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}