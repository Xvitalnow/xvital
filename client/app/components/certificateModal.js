// components/CertificateModal.jsx
"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { useEffect } from "react";
import gsap from "gsap";

// CERTIFICATE IMAGE
import CertificateQR from "@/app/assets/images/Certificate.jpeg";

export default function CertificateModal({ isOpen, onClose }) {

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        ".certificate-modal-content",
        {
          opacity: 0,
          y: 25,
          scale: 0.96
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out"
        }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-5">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
      />

      {/* MODAL */}
      <div className="certificate-modal-content relative w-full h-[95vh] py-5 max-w-[430px] rounded-[32px] overflow-hidden border border-white/10 bg-[#FAFAFB] shadow-[0_25px_80px_rgba(0,0,0,0.25)]">

        {/* TOP GLOW */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-52 w-52 rounded-full bg-[#4EDDE2]/20 blur-3xl pointer-events-none" />

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 h-10 w-10 rounded-full bg-white/80 text-[#111111] backdrop-blur-md border border-[#AFAFAF]/20 flex items-center justify-center hover:scale-105 transition-all duration-300"
        >
        <Icon
         className="text-[#4EDDE2]/80 hover:text-[#4EDDE2]"
         icon="solar:close-circle-linear" width="28" />

        </button>

        <div className="relative z-10 p-7">

          {/* VERIFIED ICON */}
          <div className="flex justify-center mb-3">
            <div className="relative">

              {/* Glow Ring */}
              <div className="absolute inset-0 rounded-2xl bg-[#4EDDE2]/20 blur-xl scale-105" />

              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-[#3E1747] to-[#4EDDE2] flex items-center justify-center shadow-lg">
                <Icon
                  icon="solar:shield-check-bold"
                  className="text-3xl text-white"
                />
              </div>

            </div>
          </div>

          {/* HEADING */}
          <div className="text-center mb-3">
            <h3 className="text-[22px] leading-none font-semibold tracking-tight text-[#111111] mb-2">
              Verified Certificate
            </h3>

            <p className="text-[0.9em] leading-none text-[#3E1747]/60 max-w-[280px] mx-auto">
              Scan the QR code to validate the nutrition certification details.
            </p>
          </div>

          {/* CERTIFICATE IMAGE */}
          <div className="relative inset-0 overflow-hidden rounded-[28px] w-[1/2] shadow-inner mb-2 flex items-center justify-center py-1">

            <div className=" bg-gradient-to-br from-[#4EDDE2]/5 to-[#3E1747]/5 pointer-events-none" />

            <div className="relative aspect-square w-[60%] p-3">
              <Image
                src={CertificateQR}
                alt="Certificate QR Code"
                fill
                className="object-cover rounded-2xl"
              />
            </div>

          </div>

          {/* CERTIFICATE ID */}
          <div className="rounded-2xl border border-[#AFAFAF]/15 bg-white px-5 py-4 mb-5">

            <p className="text-[9px] uppercase tracking-[0.25em] text-[#3E1747]/45 mb-2">
              Certificate ID
            </p>

            <h4 className="text-[14px] font-semibold tracking-wide text-[#111111]">
              CERT_1929362
            </h4>

          </div>

          {/* BUTTON */}
          <a
            href="https://admin.skillindiadigital.gov.in/documentverificationbyQR?content=P0NhbmRpZGF0ZSBOYW1lID0gTElLSVRIIEtVTUFSJiZDYW5kaWRhdGUgSWQgPSBDQU5fMjczNDg0NzgmJlRQIElkID0gVFAxNjA3NTQmJlRDIE5hbWUgPSBPTkxJTkUgVFJBSU5JTkcgQ0VOVEVSJiZCYXRjaElkID0gMjM4OTAwMyYmRG9jdW1lbnQgSUQgPSBHNk03OTE4M1ZGMkdNMldRJiZUQyBBZGRyZXNzID0gQi0xMjImJlNFQ1RPUi01JiZOT0lEQSYmR0FVVEFNIEJVRERIQSBOQUdBUiYmVVRUQVIgUFJBREVTSC0yMDEzMDEuJiZEb2N1bWVudCA9IGNlcnRpZmljYXRlJiZJc3N1YW5jZSBEYXRlID0gMTQvMDgvMjAyNA=="
            target="_blank"
            className="group h-[58px] w-full rounded-2xl hover:bg-[#4EDDE2] bg-[#3E1747] text-white transition-all duration-300 flex items-center justify-center gap-3 hover:text-[#111111] text-[0.8em] sm:text-sm md:text-base font-medium tracking-wide"
          >

            <Icon
              icon="solar:qr-code-linear"
              className="text-[4.3vw] sm:text-[22px]"
            />

            View Verified Certificate

            <Icon
              icon="solar:arrow-right-linear"
              className="text-lg transition-transform duration-300 group-hover:translate-x-1"
            />

          </a>

        </div>

      </div>

    </div>
  );
}