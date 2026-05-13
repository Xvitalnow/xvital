"use client";

import { Icon } from "@iconify/react";

export default function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-5">
      <div className="w-full max-w-md bg-white rounded-[28px] border border-[#AFAFAF]/10 shadow-2xl p-7 md:p-8">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#4EDDE2] mb-2">
              Manage Booking
            </p>
            <h3 className="text-2xl font-semibold text-[#111111]">
              Cancel Consultation
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-[#3E1747]/50 hover:text-[#111111] text-xl"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="flex items-start gap-3 mb-7">
          <div className="w-10 h-10 rounded-full bg-[#FAFAFB] flex items-center justify-center">
            <Icon
              icon="solar:danger-circle-bold"
              className="text-red-500"
              width="20"
            />
          </div>

          <p className="text-[#111111]/70 text-sm leading-6">
            Are you sure you want to cancel your consultation?  
            You can reschedule anytime later.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-2xl border border-[#AFAFAF]/20 text-[#3E1747] hover:bg-[#FAFAFB] transition"
          >
            Keep Booking
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            {isLoading ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}