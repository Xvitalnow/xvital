"use client";

import React, { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import PurchaseCheckModal from "../purchaseCheckModal.js";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const OrdersFloatingButton = ({ onClick }) => {
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const btnRef = useRef(null);

  useGSAP(() => {
    // ✅ sync with hero (after preloader)
    gsap.fromTo(
      btnRef.current,
      {
        x: 40,
        opacity: 0,
        scale: 0.9
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        delay: 2.2 // 🔥 same as hero animation
      }
    );

    // ✅ subtle idle floating (premium feel)
    gsap.to(btnRef.current, {
      y: -6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 3 // start after entry
    });

  }, []);

  return (
    <>
      {/* 🛒 ORDER ICON */}
      <button
        ref={btnRef}
        onClick={() => setPurchaseModalOpen(true)}
        className="fixed top-[35%] md:top-[20%] right-[20px] z-[60] w-11 h-11 rounded-full bg-[#3E1747] flex items-center justify-center text-white will-change-transform"
      >
        <Icon icon="solar:bag-4-linear" width="20" />
      </button>

      {/* 🛍️ Purchase Modal */}
      {purchaseModalOpen && (
        <PurchaseCheckModal
          isOpen={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
        />
      )}
    </>
  );
};

export default OrdersFloatingButton;