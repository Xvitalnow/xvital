"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useRef } from "react";

// GSAP
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Images imports
import food from "@/app/assets/images/galleryFood.jpg";
import menGym from "@/app/assets/images/menGym.jpg";
import womenYoga from "@/app/assets/images/womenYoga.jpg";
import workspace from "@/app/assets/images/workspace.jpg";
import juice from "@/app/assets/images/juice.jpg";

export default function LifestyleGallery() {
  const container = useRef();

  useGSAP(() => {
    const ctx = gsap.context(() => {

      // ✅ Heading animation
      gsap.fromTo(".gallery-heading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: ".gallery-heading",
            start: "top 90%",
          }
        }
      );

      // ✅ Grid stagger animation
      const items = gsap.utils.toArray(".gallery-item");

      gsap.fromTo(
        items,
        {
          y: 60,
          opacity: 0,
          scale: 0.96
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gallery-item",
            start: "top 85%",
          },
          onComplete: () => {
            // unlock hover after animation
            items.forEach((item) => {
              item.classList.remove("pointer-events-none");

              const image = item.querySelector(".gallery-image");

              // ✅ GSAP hover
              item.addEventListener("mouseenter", () => {
                gsap.to(image, {
                  scale: 1.06,
                  duration: 0.6,
                  ease: "power3.out"
                });

                gsap.to(item, {
                  y: -6,
                  duration: 0.3,
                  ease: "power2.out"
                });
              });

              item.addEventListener("mouseleave", () => {
                gsap.to(image, {
                  scale: 1,
                  duration: 0.6,
                  ease: "power3.out"
                });

                gsap.to(item, {
                  y: 0,
                  duration: 0.3,
                  ease: "power2.out"
                });
              });
            });
          }
        }
      );

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="py-24 bg-[#FAFAFB]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="gallery-heading text-center mb-16">

          <h2 className="text-3xl md:text-4xl tracking-tight font-semibold text-[#111111] mb-4">
            The XVITAL Lifestyle
          </h2>

          <p className="text-[#3E1747]/60 text-base font-light">
            Aspirational, achievable, and entirely optimized for you.
          </p>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">

          {/* Large Image */}
          <div className="gallery-item pointer-events-none will-change-transform col-span-2 row-span-2 rounded-2xl overflow-hidden relative">

            <Image
              src={food}
              alt="Healthy Food Prep"
              fill
              className="gallery-image object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
              <span className="text-white font-medium tracking-wide">
                Precision Nutrition
              </span>
            </div>

          </div>

          {/* Image */}
          <div className="gallery-item pointer-events-none will-change-transform rounded-2xl overflow-hidden relative">
            <Image
              src={menGym}
              alt="Active Lifestyle"
              fill
              className="gallery-image object-cover"
            />
          </div>

          {/* Image */}
          <div className="gallery-item pointer-events-none will-change-transform rounded-2xl overflow-hidden relative">
            <Image
              src={womenYoga}
              alt="Yoga Wellness"
              fill
              className="gallery-image object-cover"
            />
          </div>

          {/* Juice */}
          <div className="gallery-item pointer-events-none will-change-transform col-span-2 md:col-span-1 rounded-2xl overflow-hidden relative">

            <Image
              src={juice}
              alt="Fresh Vitality Juice"
              fill
              className="gallery-image object-cover"
            />

          </div>

          {/* Workspace */}
          <div className="gallery-item pointer-events-none will-change-transform rounded-2xl overflow-hidden relative">
            <Image
              src={workspace}
              alt="Consultation Coaching"
              fill
              className="gallery-image object-cover"
            />
          </div>

        </div>

      </div>
    </section>
  );
}