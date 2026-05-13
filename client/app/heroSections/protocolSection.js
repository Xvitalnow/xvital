"use client";

import { Icon } from "@iconify/react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: "solar:clipboard-check-linear",
    color: "text-[#3E1747]",
    border: "border-[#3E1747]/20",
    badgeBg: "bg-[#3E1747]",
    badgeText: "text-white",
    title: "Answer Simple Questions",
    description:
      "Tell us about your habits, energy levels, and lifestyle no complex forms."
  },
  {
    icon: "solar:dna-linear",
    color: "text-[#4EDDE2]",
    border: "border-[#4EDDE2]/40",
    badgeBg: "bg-[#4EDDE2]",
    badgeText: "text-[#3E1747]",
    title: "We Understand Your Body",
    description:
      "We identify patterns in your metabolism, stress, and eating behavior."
  },
  {
    icon: "solar:magic-stick-3-linear",
    color: "text-white",
    containerBg: "bg-[#3E1747]",
    border: "border-white/20",
    badgeBg: "bg-white",
    badgeText: "text-[#3E1747]",
    title: "Get Your Structured Plan",
    description:
      "A practical nutrition system designed for real life no fancy foods or unrealistic rules."
  }
];

export default function ProtocolSection() {
  const container = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // ✅ HEADING ANIMATION
      gsap.fromTo(".protocol-heading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: ".protocol-heading",
            start: "top 90%",
          }
        }
      );

      // ✅ STEP STAGGER (progress feel)
      gsap.fromTo(".protocol-step", 
        {
          y: 40,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".protocol-step",
            start: "top 85%",
          }
        }
      );

      // ✅ ICON ANIMATIONS
      const icons = gsap.utils.toArray(".protocol-icon");

      icons.forEach((icon, i) => {
        const type = steps[i].icon;

        const trigger = {
          trigger: icon,
          start: "top 85%",
        };

        // 📋 Clipboard → slight bounce
        if (type.includes("clipboard")) {
          gsap.to(icon, {
            y: -6,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            scrollTrigger: trigger
          });
        }

        // 🧬 DNA → rotation (subtle premium feel)
        if (type.includes("dna")) {
          gsap.to(icon, {
            rotate: 360,
            duration: 6,
            repeat: -1,
            ease: "linear",
            scrollTrigger: trigger
          });
        }

        // ✨ Magic → pulse glow feel
        if (type.includes("magic")) {
          gsap.to(icon, {
            scale: 1.12,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            scrollTrigger: trigger
          });
        }
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      id="protocol"
      className="py-24 bg-[#FAFAFB] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="protocol-heading text-center max-w-2xl mx-auto mb-20">
          <span className="text-[#4EDDE2] text-sm font-semibold tracking-widest uppercase mb-3 block">
            The Solution
          </span>

          <h2 className="text-3xl md:text-5xl tracking-tight font-semibold text-[#111111] mb-6">
            Clear Process. No Overwhelm.
          </h2>

          <p className="text-[#3E1747]/60 text-lg font-light">
            Before telling you what to eat, we understand your body first.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">

          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-[#AFAFAF]/40 to-transparent -translate-y-1/2 z-0"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`protocol-step relative z-10 flex flex-col items-center text-center group ${
                index !== 0 ? "mt-12 md:mt-0" : ""
              }`}
            >

              {/* Icon Circle */}
              <div
                className={`protocol-icon w-24 h-24 rounded-full ${
                  step.containerBg
                    ? step.containerBg
                    : "bg-white border border-[#AFAFAF]/20"
                } shadow-md ${
                  step.containerBg ? "shadow-[#3E1747]/20" : ""
                } flex items-center justify-center mb-8 relative transition-all duration-500 group-hover:-translate-y-2`}
              >

                <div
                  className={`absolute inset-2 rounded-full border ${step.border}`}
                ></div>

                <Icon icon={step.icon} className={`text-4xl ${step.color}`} />

                {/* Step Badge */}
                <div
                  className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${step.badgeBg} ${step.badgeText} flex items-center justify-center text-sm font-semibold shadow-md`}
                >
                  {index + 1}
                </div>

              </div>

              <h3 className="text-2xl font-semibold tracking-tight text-[#111111] mb-3">
                {step.title}
              </h3>

              <p className="text-sm text-[#3E1747]/60 leading-relaxed px-4">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}