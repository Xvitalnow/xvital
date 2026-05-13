"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useState, useRef } from "react";
import AssessmentFlowModal from "../components/assessmentFlowModal";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// images import
import Male from "@/app/assets/images/male.jpeg";
import Female from "@/app/assets/images/female.jpeg";

const programs = [
  {
    title: "Male Protocol",
    gender: "male",
    image: Male,
    description: [
      "Fat loss with muscle retention",
      "Stable energy for work & focus",
      "Testosterone support",
      "Reduce stubborn belly fat",
      "Better digestion & recovery"
    ]
  },
  {
    title: "Female Protocol",
    gender: "female",
    image: Female,
    description: [
      "Hormonal balance (PCOS / Thyroid)",
      "Sustainable fat loss (no crash dieting)",
      "Control cravings & emotional eating",
      "Improve digestion & reduce bloating",
      "Better energy, mood & glow"
    ]
  }
];

export default function ProgramsSection() {
  const [flowOpen, setFlowOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);

  const container = useRef(null);

  const handleProgramClick = (gender) => {
    setSelectedGender(gender);
    setFlowOpen(true);
  };

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // ✅ Heading animation
      gsap.fromTo(".program-heading", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: ".program-heading",
            start: "top 90%",
          }
        }
      );

      // ✅ Cards from opposite sides
      const cards = gsap.utils.toArray(".program-card");

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            y: 60,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            }
          }
        );
      });

      // ✅ Icon micro animation (subtle)
      gsap.utils.toArray(".program-icon").forEach((icon) => {
        gsap.to(icon, {
          y: -4,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: icon,
            start: "top 90%",
          }
        });
      });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={container}
        id="programs"
        className="py-24 bg-[#3E1747] relative overflow-hidden"
      >
        {/* Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#4EDDE2 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* Heading */}
          <div className="program-heading text-center mb-16">
            <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-white mb-4">
              Choose What Your Body Needs
            </h2>

            <p className="text-white/70 text-base font-light max-w-xl mx-auto">
              Your body is different. Your plan should be too.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {programs.map((program, index) => (
              <div
                key={index}
                onClick={() => handleProgramClick(program.gender)}
                className="program-card group relative rounded-3xl overflow-hidden cursor-pointer bg-white border border-[#AFAFAF]/20 hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="h-64 sm:h-80 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-3xl text-white font-semibold">
                      {program.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">

                  <ul className="space-y-3 mb-6">
                    {program.description.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[#111111]"
                      >
                        <Icon
                          icon="solar:check-circle-linear"
                          className="program-icon text-[#4EDDE2] text-lg mt-[2px]"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full bg-[#FAFAFB] border border-[#AFAFAF]/30 text-[#3E1747] py-3 rounded-xl flex items-center justify-center gap-2 group-hover:bg-[#3E1747] group-hover:text-white transition-all duration-300">
                    <Icon icon="mdi:clipboard-list" width={18} />
                    <span>
                      {program.gender === "male"
                        ? "Start Male Assessment"
                        : "Start Female Assessment"}
                    </span>
                    <Icon icon="mdi:arrow-right" width={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <AssessmentFlowModal
        isOpen={flowOpen}
        onClose={() => setFlowOpen(false)}
        skipGenderStep={true}
        initialGender={selectedGender}
      />
    </>
  );
}