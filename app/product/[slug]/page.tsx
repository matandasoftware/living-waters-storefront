import AddToCartButton from "../../components/AddToCartButton";
import { PRODUCTS } from "../../../lib/products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
        <p className="mt-2 text-gray-700">
          This product does not exist in the current template data.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-2 gap-8">
      <div className="rounded-xl border border-[#d9e2c3] bg-[#f6f8f2] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
      </div>

      <div>
        <p className="text-sm uppercase tracking-wide text-[#6b7f3b]">{product.category}</p>
        <h1 className="text-3xl font-bold text-[#556B2F] mt-1">{product.name}</h1>
        <p className="text-2xl font-semibold mt-3">{product.price}</p>
        <p className="mt-4 text-gray-700">{product.description}</p>

        <AddToCartButton
          slug={product.slug}
          name={product.name}
          price={Number(product.price.replace("$", ""))}
          image={product.image}
        />
      </div>
    </main>
  );
}