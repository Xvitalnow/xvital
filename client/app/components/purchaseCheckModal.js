"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { BackendURL } from "@/app/lib/config/url";
import { showToast, toastPromise } from "@/app/lib/toast";
import { useLoader } from "../context/LoaderContext";

export default function PurchaseCheckModal({
  isOpen,
  onClose,
}) {
  const router = useRouter();
  const{ setLoading } = useLoader();

  const [step, setStep] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [form, setForm] = useState({
    email: "",
    otp: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    setStep("email");
    setTimer(0);
    setForm({
      email: "",
      otp: "",
    });
  }, [isOpen]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  if (!isOpen) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      showToast("Enter your email", "error");
      return false;
    }

    if (!emailRegex.test(form.email.trim())) {
      showToast("Enter a valid email", "error");
      return false;
    }

    return true;
  };

  // =========================
  // STEP 1 → SEND OTP
  // =========================
  const sendOTP = async () => {
    if (!validateEmail()) return;

    try {
      setIsLoading(true);
      setLoading(true);

      await toastPromise(
        axios.post(`${BackendURL}/order/send-otp`, {
          email: form.email.trim().toLowerCase(),
        }),
        {
          loading: "Sending OTP...",
          success: "OTP sent to your email",
          error: "Failed to send OTP",
        }
      );

      setStep("otp");
      setTimer(60);

    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // =========================
  // STEP 2 → VERIFY
  // =========================
  const verifyOTP = async () => {
    if (!form.otp.trim()) {
      showToast("Enter OTP", "error");
      return;
    }

    try {
      setIsLoading(true);
      setLoading(true);
      const res = await toastPromise(
        axios.post(`${BackendURL}/order/verify-otp`, {
          email: form.email.trim().toLowerCase(),
          otp: form.otp,
        }),
        {
          loading: "Verifying OTP...",
          success: "Fetching your purchases",
          error: "Invalid OTP",
        }
      );

      const orders = res?.data?.orders || [];

      localStorage.setItem("userOrders", JSON.stringify(orders));
      localStorage.setItem(
        "userEmail",
        form.email.trim().toLowerCase()
      );

      onClose();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/purchases");


    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (timer > 0) return;
    await sendOTP();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/55 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[32px] p-7 md:p-8 relative shadow-xl overflow-hidden">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#3E1747]/50 hover:text-[#3E1747]"
        >
          <Icon icon="solar:close-circle-linear" width="28" />
        </button>

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4EDDE2]/15 flex items-center justify-center mb-4">
            <Icon
              icon={
                step === "email"
                  ? "solar:bag-check-linear"
                  : "solar:verified-check-linear"
              }
              width="28"
              className="text-[#3E1747]"
            />
          </div>

          <p className="text-[11px] uppercase tracking-[0.22em] text-[#4EDDE2] mb-2">
            My Purchases
          </p>

          <h2 className="text-[26px] font-semibold text-[#111111]">
            {step === "email"
              ? "Check Your Orders"
              : "Verify Your Email"}
          </h2>

          <p className="text-sm text-[#3E1747]/60 mt-1">
            {step === "email"
              ? "Enter your email to view purchased plans."
              : `We sent a code to ${form.email}`}
          </p>
        </div>

        {/* STEP 1 */}
        {step === "email" && (
          <div className="space-y-4">

            <div className="relative">
              <Icon
                icon="solar:letter-linear"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40"
                width="18"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  updateField("email", e.target.value)
                }
                className="w-full h-14 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] pl-12 pr-4 outline-none focus:border-[#4EDDE2]"
              />
            </div>

            <button
              onClick={sendOTP}
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-[#3E1747] text-white font-medium"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === "otp" && (
          <div className="space-y-4">

            <div className="relative">
              <Icon
                icon="solar:password-linear"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40"
                width="18"
              />
              <input
                type="text"
                maxLength={6}
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(e) =>
                  updateField("otp", e.target.value)
                }
                className="w-full h-14 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] pl-12 pr-4 tracking-[0.25em]"
              />
            </div>

            <button
              onClick={verifyOTP}
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-[#3E1747] text-white font-medium"
            >
              {isLoading ? "Verifying..." : "View My Purchases"}
            </button>

            <button
              onClick={resendOTP}
              disabled={timer > 0}
              className="w-full text-sm text-[#3E1747]/65"
            >
              {timer > 0
                ? `Resend in ${timer}s`
                : "Resend OTP"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}