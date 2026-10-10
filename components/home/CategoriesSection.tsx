import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Skincare", image: "/images/categories/skincare.jpg", href: "/shop?category=skincare" },
  { name: "Body Care", image: "/images/categories/bodycare.jpg", href: "/shop?category=bodycare" },
  { name: "Hair Care", image: "/images/categories/haircare.jpg", href: "/shop?category=haircare" },
];

export default function CategoriesSection() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Link href="/shop" className="text-sm text-[#556B2F]">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.name} href={c.href} className="group overflow-hidden rounded-xl border">
            <div className="relative h-44 w-full">
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3 font-medium">{c.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}