"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function TopTicker() {
  const tickerRef = useRef();

  useGSAP(() => {
    const el = tickerRef.current;

    gsap.to(el, {
      xPercent: -50,
      duration: 13.33,
      ease: "linear",
      repeat: -1,
    });
  }, []);

  return (
    <div className="w-full bg-[#FFD84D] overflow-hidden py-2">
      <div
        ref={tickerRef}
        className="flex whitespace-nowrap text-sm font-medium text-[#3E1747] gap-10"
      >
        {/* Duplicate content for seamless loop */}
        <span>✨ Not A Deit. A System.</span>
        <span>✨ Built For Your Body</span>
        <span>✨ Fix The Root Cause First</span>
        <span>✨ Energy Without Crashes</span>
        <span>✨ Made For Indian Lifestyles</span>
        <span>✨ Clean. Proven. Vital.</span>

        {/* Duplicate again */}
        <span>✨ Not A Deit. A System.</span>
        <span>✨ Built For Your Body</span>
        <span>✨ Fix The Root Cause First</span>
        <span>✨ Energy Without Crashes</span>
        <span>✨ Made For Indian Lifestyles</span>
        <span>✨ Clean. Proven. Vital.</span>
      </div>
    </div>
  );
}