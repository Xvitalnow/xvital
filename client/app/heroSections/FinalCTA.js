"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useRef } from "react";
import { startAssessment } from "../utils/startAssessment";
import AssessmentFlowModal from "../components/assessmentFlowModal";
import meetingImage from "@/app/assets/images/meeting.jpg";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const [genderModalOpen, setGenderModalOpen] = useState(false);

  const container = useRef(null);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // ✅ TEXT REVEAL
        gsap.from(".cta-text > *", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
          },
        });

        // ✅ BUTTON
        const btn = container.current?.querySelector(".cta-button");

        if (btn) {
          gsap.fromTo(
            btn,
            {
              y: 30,
              opacity: 0,
              scale: 0.95,
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              delay: 0.3,
              ease: "power3.out",
              scrollTrigger: {
                trigger: btn,
                start: "top 85%",
              },
            }
          );

          // ✅ HOVER ANIMATION
          const enter = () => {
            gsap.to(btn, {
              y: -4,
              scale: 1.04,
              boxShadow: "0px 20px 40px rgba(78,221,226,0.4)",
              duration: 0.3,
              ease: "power2.out",
            });
          };

          const leave = () => {
            gsap.to(btn, {
              y: 0,
              scale: 1,
              boxShadow: "0px 0px 0px rgba(0,0,0,0)",
              duration: 0.3,
              ease: "power2.out",
            });
          };

          btn.addEventListener("mouseenter", enter);
          btn.addEventListener("mouseleave", leave);

          // ✅ CLEANUP
          return () => {
            btn.removeEventListener("mouseenter", enter);
            btn.removeEventListener("mouseleave", leave);
          };
        }

        // ✅ BACKGROUND GLOW BREATHING
        gsap.to(".cta-glow", {
          scale: 1.1,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }, container);

      return () => ctx.revert();
    },
    { scope: container }
  );

  return (
    <>
      <section
        ref={container}
        className="py-24 relative overflow-hidden bg-[#3E1747]"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={meetingImage}
            alt="Background"
            fill
            className="object-cover opacity-10 mix-blend-overlay"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#3E1747] via-[#3E1747]/80 to-transparent"></div>

          {/* Glow */}
          <div className="cta-glow absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[#4EDDE2] blur-[120px] opacity-20 rounded-t-full"></div>
        </div>

        {/* Content */}
        <div className="cta-text max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl tracking-tight font-semibold text-white mb-6">
            Your Transformation Starts Today
          </h2>

          <p className="text-white/80 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
            Stop guessing. Start optimizing. Begin your personalized assessment
            and take the first step toward better health.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={() => setGenderModalOpen(true)}
              className="cta-button w-full sm:w-auto bg-[#4EDDE2] text-[#3E1747] text-sm sm:text-base font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#3E1747] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <Icon icon="mdi:clipboard-list" width={18} />
              <span>Start Your Body Assessment</span>
              <Icon icon="mdi:arrow-right" width={20} />
            </button>

            <p className="text-white/50 text-xs mt-2 sm:mt-3">
              Takes 2–3 minutes • No payment required
            </p>
          </div>
        </div>
      </section>

      {genderModalOpen && (
        <AssessmentFlowModal
          isOpen={genderModalOpen}
          onClose={() => setGenderModalOpen(false)}
          onStartFresh={(gender) => {
            setGenderModalOpen(false);
            startAssessment(gender);
          }}
        />
      )}
    </>
  );
}