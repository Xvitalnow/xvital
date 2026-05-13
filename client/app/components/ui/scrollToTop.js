"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Only show on landing page
  if (pathname !== "/") return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-[20%] right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-md ${
        showButton
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none"
      } bg-[#3E1747] hover:bg-[#4EDDE2] text-white hover:text-[#3E1747]`}
      aria-label="Scroll to top"
    >
      <Icon icon="solar:arrow-up-linear" className="text-2xl" />
    </button>
  );
}