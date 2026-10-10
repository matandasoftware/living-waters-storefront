import Link from "next/link";
import ProductCard from "./ProductCard";
import { PRODUCTS } from "../../lib/products";

export default function ProductsSection() {
  return (
    <section
      aria-labelledby="featured-products-heading"
      className="mx-auto w-full max-w-6xl px-4 py-6"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2
          id="featured-products-heading"
          className="text-2xl font-bold text-[#556B2F]"
        >
          Featured Products
        </h2>

        <Link
          href="/shop"
          className="font-medium text-[#556B2F] hover:underline"
        >
          Browse all products →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            href={`/product/${product.slug}`}
            category={product.category}
          />
        ))}
      </div>
    </section>
  );
}