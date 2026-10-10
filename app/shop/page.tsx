import ProductCard from "../components/ProductCard";
import ShopToolbar from "../components/ShopToolbar";
import { PRODUCTS } from "../../lib/products";

type ShopPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { q = "", category = "all" } = await searchParams;

  const term = q.trim().toLowerCase();
  const activeCategory = (category || "all").trim().toLowerCase();

  const filtered = PRODUCTS.filter((p) => {
    const matchesSearch = term ? p.name.toLowerCase().includes(term) : true;
    const matchesCategory = activeCategory === "all" ? true : p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-[#556B2F]">Shop Online</h1>
      <p className="mt-2 text-gray-700">Find your perfect product quickly.</p>

      <ShopToolbar />

      {(q || (category && category !== "all")) && (
        <p className="mt-4 text-sm text-gray-600">
          {q ? <>Search: <b>{q}</b> </> : null}
          {category && category !== "all" ? <>Category: <b>{category}</b></> : null}
        </p>
      )}

      <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            href={`/product/${product.slug}`}
            category={product.category}
          />
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="mt-8 text-gray-600">No products found.</p>
      ) : null}
    </main>
  );
}