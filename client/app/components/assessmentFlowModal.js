"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import axios from "axios";

import { BackendURL } from "../lib/config/url";
import { useXVitalFlow } from "../context/XVitalFlowContext";
import { useLoader } from "../context/LoaderContext";

import { showToast, toastPromise } from "../lib/toast.js";

export default function AssessmentFlowModal({
  isOpen,
  onClose,
  skipGenderStep = false,
  initialGender = null,
}) {
  const router = useRouter();

  const { startFreshAssessment, restoreAssessmentData, setConsultationStatus, clearRestoredAssessment } = useXVitalFlow();
  const { setLoading } = useLoader();
  const [step, setStep] = useState(skipGenderStep ? "choice" : "gender");
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep(skipGenderStep ? "choice" : "gender");
      setSelectedGender(initialGender || null);
      setEmail("");
      setError("");
      setIsLoading(false);
    }
  }, [isOpen, skipGenderStep, initialGender]);
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  if (!isOpen) return null;

  const resetAndClose = () => {
    setStep(skipGenderStep ? "choice" : "gender");
    setSelectedGender(initialGender || null);
    setEmail("");
    setError("");
    setIsLoading(false);

    // if no gender selected = wipe previous storage
    if (!selectedGender) {
      clearRestoredAssessment();
      localStorage.removeItem("xvital_flow");
    }

    onClose();
  };

  const handleGenderSelect = (gender) => {
    startFreshAssessment(gender);
    setSelectedGender(gender);
    setStep("choice");
  };
  const handleStartFresh = async () => {
  if (!selectedGender) {
    setError("Please select your program first.");
    return;
  }

  clearRestoredAssessment();

  startFreshAssessment(selectedGender);

  setConsultationStatus("draft");

 
  // allow render
  setLoading(true);
  await new Promise((resolve) => setTimeout(resolve, 50));

  // NOW close modal
  resetAndClose();

  // allow paint
  await new Promise((resolve) => setTimeout(resolve, 150));

  router.push("/questionnaire");
  setLoading(false);
};

  // 🔐 SEND OTP (NEW)
  const handleSendOTP = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail) {
      showToast("Please Enter your Email", "error");
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    try {
      setIsLoading(true);
      setLoading(true);
      setError("");

      await toastPromise(
        axios.post(`${BackendURL}/order/send-otp`, {
          email: normalizedEmail,
        }),
        {
          loading: "Sending OTP...",
          success: "OTP sent to your email",
          error: "Failed to send OTP",
        }
      );

      setOtpStep(true);
      setTimer(60);

    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong. Please try again.", "error");
      setIsLoading(false);
      setLoading(false);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleFetchAssessment = async () => {
    // 🔐 IF OTP NOT VERIFIED → VERIFY FIRST
    if (otpStep) {
      if (!otp.trim()) {
        showToast("Enter OTP", "error");
        return;
      }

      try {
        setIsLoading(true);
        await toastPromise(
          axios.post(`${BackendURL}/order/verify-otp`, {
            email: email.trim().toLowerCase(),
            otp,
          }),
          {
            loading: "Verifying...",
            success: "Verified successfully",
            error: "Invalid OTP",
          }
        );

      } catch (err) {
        showToast(err.response?.data?.message || "Something went wrong. Please try again.", "error");
        setIsLoading(false);
        return;
      }
    }
    const normalizedEmail = email.trim().toLowerCase();

    // ✅ EMAIL VALIDATION ADDED (ONLY THIS PART IMPROVED)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!normalizedEmail) {
      showToast("Please Enter your Email", "error");
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    try {
      setIsLoading(true);

      const response = await toastPromise(
        (async () => {
          const res = await axios.get(`${BackendURL}/consultations`, {
            params: { email: normalizedEmail },
          });

          if (!res.data.success || !res.data.consultation) {
            showToast("No Assessment Found for this Email", "error");
            setLoading(false);
          }
          // console.log("Data: ", res.data?.consultation?.status); // debug
          setConsultationStatus(res.data?.consultation?.status || "pending"); // set status for booking button
          return res;
        })(),
        {
          loading: "Fetching your previous report...",
          success: "Report restored successfully.",
          error: "Failed to fetch your report",
        }
      );

      const consultation = response?.data?.consultation;
      const currentStatus =
        (consultation.status || "draft").toLowerCase();
      const restoredData = {

        gender: consultation.gender,
        totalScore: consultation.healthScore || 0,
        resultData: {
          label: consultation.healthLabel || "",
          issues: consultation.bodyInsights
            ? consultation.bodyInsights.split("||")
              .map((item) => item.trim())
              .filter(Boolean)
            : [],
          message: consultation.whyThisHappens || "",
          outcome: consultation.possibleOutcomes
            ? consultation.possibleOutcomes.split("||")
              .map((item) => item.trim())
              .filter(Boolean)
            : [],
        },
        consultationForm: {
          name: consultation.name || "",
          phone: consultation.phone || "",
          email: consultation.email || "",
          date: consultation.date || "",
          time: consultation.time || "",
        },
        answers: {
          current_weight: consultation.weight || "",
          height_cm: consultation.height || "",
          age: consultation.age || "",
        },
        isAlreadyBooked: [
          "pending",
          "rescheduled",
          "completed",
          "cancelled",
        ].includes(currentStatus),
        bookingStatus: consultation.status || "pending",
        status: consultation.status || "pending",
      };
      startFreshAssessment(selectedGender);
      restoreAssessmentData(restoredData);
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      resetAndClose();
      router.push("/questionnaire");
      setLoading(false);
    } catch (err) {
      showToast("Something went wrong. Please try again.", "error");
      setIsLoading(false);
      setLoading(false);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-[#3E1747]/60 hover:text-[#3E1747]"
        >
          <Icon icon="solar:close-circle-linear" width="26" />
        </button>

        {step === "gender" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-[#3E1747] mb-2">
                Choose Your Program
              </h2>
              <p className="text-sm text-[#3E1747]/60">
                Select your biological baseline to continue.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleGenderSelect("male")}
                className="w-full border border-[#AFAFAF]/30 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-[#3E1747] hover:text-white transition-all group"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-base">Male Protocol</h3>
                  <p className="text-sm opacity-70">
                    Optimized for male physiology
                  </p>
                </div>
                <Icon
                  icon="solar:arrow-right-linear"
                  className="text-xl group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={() => handleGenderSelect("female")}
                className="w-full border border-[#AFAFAF]/30 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-[#3E1747] hover:text-white transition-all group"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-base">Female Protocol</h3>
                  <p className="text-sm opacity-70">
                    Optimized for female physiology
                  </p>
                </div>
                <Icon
                  icon="solar:arrow-right-linear"
                  className="text-xl group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </>
        )}

        {step === "choice" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-[#3E1747] mb-2">
                Completed Your Assessment Before?
              </h2>
              <p className="text-sm text-[#3E1747]/60">
                Resume your previous health report or start a new one.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  setError("");
                  setStep("resume");
                }}
                className="w-full border border-[#AFAFAF]/30 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-[#3E1747] hover:text-white transition-all group"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-base">
                    Resume Previous Report
                  </h3>
                  <p className="text-sm opacity-70">
                    Restore your saved assessment using email
                  </p>
                </div>
                <Icon
                  icon="solar:arrow-right-linear"
                  className="text-xl group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={handleStartFresh}
                className="w-full border border-[#AFAFAF]/30 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-[#3E1747] hover:text-white transition-all group"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-base">
                    Start New Assessment
                  </h3>
                  <p className="text-sm opacity-70">
                    Answer the questionnaire again
                  </p>
                </div>
                <Icon
                  icon="solar:arrow-right-linear"
                  className="text-xl group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </>
        )}

        {step === "resume" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-[#3E1747] mb-2">
                Resume Your Report
              </h2>
              <p className="text-sm text-[#3E1747]/60">
                Enter your email to restore your previous health report.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Icon
                  icon="solar:letter-linear"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40 text-lg"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] py-4 outline-none focus:border-[#4EDDE2]"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              {!otpStep ? (
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full bg-[#3E1747] text-white py-3.5 rounded-2xl hover:bg-[#4EDDE2] hover:text-[#3E1747] transition-all font-medium disabled:opacity-60"
                >
                  {isLoading ? "Sending..." : "Continue"}
                </button>
              ) : (
               <>
                <div className="relative">
                <Icon
                  icon="solar:password-linear"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E1747]/40"
                  width="18"
                />
                  <input
                    type="text"
                    placeholder="Enter Your 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-11 pr-4 rounded-2xl border border-[#AFAFAF]/15 bg-[#FAFAFB] py-4 outline-none focus:border-[#4EDDE2]"
                  />
                </div>

                  <button
                    onClick={handleFetchAssessment}
                    disabled={isLoading}
                    className="w-full bg-[#3E1747] text-white py-3.5 rounded-2xl hover:bg-[#4EDDE2] hover:text-[#3E1747] transition-all font-medium disabled:opacity-60"
                  >
                    {isLoading ? "Verifying..." : "Continue"}
                  </button>

                  <button
                    onClick={handleSendOTP}
                    disabled={timer > 0}
                    className="w-full text-sm text-[#3E1747]/60"
                  >
                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                  </button>
                  {/* text to check otp in spam folder if not showing */}
        <p className="text-xs text-[#3E1747]/65 text-center mt-2">
          Didn't receive the code? Check your spam folder.
        </p>
                </>
              )}

              <button
                onClick={handleStartFresh}
                disabled={isLoading}
                className="w-full border border-[#AFAFAF]/30 text-[#3E1747] py-3.5 rounded-2xl hover:bg-[#FAFAFB] transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Start Assessment Again
              </button>

              <button
                onClick={() => {
                  setError("");
                  setStep("choice");
                }}
                disabled={isLoading}
                className="w-full text-sm text-[#3E1747]/60 hover:text-[#3E1747] disabled:opacity-60"
              >
                ← Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}