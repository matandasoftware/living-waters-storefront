export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const CART_KEY = "living_waters_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = localStorage.getItem(CART_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "quantity">): void {
  const cart = getCart();
  const existing = cart.find((i) => i.slug === item.slug);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
}