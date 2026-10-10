"use client";

import { addToCart } from "../lib/cart";

type AddToCartButtonProps = {
  slug: string;
  name: string;
  price: number;
  image: string;
};

export default function AddToCartButton({
  slug,
  name,
  price,
  image,
}: AddToCartButtonProps) {
  const handleAdd = () => {
    addToCart({ slug, name, price, image });
    alert(`${name} added to cart`);
  };

  return (
    <button
      onClick={handleAdd}
      className="mt-6 rounded-md bg-[#556B2F] text-white px-5 py-3 font-medium hover:opacity-90"
    >
      Add to Cart
    </button>
  );
}