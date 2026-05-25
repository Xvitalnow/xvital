"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { BackendURL } from "@/app/lib/config/url";
import { showToast, toastPromise } from "@/app/lib/toast";
import TermsModal from "../termsModal.js";

export default function LeadsModal({
  isOpen,
  onClose,
  onSuccess,
  gender = "male",
  totalScore = 0,
  resultData = {},
  answers = {},
  extraInputs = {},
}) {
  const [step, setStep] = useState("details");

  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    setStep("details");
    setTimer(0);
    setAcceptedTerms(false);
    setShowTerms(false);

    setForm({
      name: "",
      email: "",
      phone: "",
      otp: "",
      gender: gender || "unknown",
    });
  }, [isOpen, gender]);

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

  const validateDetails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      showToast("Please enter your full name", "error");
      return false;
    }

    if (!form.phone.trim()) {
      showToast("Please enter your phone number", "error");
      return false;
    }

    if (!emailRegex.test(form.email.trim())) {
      showToast("Please enter valid email", "error");
      return false;
    }

    if (!acceptedTerms) {
      showToast("Please accept Terms & Conditions", "error");
      return false;
    }

    return true;
  };

  const sendOTP = async () => {
    if (!validateDetails()) return;

    try {
      setIsLoading(true);

      await toastPromise(
        axios.post(`${BackendURL}/leads/send-otp`, {
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
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!form.otp.trim()) {
      showToast("Enter OTP", "error");
      return;
    }

    try {
      setIsLoading(true);

      const response = await toastPromise(
        axios.post(`${BackendURL}/leads/verify`, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          gender,
          otp: form.otp,

          acceptedTerms: true,
          termsAcceptedAt: new Date(),

          weight: Number(answers.current_weight || 0),
          height: Number(answers.height_cm || 0),
          age: Number(answers.age || 0),

          healthScore: totalScore,
          healthLabel: resultData?.label || "",

          bodyInsights: resultData?.issues?.join("||") || "",

          whyThisHappens: resultData?.message || "",

          possibleOutcomes:
            resultData?.outcome?.join("||") || "",

          foodRestrictions:
            answers.food_restrictions ||
            answers.allergies ||
            extraInputs.food_restrictions ||
            "",
        }),
        {
          loading: "Verifying OTP...",
          success: "OTP verified! Fetching your report...",
          error: "Invalid OTP, please try again",
        }
      );

      onSuccess({
        name: form.name,
        email: form.email,
        phone: form.phone,
        gender: gender || "unknown",
        status:
          response.data.consultation?.status ||
          "draft",
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (timer > 0) return;
    await sendOTP();
  };

  return (
    <>
      <div className="fixed inset-0 z-[150] bg-black/55 backdrop-blur-sm flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-[32px] border border-[#AFAFAF]/15 shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-7 md:p-8 relative overflow-hidden">

          {/* glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#4EDDE2]/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#3E1747]/10 blur-3xl rounded-full" />

          {/* close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#3E1747]/50 hover:text-[#3E1747]"
          >
            <Icon icon="solar:close-circle-linear" width="28" />
          </button>

          {/* top */}
          <div className="relative z-10 text-center mb-7">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4EDDE2]/15 flex items-center justify-center mb-4">
              <Icon
                icon={
                  step === "details"
                    ? "solar:shield-user-linear"
                    : "solar:verified-check-linear"
                }
                width="28"
                className="text-[#3E1747]"
              />
            </div>

            <p className="text-[11px] uppercase tracking-[0.22em] text-[#4EDDE2] mb-2">
              Free Health Report
            </p>

            <h2 className="text-[28px] font-semibold text-[#111111] leading-tight">
              {step === "details"
                ? "Unlock Your Personalized Score"
                : "Verify Your Email"}
            </h2>

            <p className="text-sm text-[#3E1747]/60 mt-2">
              {step === "details"
                ? "Enter your details to access your complete report."
                : `We sent a verification code to ${form.email}`}
            </p>
          </div>

          {/* STEP 1 */}
          {step === "details" && (
            <div className="relative z-10 space-y-4">

              <div className="relative">
                <Icon
                  icon="solar:user-linear"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40"
                  width="18"
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    updateField("name", e.target.value)
                  }
                  className="w-full h-14 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] pl-12 pr-4 outline-none focus:border-[#4EDDE2]"
                />
              </div>

              <div className="relative">
                <Icon
                  icon="solar:letter-linear"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40"
                  width="18"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    updateField("email", e.target.value)
                  }
                  className="w-full h-14 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] pl-12 pr-4 outline-none focus:border-[#4EDDE2]"
                />
              </div>

              <div className="relative">
                <Icon
                  icon="solar:phone-linear"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40"
                  width="18"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                  className="w-full h-14 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] pl-12 pr-4 outline-none focus:border-[#4EDDE2]"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) =>
                    setAcceptedTerms(e.target.checked)
                  }
                  className="mt-1 accent-[#3E1747]"
                />

                <p className="text-[#3E1747]/70 leading-relaxed">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-[#3E1747] font-medium underline"
                  >
                    Terms & Conditions
                  </button>
                </p>
              </div>

              <button
                onClick={sendOTP}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-[#3E1747] text-white font-medium hover:bg-[#4EDDE2] hover:text-[#3E1747] transition-all disabled:opacity-60"
              >
                {isLoading
                  ? "Sending..."
                  : "Send Verification Code"}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === "otp" && (
            <div className="relative z-10 space-y-4">

              <div className="relative">
                <Icon
                  icon="solar:password-linear"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40"
                  width="18"
                />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6 Digit OTP"
                  value={form.otp}
                  onChange={(e) =>
                    updateField("otp", e.target.value)
                  }
                  className="w-full h-14 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] pl-12 pr-4 outline-none focus:border-[#4EDDE2] tracking-[0.25em]"
                />
              </div>

              <button
                onClick={verifyOTP}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-[#3E1747] text-white font-medium hover:bg-[#4EDDE2] hover:text-[#3E1747] transition-all disabled:opacity-60"
              >
                {isLoading
                  ? "Verifying..."
                  : "View My Health Score"}
              </button>

              <button
                onClick={resendOTP}
                disabled={timer > 0}
                className="w-full text-sm text-[#3E1747]/65 hover:text-[#3E1747] disabled:opacity-40"
              >
                {timer > 0
                  ? `Resend code in ${timer}s`
                  : "Resend Verification Code"}
              </button>
              {/* text to check otp in spam folder if not showing */}
              <p className="text-xs text-[#3E1747]/65 text-center mt-2">
                Didn't receive the code? Check your spam folder.
              </p>
            </div>
          )}
        </div>
      </div>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
    </>
  );
}