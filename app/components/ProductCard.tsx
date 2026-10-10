import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  name: string;
  price: string;
  image: string;
  href: string;
  category: string;
};

export default function ProductCard({ name, price, image, href, category }: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
    >
      <div className="relative h-44 w-full sm:h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">{category}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold text-gray-900">{name}</h3>
        <p className="mt-2 text-sm font-medium text-[#556B2F]">{price}</p>
      </div>
    </Link>
  );
}