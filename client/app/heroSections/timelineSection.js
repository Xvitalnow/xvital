"use client";

import { Icon } from "@iconify/react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    title: "Choose Your Path",
    description:
      "Begin by selecting your gender to access the most relevant health assessment journey.",
    color: "bg-[#4B1F4E]",
  },
  {
    title: "Complete Questionnaire",
    description:
      "Answer a guided set of questions about your lifestyle, habits, goals, and health background.",
    color: "bg-[#63D1D3]",
  },
  {
    title: "Get Health Report",
    description:
      "Receive a personalized health report based on your responses and overall wellness profile.",
    color: "bg-[#4B1F4E]",
  },
  {
    title: "Book Consultation",
    description:
      "Schedule a 1-on-1 consultation to review your report and discuss the right next step for you.",
    color: "bg-[#63D1D3]",
  },
];

export default function TimelineSection() {
  const container = useRef(null);

  useGSAP(() => {
    const steps = gsap.utils.toArray(".timeline-step");
    const dots = gsap.utils.toArray(".dot");
    const line = container.current.querySelector(".timeline-line");

    // -------------------------------
    // EXISTING SCROLL ANIMATION (UNCHANGED)
    // -------------------------------
    gsap.set(line, { scaleY: 0, transformOrigin: "top center" });

    gsap.fromTo(".timeline-heading",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: {
          trigger: ".timeline-heading",
          start: "top 90%",
        }
      }
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
    });

    tl.to(
      line,
      {
        scaleY: 1,
        duration: steps.length * 0.6,
        ease: "power2.out",
      },
      0
    );

    steps.forEach((step, i) => {
      const text = step.querySelector("h4");
      const para = step.querySelector("p");
      const dot = step.querySelector(".dot");

      const isLeft = i % 2 === 0;

      tl.from(
        step,
        {
          y: 80,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        i * 0.5
      );

      tl.from(
        [text, para],
        {
          x: isLeft ? -40 : 40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        i * 0.5 + 0.1
      );

      tl.fromTo(
        dot,
        { scale: 0 },
        {
          scale: 1.4,
          duration: 0.3,
          ease: "back.out(2)",
        },
        i * 0.5 + 0.2
      ).to(
        dot,
        {
          scale: 1,
          duration: 0.2,
        },
        i * 0.5 + 0.4
      );
    });

    // -------------------------------
    // 🔥 NEW: AUTO FLOWING DOT ANIMATION
    // -------------------------------
    const flowTl = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
    });

    dots.forEach((dot, i) => {
      flowTl.to(dot, {
        scale: 1.6,
        boxShadow: "0 0 0 6px rgba(99, 209, 211, 0.15)",
        duration: 0.3,
        ease: "power2.out",
      }, i * 0.4)
      .to(dot, {
        scale: 1,
        boxShadow: "0 0 0 0px rgba(99, 209, 211, 0)",
        duration: 0.3,
        ease: "power2.in",
      }, i * 0.4 + 0.3);
    });

  }, { scope: container });

  return (
    <section
      ref={container}
      className="py-24 bg-white border-y border-slate-100 w-full overflow-x-hidden"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="timeline-heading text-3xl md:text-4xl tracking-tight font-semibold text-center text-slate-900 mb-16">
          Your Journey to Vitality
        </h2>

        <div className="relative pl-8 md:pl-0">

          <div className="timeline-line absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-100 -translate-x-1/2"></div>

          {timeline.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className="timeline-step relative flex flex-col md:flex-row justify-between items-center mb-16 group"
              >

                {isLeft ? (
                  <div className="order-2 md:order-1 md:w-5/12 text-left md:text-right pt-6 md:pt-0 pl-6 md:pl-0 pr-0 md:pr-12">
                    <h4 className="text-xl font-semibold tracking-tight text-slate-900 mb-2 font-inter">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-500 font-light">
                      {item.description}
                    </p>
                  </div>
                ) : (
                  <div className="order-1 md:order-1 md:w-5/12 hidden md:block"></div>
                )}

                {/* DOT */}
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-[#FAFAFA] shadow-md flex items-center justify-center z-10 transition-colors duration-300 group-hover:border-[#63D1D3]/30">
                  <div className={`dot w-3 h-3 rounded-full ${item.color}`}></div>
                </div>

                {!isLeft ? (
                  <div className="order-2 md:order-3 md:w-5/12 text-left pt-6 md:pt-0 pl-6 md:pl-12">
                    <h4 className="text-xl font-semibold tracking-tight text-slate-900 mb-2 font-inter">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-500 font-light">
                      {item.description}
                    </p>
                  </div>
                ) : (
                  <div className="order-1 md:order-3 md:w-5/12 hidden md:block"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}