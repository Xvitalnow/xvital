// components/ExpertSection.jsx
"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import FounderImage from "@/app/assets/images/founderImage2.jpeg";
import CertificateModal from "../components/certificateModal";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ExpertSection() {
  const container = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // ✅ IMAGE REVEAL
      gsap.fromTo(".expert-image",
        {
          opacity: 0,
          y: 40,
          scale: 0.96
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".expert-image",
            start: "top 85%",
          }
        }
      );

      // ✅ CONTENT STAGGER
      gsap.from(".expert-content > *", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".expert-content",
          start: "top 85%",
        }
      });

      // ✅ GLOW FLOAT
      gsap.to(".expert-glow", {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={container}
        className="py-24 bg-[#FAFAFB] border-y border-[#AFAFAF]/20"
      >
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex flex-col md:flex-row items-center gap-16">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-1/2 relative">

              {/* Glow */}
              <div className="expert-glow absolute inset-0 bg-gradient-to-tr from-[#3E1747] to-[#4EDDE2] rounded-3xl -rotate-3 opacity-20 blur-xl"></div>

              {/* Image */}
              <div className="expert-image relative aspect-[4/5] w-full">
                <Image
                  src={FounderImage}
                  alt="Likith Kumar - Nutrition Expert"
                  fill
                  className="rounded-3xl shadow-xl object-cover z-10"
                />
              </div>

            </div>

            {/* RIGHT CONTENT */}
            <div className="expert-content w-full md:w-1/2">

              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-[#AFAFAF]/30 shadow-sm mb-6">

                <Icon
                  icon="solar:shield-check-linear"
                  className="text-[#4EDDE2]"
                />

                <span className="text-xs font-medium text-[#3E1747]/70 uppercase tracking-wide">
                  Clinical Expertise
                </span>

              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-5xl tracking-tight font-semibold text-[#111111] mb-6 leading-tight">
                Guided by <span className="text-[#3E1747]">Nutrition</span> Expertise
              </h2>

              {/* Paragraphs */}
              <p className="text-base text-[#3E1747]/60 font-light leading-relaxed mb-6">
                XVITAL was founded by Likith Kumar after noticing a sharp rise in lifestyle-related health issues across India. What once felt like distant statistics became personal, as more families and individuals started facing preventable health problems despite having access to better food and information than ever before.
              </p>

              <p className="text-base text-[#3E1747]/60 font-light leading-relaxed mb-8">
                "Health is not by chance, it is shaped by daily choices. What you eat influences your energy, focus, and long-term well-being. That is why we focus on creating personalized nutrition strategies, because no two individuals are the same."
              </p>

              {/* Founder Info */}
              <div className="flex items-center justify-between flex-wrap gap-5">

                <div>
                  <h4 className="font-semibold text-[#111111] tracking-tight">
                    Likith Kumar
                  </h4>

                  <p className="text-sm text-[#4EDDE2] font-medium">
                    Founder & Certified Nutritionist
                  </p>
                </div>

                {/* Certificate Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group inline-flex items-center gap-2 px-5 py-3 rounded-full hover:bg-[#4EDDE2] hover:text-[#111111] text-white text-sm font-medium bg-[#3E1747] transition-all duration-300"
                >
                  <Icon
                    icon="solar:verified-check-linear"
                    className="text-lg"
                  />

                  View Certificate

                  <Icon
                    icon="solar:arrow-right-linear"
                    className="text-base transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Modal */}
      <CertificateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}