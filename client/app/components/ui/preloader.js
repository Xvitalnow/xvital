"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  // Scroll to top and set a timer to hide the preloader after 2 seconds
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

   
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#FAFAFB] flex items-center justify-center">
      
      <div className="relative flex items-center justify-center">

        {/* Rotating Ring */}
        <div className="absolute w-32 h-32 border-4 border-[#4EDDE2]/30 border-t-[#4EDDE2] rounded-full animate-spin"></div>

        {/* Logo */}
        <img
          src="/primaryLogo.png"
          alt="XVITAL"
          className="w-20 h-20 object-contain"
        />

      </div>

    </div>
  );
}