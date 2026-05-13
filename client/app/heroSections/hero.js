"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useRef } from "react";
import { startAssessment } from "../utils/startAssessment";
import AssessmentFlowModal from "../components/assessmentFlowModal";
import { useRouter } from "next/navigation";
import heroFoodImage from "@/public/hero.png";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { getIsFirstLoad, markPageLoaded } from "@/app/utils/pageLoadState";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const [genderModalOpen, setGenderModalOpen] = useState(false);
  const router = useRouter();

  const container = useRef(null);

 useGSAP(() => {
  const ctx = gsap.context(() => {

    const isFirst = getIsFirstLoad();

    const tl = gsap.timeline({
      delay: isFirst ? 2.2 : 0 
    });

    tl.from(".hero-label", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    })
    .from(".hero-heading", {
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    }, "-=0.3")
    .from(".hero-para", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.4")
    .from(".hero-buttons", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.4")
    .from(".hero-image", {
      scale: 0.96,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    }, "-=0.6");

    markPageLoaded();

  }, container);

  return () => ctx.revert();
}, []);

  return (
    <section
      ref={container}
      className="relative pt-[50%] md:pt-32 pb-32 lg:pt-48 lg:pb-32 overflow-hidden bg-[#FAFAFB]"
    >

      {/* Background */}
      <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-[#4EDDE2]/15 blur-3xl rounded-full" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-bl from-[#4EDDE2]/20 to-transparent blur-3xl opacity-70"></div>
        <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#3E1747]/10 to-transparent blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* LEFT */}
        <div className="max-w-2xl">

          <div className="hero-label inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#4EDDE2]/30 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4EDDE2]"></span>
            <span className="text-xs font-medium text-[#3E1747] tracking-wide uppercase">
              Personalized Nutrition System
            </span>
          </div>

          <h1 className="hero-heading text-3xl sm:text-4xl lg:text-7xl tracking-tight font-semibold text-[#111111] leading-[1.1] lg:leading-[1.05] mb-6">
            You’re not lazy. You’re just following the{" "}
            <span className="text-[#3E1747]">wrong system</span>
          </h1>

          <p className="hero-para text-base sm:text-lg text-[#3E1747]/70 mb-8 lg:mb-10 leading-relaxed font-light">
            A personalized nutrition protocol built for your body, your lifestyle, and Indian food habits not generic diet charts.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row sm:items-center gap-4">

            <div className="flex flex-col">
              <button
                onClick={() => setGenderModalOpen(true)}
                className="w-full sm:w-auto bg-[#3E1747] text-white text-sm sm:text-base font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#4EDDE2] hover:text-[#3E1747] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Icon icon="mdi:clipboard-list" width={18} />
                <span>Start Your Body Assessment</span>
                <Icon icon="mdi:arrow-right" width={20} />
              </button>

              <p className="text-[#3E1747]/50 text-xs mt-2 sm:mt-3">
                Takes 2–3 minutes • No payment required
              </p>
            </div>

            <button
              onClick={() => router.push('/diet')}
              className="w-full sm:w-auto bg-white text-[#3E1747] border border-[#AFAFAF]/40 text-sm sm:text-base font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#4EDDE2]/10 transition-all duration-300 sm:self-start"
            >
              Learn More
            </button>

          </div>

          <p className="text-xs text-[#3E1747]/50 mt-6">
            Used by working professionals, business owners, and individuals tired of trial-and-error dieting.
          </p>

        </div>

        {/* RIGHT */}
        <div className="hero-image relative w-full h-[300px] sm:h-[400px] lg:h-[600px]">

          <div className="absolute inset-0 bg-[#4EDDE2]/10 rounded-3xl transform rotate-3 scale-105 transition-transform duration-700 hover:rotate-6"></div>

          <Image
            src={heroFoodImage}
            alt="Healthy Lifestyle"
            fill
            className="relative object-cover rounded-3xl shadow-xl shadow-[#3E1747]/10 scale-100 transition-transform duration-500 hover:scale-105"
          />

          <div className="absolute -bottom-6 left-4 sm:-left-6 bg-white p-4 rounded-2xl shadow-lg border border-[#AFAFAF]/20 flex items-center space-x-4 backdrop-blur-sm bg-white/90 transition-transform duration-300 hover:translate-y-1">

            <div className="w-12 h-12 rounded-full bg-[#4EDDE2]/20 flex items-center justify-center text-[#4EDDE2]">
              <Icon icon="solar:graph-up-linear" className="text-2xl" />
            </div>

            <div>
              <div className="text-sm text-[#3E1747]/60 font-medium">
                Energy Levels
              </div>
              <div className="text-lg font-semibold text-[#3E1747] tracking-tight">
                +84% Boost
              </div>
            </div>

          </div>

        </div>

      </div>

      {genderModalOpen && (
        <AssessmentFlowModal
          isOpen={genderModalOpen}
          onClose={() => setGenderModalOpen(false)}
        />
      )}
    </section>
  );
}