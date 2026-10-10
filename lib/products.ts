export type Product = {
  id: number;
  slug: string;
  name: string;
  price: string;
  image: string;
  category: "subscription" | "baby" | "beauty" | "wellness";
  description: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "fresh-veggie-box",
    name: "Fresh Veggie Box",
    price: "$29.99",
    image: "/images/products/veggie-box.jpg",
    category: "subscription",
    description: "Weekly farm-fresh vegetables for healthy home cooking.",
  },
  {
    id: 2,
    slug: "organic-baby-cereal",
    name: "Organic Baby Cereal",
    price: "$12.50",
    image: "/images/products/baby-cereal.jpg",
    category: "baby",
    description: "Gentle organic cereal designed for baby nutrition.",
  },
  {
    id: 3,
    slug: "herbal-face-cleanser",
    name: "Herbal Face Cleanser",
    price: "$18.00",
    image: "/images/products/face-cleanser.jpg",
    category: "beauty",
    description: "Natural cleanser with soothing herbal ingredients.",
  },
  {
    id: 4,
    slug: "wellness-tea-mix",
    name: "Wellness Tea Mix",
    price: "$14.00",
    image: "/images/products/wellness-tea.jpg",
    category: "wellness",
    description: "A calming tea blend for daily wellness support.",
  },
];