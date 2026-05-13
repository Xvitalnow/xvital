"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import TopTicker from "../components/topTicker.js";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { startAssessment } from "../utils/startAssessment.js";
import AssessmentFlowModal from "../components/assessmentFlowModal.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLoader } from "../context/LoaderContext";

export default function Header() {
  const [genderModalOpen, setGenderModalOpen] = useState(false);
  const { loading, setLoading } = useLoader();

  const pathname = usePathname();
  const router = useRouter();

  const navRef = useRef(null);

  const getLinkClass = (path) =>
    `px-3 py-1.5 rounded-md transition cursor-pointer ${pathname === path
      ? "bg-[#4EDDE2]/40 text-[#3E1747]"
      : "text-[#3E1747]/70 hover:bg-[#4EDDE2]/20"
    }`;

  const getMobileClass = (path) =>
    `flex-1 text-center py-3 ${pathname === path
      ? "bg-[#4EDDE2]/40 text-[#3E1747]"
      : "text-[#3E1747]/70"
    }`;

  const handleLogoClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };



  // ✅ HEADER ANIMATION
  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 2.1, // after preloader
    });
  }, []);

  const handleNavigation = async (path) => {
  if (pathname === path) return;

  setLoading(true);

  await new Promise((resolve) => setTimeout(resolve, 150));

  router.push(path);
};

  useEffect(() => {
  setLoading(false);
}, [pathname]);


  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 bg-[#FAFAFB]/90 backdrop-blur-md border-b border-[#AFAFAF]/30"
      >
        <TopTicker />

        {/* 🔥 MOBILE NAV */}
        <div className="md:hidden flex justify-around text-sm font-medium border-b border-[#AFAFAF]/30">
          <Link href="/" className={getMobileClass("/")}>
            Home
          </Link>

          <Link href="/diet" className={getMobileClass("/diet")}>
            Diet
          </Link>

          <Link href="/products" className={getMobileClass("/products")}>
            Products
          </Link>
        </div>

        {/* MAIN HEADER */}
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Image
            onClick={handleLogoClick}
            src="/xvitalLogoTransparent.png"
            alt="XVITAL logo"
            width={160}
            height={50}
            priority
            className="w-[110px] md:w-[150px] object-contain cursor-pointer"
          />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button
              onClick={() => handleNavigation("/")}
              className={getLinkClass("/")}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/diet")}
              className={getLinkClass("/diet")}
            >
              Diet
            </button>
            <button
              onClick={() => handleNavigation("/products")}
              className={getLinkClass("/products")}
            >
              Products
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => setGenderModalOpen(true)}
              className="hidden md:inline-flex items-center gap-2 bg-[#3E1747] text-white px-4 py-2 rounded-full hover:bg-[#3E1747]/90 transition"
            >
              <Icon icon="mdi:clipboard-list" width={18} />
              Start your Assessment
              <Icon icon="mdi:arrow-right" width={16} />
            </button>

            <button
              onClick={() => setGenderModalOpen(true)}
              className="md:hidden flex items-center gap-[0.09em] bg-[#3E1747] text-white px-2 py-3 rounded-full hover:bg-[#3E1747]/90 transition text-[0.8em]"
            >
              <Icon icon="mdi:clipboard-list" width={15} />
              Start Assessment
              <Icon icon="mdi:arrow-right" width={16} />
            </button>
          </div>
        </div>
        {/* LOADER */}
        <div
          className={`absolute bottom-0 left-0 h-[2px] bg-[#4EDDE2] shadow-[0_0_12px_#4EDDE2] transition-all duration-300 z-[999] ${loading ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
        />
      </nav>

      {genderModalOpen && (
        <AssessmentFlowModal
          isOpen={genderModalOpen}
          onClose={() => setGenderModalOpen(false)}
          onStartFresh={(gender) => {
            setGenderModalOpen(false);
            startAssessment(gender, router);
          }}
        />
      )}
    </>
  );
}