"use client";

import ProductCard from "@/app/components/products/productCard.js";

// 👉 Example data (keep empty for now)
const products = [
  // Example:
  // {
  //   badge: "Phase 1",
  //   title: "Bio-Active Isolate",
  //   description: "Cold-filtered whey protein isolate",
  //   price: 5400,
  //   image: "https://images.unsplash.com/photo-1562243061-204550d8a2c9"
  // },
  // {
  //   badge: "Phase 2",
  //   title: "Performance Stack",
  //   description: "Pre-workout and recovery blend",
  //   price: 7200,
  //   image: "https://images.unsplash.com/photo-1589923188900-9c3a1eaa1b8c"
  // },
  // {
  //   badge: "Phase 3",
  //   title: "Daily Essentials",
  //   description: "Vitamins, minerals, and adaptogens",
  //   price: 3600,
  //   image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e"
  // }
];

export default function ProductsSection() {
  const isEmpty = products.length === 0;

  return (
    <section className="relative pt-[50%] md:pt-32 pb-32 bg-[#FAFAFB] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Background */}
        <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-[#4EDDE2]/15 blur-3xl rounded-full" />
        

        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">

            <span className="text-[#4EDDE2] text-sm font-semibold tracking-widest uppercase mb-3 block">
              Coming Soon
            </span>

            <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[#111111] mb-4">
              XVITAL Products
            </h2>

            <p className="text-[#3E1747]/60 text-base font-light">
              Clinical-grade formulations designed to work synergistically with
              your personalized nutrition protocol.
            </p>

          </div>
        </div>

        {/* Layout Switch */}
        <div
          className={
            isEmpty
              ? "flex justify-center"
              : "grid md:grid-cols-3 gap-8"
          }
        >
          {isEmpty ? (
            <div className="w-full max-w-xl">
              <ProductCard isComingSoon />
            </div>
          ) : (
            products.map((item, index) => (
              <ProductCard key={index} item={item} />
            ))
          )}
        </div>

      </div>
    </section>
  );
}