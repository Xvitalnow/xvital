"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import TermsModal from "../termsModal.js";

export default function PackageModal({ data, onClose, onBuy, loading }) {
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (!data) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-5">

        {/* OUTER CARD */}
        <div className="w-full max-w-md bg-white rounded-[28px] border border-[#AFAFAF]/10 shadow-2xl overflow-hidden relative">

          {/* SCROLL CONTAINER */}
          <div className="relative max-h-[85vh] overflow-y-auto no-scrollbar p-7 md:p-8 pb-24">

            {/* HEADER */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#4EDDE2] mb-2">
                  {data.duration}
                </p>
                <h3 className="text-2xl font-semibold text-[#111111]">
                  {data.name}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="text-[#3E1747]/50 hover:text-[#111111] text-xl"
              >
                ×
              </button>
            </div>

            {/* DESCRIPTION */}
            <p className="text-[#111111]/70 text-sm leading-6 mb-6">
              {data.description}
            </p>

            {/* BENEFITS */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#3E1747] mb-3">
                Key Benefits
              </h4>

              <div className="space-y-2">
                {data.highlights.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <Icon
                      icon="solar:check-circle-bold"
                      className="text-[#4EDDE2]"
                      width="18"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CORE */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#3E1747] mb-3">
                Core System
              </h4>

              <div className="space-y-2">
                {data.core.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <Icon
                      icon="solar:check-circle-linear"
                      className="text-[#3E1747]/60"
                      width="18"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ADVANCED */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#3E1747] mb-3">
                Advanced Features
              </h4>

              <div className="space-y-2">
                {data.advanced.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <Icon
                      icon="solar:star-bold"
                      className="text-[#4EDDE2]"
                      width="18"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TERMS */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />

                <span className="text-sm text-[#111111]/70">
                  I accept{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="underline text-[#4EDDE2] hover:text-[#3E1747]"
                  >
                    Terms & Conditions
                  </button>
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={!accepted || loading}
              onClick={() => onBuy(data)}
              className={`w-full py-3.5 rounded-2xl font-medium transition-all ${
                accepted && !loading
                  ? "bg-[#3E1747] text-white hover:bg-[#4EDDE2] hover:text-[#3E1747]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading
                ? "Processing..."
                : "Complete Purchase →"}
            </button>

            {/* FIXED GRADIENT (NO OVERLAP ISSUE) */}
            <div className="pointer-events-none sticky bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent" />

          </div>
        </div>
      </div>

      {/* TERMS MODAL */}
      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => {
          setAccepted(true);
          setShowTerms(false);
        }}
      />
    </>
  );
}