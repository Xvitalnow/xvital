"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function ScrollToPackages() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
    //   hide when user scrolls down and reach bottom 20% of the page
        const scrollPosition = window.scrollY + window.innerHeight;
        const threshold = document.documentElement.scrollHeight * 0.8;
        setVisible(scrollPosition < threshold);
    };

      

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToPackages = () => {
    // scroll where handle scroll get hidden
    const targetPosition = document.documentElement.scrollHeight * 0.8;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
    
  };

  return (
    <button
      onClick={handleScrollToPackages}
      className={`fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-[#3E1747] text-white flex items-center justify-center shadow-lg transition-all duration-300
        hover:bg-[#4EDDE2] hover:text-[#3E1747]
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <Icon icon="solar:arrow-down-linear" className="text-2xl" />
    </button>
  );
}