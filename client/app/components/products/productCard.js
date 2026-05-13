"use client";

import Image from "next/image";

export default function ProductCard({ item, isComingSoon }) {
  return (
    <div className="group bg-white rounded-3xl border border-[#AFAFAF]/20 overflow-hidden hover:shadow-xl hover:shadow-black/10 transition-all duration-300">

      {/* Image / Top Section */}
      <div className="h-64 bg-[#FAFAFB] flex items-center justify-center p-8 relative">

        {/* Badge */}
        <div className="absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-semibold tracking-wider uppercase shadow-sm text-[#3E1747]/70 bg-white">
          {isComingSoon ? "Coming Soon" : item.badge}
        </div>

        {/* EMPTY STATE DESIGN */}
        {isComingSoon ? (
          <div className="flex flex-col items-center text-center px-6">

            {/* Glow Icon */}
            <div className="w-16 h-16 rounded-full bg-[#4EDDE2]/10 flex items-center justify-center mb-4">
              <div className="w-6 h-6 rounded-full bg-[#4EDDE2]" />
            </div>

            <h3 className="text-lg font-semibold text-[#111111] mb-2">
              Products Coming Soon
            </h3>

            <p className="text-sm text-[#3E1747]/60">
              We’re crafting premium, science-backed products to elevate your transformation.
            </p>

          </div>
        ) : (
          <>
            {/* Normal Image */}
            {item.image && (
              <Image
                src={item.image}
                alt={item.title}
                width={160}
                height={160}
                className="object-contain mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Content */}
      <div className="p-6">

        {!isComingSoon && (
          <>
            <h3 className="text-lg font-semibold tracking-tight text-[#111111] mb-1">
              {item.title}
            </h3>

            <p className="text-xs text-[#3E1747]/60 font-light mb-4">
              {item.description}
            </p>
          </>
        )}

        <div className="flex justify-between items-center">

          {/* Price only when available */}
          {!isComingSoon && (
            <span className="font-medium text-[#111111]">
              ₹{item.price.toLocaleString("en-IN")}
            </span>
          )}

          <button className="text-xs font-medium text-[#3E1747] border border-[#3E1747]/20 px-3 py-1.5 rounded-lg hover:bg-[#3E1747] hover:text-white transition-all duration-300">
            Coming Soon
          </button>

        </div>

      </div>
    </div>
  );
}