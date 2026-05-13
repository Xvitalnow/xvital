"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { registerToast } from "@/app/lib/toast";

export default function FeedbackToast() {
  const feedbackRef = useRef(null);
  const [toast, setToast] = useState(null);

  // register global handler
  useEffect(() => {
    registerToast(setToast);
  }, []);

  useEffect(() => {
    if (!toast || !feedbackRef.current) return;

    const el = feedbackRef.current;

    gsap.killTweensOf(el);

    // ENTRY animation
    gsap.fromTo(
      el,
      { opacity: 0, y: 24, x: 24, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.45,
        ease: "power3.out",
      }
    );

    const isLoading = toast.type === "loading";

    // EXIT animation (skip for loading)
    if (!isLoading) {
      gsap.to(el, {
        opacity: 0,
        y: 12,
        x: 12,
        scale: 0.97,
        duration: 0.35,
        ease: "power2.inOut",
        delay: 1.6,
        onComplete: () => setToast(null),
      });
    }
  }, [toast]);

  if (!toast) return null;

  const isError = toast.type === "error";
  const isLoading = toast.type === "loading";
  const isSuccess = toast.type === "success";

  return (
    <div className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-[9999] pointer-events-none">
      <div
        ref={feedbackRef}
        className={`max-w-[280px] md:max-w-[320px] rounded-2xl border px-5 py-4 shadow-[0_20px_60px_rgba(62,23,71,0.14)] backdrop-blur-xl
        ${
          isError
            ? "border-red-300 bg-red-50"
            : isLoading
            ? "border-yellow-300 bg-yellow-50"
            : isSuccess
            ? "border-green-300 bg-green-50"
            : "border-[#4EDDE2]/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(237,251,252,0.92),rgba(246,242,248,0.96))]"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Indicator dot */}
          <div
            className={`mt-1 w-2.5 h-2.5 rounded-full ${
              isError
                ? "bg-red-500"
                : isLoading
                ? "bg-yellow-500 animate-pulse"
                : isSuccess
                ? "bg-green-500"
                : "bg-[#4EDDE2]"
            }`}
          />

          <div>
            {/* Title */}
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#3E1747]/45 mb-1">
              {isError
                ? "Error"
                : isLoading
                ? "Processing"
                : isSuccess
                ? "Success"
                : "XVital Insight"}
            </p>

            {/* Message */}
            <p className="text-sm md:text-[15px] leading-6 text-[#3E1747] font-medium">
              {toast.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}