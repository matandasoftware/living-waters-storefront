import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      <Image
        src="/images/hero.jpg"
        alt="Living Waters hero"
        width={1600}
        height={700}
        priority
        className="h-[380px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 flex items-center">
        <div className="px-6 md:px-10 text-white">
          <h1 className="text-3xl md:text-5xl font-bold">Natural Care, Everyday Glow</h1>
          <p className="mt-3 text-sm md:text-base max-w-xl">
            Discover clean skincare and wellness essentials made for your daily routine.
          </p>
        </div>
      </div>
    </section>
  );
}