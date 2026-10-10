const messages = [
  "🚚 Free delivery on orders over $50",
  "🌿 100% natural & organic products",
  "💳 Secure payments with Paystack",
  "📞 Personalized nutrition guidance available",
];

export default function AnnouncementBar() {
  const items = [...messages, ...messages];

  return (
    <div className="overflow-hidden bg-[#556B2F] py-2 text-sm text-white">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {items.map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  );
}