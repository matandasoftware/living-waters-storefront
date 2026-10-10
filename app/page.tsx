import HeroSlider from "./components/HeroSlider";
import SubscriptionPlans from "./components/SubscriptionPlans";
import ProductsSection from "./components/ProductsSection";
import InfoBlocks from "./components/InfoBlocks";
import Footer from "./components/Footer";

export default function HomePage() {
  return (
    <>
      <main className="bg-white text-gray-900">
        <HeroSlider />
        <SubscriptionPlans />
        <ProductsSection />
        <section
          aria-label="Wellness information"
          className="mx-auto w-full max-w-6xl px-4 py-8"
        >
          <InfoBlocks />
        </section>
      </main>
      <Footer />
    </>
  );
}