"use client";

import { Icon } from "@iconify/react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    icon: "solar:battery-charge-linear",
    color: "text-[#4B1F4E]",
    title: "Low Energy",
    description:
      "Energy crashes caused by unstable blood sugar and poor nutrient balance. Your body is running on spikes, not stability."
  },
  {
    icon: "solar:scale-linear",
    color: "text-[#63D1D3]",
    title: "Weight Gain",
    description:
      "Fat gain driven by insulin spikes and stress hormones. Your body stores more because it’s out of balance."
  },
  {
    icon: "solar:heart-pulse-linear",
    color: "text-[#4B1F4E]",
    title: "High Stress",
    description:
      "Constant stress increases cravings and keeps your body in fat-storage mode, making control difficult."
  },
  {
    icon: "solar:pill-linear",
    color: "text-[#63D1D3]",
    title: "Poor Digestion",
    description:
      "Weak gut health leads to poor absorption. Even good food fails when your body can’t process it properly."
  }
];

export default function ProblemSection() {
  const container = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {

// Cards stagger animation use fromTo with different trigger point

      gsap.fromTo(".problem-card", {
        y: 30,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".problem-card",
          start: "top 80%",
          // markers: true,
        }
      });

      // ✅ SECTION ENTRY ANIMATION
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        }
      });

      // Heading animation
      tl.from(".problem-heading", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
      })

      
      
      

      

      // ✅ ICON ANIMATIONS (same but synced with scroll)
      const icons = gsap.utils.toArray(".problem-icon");

      icons.forEach((icon, i) => {
        const type = problems[i].icon;

        const trigger = {
          trigger: icon,
          start: "top 85%",
        };

        if (type.includes("battery")) {
          gsap.to(icon, {
            opacity: 0.3,
            duration: 0.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            scrollTrigger: trigger
          });
        }

        if (type.includes("scale")) {
          gsap.to(icon, {
            scale: 1.12,
            duration: 1.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            transformOrigin: "center",
            scrollTrigger: trigger
          });
        }

        if (type.includes("heart")) {
          const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.8,
            scrollTrigger: trigger
          });

          tl.to(icon, { scale: 1.25, duration: 0.12 })
            .to(icon, { scale: 1, duration: 0.12 })
            .to(icon, { scale: 1.18, duration: 0.12 })
            .to(icon, { scale: 1, duration: 0.35 });
        }

        if (type.includes("pill")) {
          gsap.to(icon, {
            y: -12,
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
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
      className="py-24 bg-white relative border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="problem-heading text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#4EDDE2] text-sm font-semibold tracking-widest uppercase mb-3 block">
            The Problem
          </span>
          <h2 className="text-3xl md:text-5xl tracking-tight font-semibold text-[#111111] mb-6">
            Your Body Is Already Giving You Signals
          </h2> 

          <p className="text-[#3E1747]/60 text-base font-light">
            These are not random problems. They are signs your body is out of alignment not broken.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {problems.map((item, index) => (
            <div
              key={index}
              className="problem-card group bg-[#FAFAFA] p-8 rounded-3xl border border-slate-100 hover:border-[#63D1D3]/30 hover:shadow-xl hover:shadow-[#63D1D3]/5 transition-all duration-300 hover:-translate-y-1"
            >

              <div
                className={`problem-icon w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center ${item.color} mb-6`}
              >
                <Icon icon={item.icon} className="text-3xl" />
              </div>

              <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-3 font-[600] font-inter">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed font-light">
                {item.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}