"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Icon } from "@iconify/react";

import maleQuestions from "./data/maleQuestions.js";
import femaleQuestions from "./data/femaleQuestions.js";

import {
  calculateTotalScore,
  getMaleResult,
  getFemaleResult,
} from "./data/questionHelper.js";

import ProgressBar from "@/app/components/questionnaire/progressBar.js";
import MilestoneBadge from "@/app/components/questionnaire/milestoneBadge.js";
import NavigationButtons from "@/app/components/questionnaire/navigationButtons.js";
import QuestionRenderer from "@/app/components/questionnaire/questionRenderer.js";
import ResultSection from "@/app/components/questionnaire/resultSection.js";

import ConsultationModal from "@/app/components/questionnaire/consultationModal.js";
import CancelModal from "@/app/components/questionnaire/cancelModel.js";
import RescheduleModal from "@/app/components/questionnaire/rescheduleModal.js";
import LeadsModel from "@/app/components/questionnaire/leadsModel.js";
import { useLoader } from "../context/LoaderContext.js";
import { useXVitalFlow } from "@/app/context/XVitalFlowContext.js";
import { BackendURL } from "@/app/lib/config/url.js";
import { toastPromise, showToast } from "@/app/lib/toast.js";

gsap.registerPlugin(useGSAP);

export default function QuestionnaireSection() {
  const router = useRouter();
  const { setLoading } = useLoader();

  const containerRef = useRef(null);
  const resultRef = useRef(null);
  const sectionRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showLeadsModal, setShowLeadsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] =
    useState(false);
  const [showPaymentFailedModal, setShowPaymentFailedModal] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isCancelling, setIsCancelling] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const [isRazorpayLoaded, setIsRazorpayLoaded] =
    useState(false);

  const [rescheduleDate, setRescheduleDate] =
    useState("");

  const [rescheduleTime, setRescheduleTime] =
    useState("");

  const {
    step,
    setStep,

    gender,

    answers,
    setAnswers,

    subAnswers,
    setSubAnswers,

    extraInputs,
    setExtraInputs,

    consultationForm,
    setConsultationForm,

    restoredResult,
    setRestoredResult,

    showResult,
    setShowResult,

    consultationStatus,
    setConsultationStatus,

    isHydrated,
  } = useXVitalFlow();

  // ======================================
  // Load Razorpay
  // ======================================
  useEffect(() => {
    if (
      document.getElementById(
        "razorpay-script"
      )
    ) {
      setIsRazorpayLoaded(true);
      return;
    }

    const script =
      document.createElement("script");

    script.id = "razorpay-script";
    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () =>
      setIsRazorpayLoaded(true);

    document.body.appendChild(script);
  }, []);

  // ======================================
  // Redirect if no state
  // ======================================
  useEffect(() => {
    if (!isHydrated) return;

    const init = async () => {
      setLoading(true);

      try {
        if (!gender && !restoredResult) {
          router.push("/");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isHydrated, gender, restoredResult]);

  // ======================================
  // Questions
  // ======================================
  const questions = useMemo(() => {
    if (!gender) return [];

    return gender === "male"
      ? maleQuestions
      : femaleQuestions;
  }, [gender]);

  const totalSteps = questions.length;

  const currentQuestion =
    questions[step - 1];

  const progress = totalSteps
    ? (step / totalSteps) * 100
    : 0;

  // ======================================
  // Calculate Result
  // ======================================
  const calculatedScore =
    calculateTotalScore(
      questions,
      answers,
      subAnswers
    );

  const calculatedResultData =
    gender === "male"
      ? getMaleResult(
        calculatedScore,
        answers,
        subAnswers
      )
      : getFemaleResult(
        calculatedScore,
        answers,
        subAnswers
      );

  const totalScore =
    restoredResult?.totalScore ??
    calculatedScore;

  const resultData =
    restoredResult?.resultData ??
    calculatedResultData;

  // ======================================
  // SINGLE SOURCE OF TRUTH
  // ======================================
  const normalizedStatus =
    restoredResult?.bookingStatus?.trim()?.toLowerCase() ||
    consultationStatus?.trim()?.toLowerCase() ||
    "draft";

  const isAlreadyBooked = [
    "pending",
    "rescheduled",
    "completed",
    "cancelled",
  ].includes(normalizedStatus);

  const bookedDate =
    consultationForm?.date ||
    restoredResult?.bookedDate ||
    "";

  const bookedTime =
    consultationForm?.time ||
    restoredResult?.bookedTime ||
    "";

  // ======================================
  // Animations
  // ======================================
  useGSAP(
    () => {
      gsap.fromTo(
        ".question-shell",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        }
      );
    },
    {
      scope: containerRef,
      dependencies: [step, showResult],
    }
  );

  useEffect(() => {
    if (
      showResult &&
      resultRef.current
    ) {
      gsap.fromTo(
        resultRef.current,
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        }
      );
    }
  }, [showResult]);

  const scrollToTop = () => {
    setTimeout(() => {
      const top =
        sectionRef.current?.getBoundingClientRect()
          .top +
        window.scrollY || 0;

      window.scrollTo({
        top: top - 140,
        behavior: "smooth",
      });
    }, 80);
  };

  useEffect(() => {
    scrollToTop();
  }, [step, showResult]);

  // ======================================
  // Form Handlers
  // ======================================
  const handleSingleSelect = (
    key,
    value
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleMultiSelect = (
    key,
    value
  ) => {
    setAnswers((prev) => {
      const old =
        prev[key] || [];

      return {
        ...prev,
        [key]: old.includes(value)
          ? old.filter(
            (item) =>
              item !== value
          )
          : [...old, value],
      };
    });
  };

  const handleSubAnswer = (
    key,
    value,
    type = "single-select"
  ) => {
    setSubAnswers((prev) => {
      if (
        type ===
        "multi-select"
      ) {
        const old =
          prev[key] || [];

        return {
          ...prev,
          [key]:
            old.includes(value)
              ? old.filter(
                (item) =>
                  item !==
                  value
              )
              : [
                ...old,
                value,
              ],
        };
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleInputChange = (
    key,
    value
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExtraInput = (
    key,
    value
  ) => {
    setExtraInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateCurrentStep = () => {
    if (!currentQuestion)
      return false;

    if (
      currentQuestion.type ===
      "single-select"
    ) {
      return !!answers[
        currentQuestion.key
      ];
    }

    if (
      currentQuestion.type ===
      "multi-select"
    ) {
      return (
        answers[
          currentQuestion.key
        ]?.length > 0
      );
    }

    if (
      currentQuestion.type ===
      "textarea"
    ) {
      return !!answers[
        currentQuestion.key
      ]?.trim();
    }

    if (
      currentQuestion.type ===
      "group"
    ) {
      return currentQuestion.fields.every(
        (field) =>
          answers[field.key]
      );
    }

    return true;
  };

  // ======================================
  // Steps
  // ======================================
  const nextStep = () => {
    if (!validateCurrentStep()) {
      showToast("Please answer this question first", "error");
      return;
    }

    // 🔥 show toast from question config
    if (currentQuestion?.afterText?.trim()) {
      showToast(currentQuestion.afterText, "success");
    }

    if (step < totalSteps) {
      setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 350); // small delay so toast feels natural
      return;
    }

    setRestoredResult(null);

    setTimeout(() => {
      setShowLeadsModal(true);
    }, 350);
  };

  const prevStep = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }

    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // ======================================
  // CTA
  // ======================================
  const handleResultCTA = async () => {
    if (
      normalizedStatus ===
      "cancelled"
    ) {
      setShowRescheduleModal(true);
      return;
    }

    if (isAlreadyBooked) {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/packages")
      setLoading(false)
      return;
    }

    setShowPopup(true);
  };

  // ======================================
  // Build Payload
  // ======================================
  const buildPayload = () => ({
    name: consultationForm.name,
    phone: consultationForm.phone,
    email: consultationForm.email.trim().toLowerCase(),

    gender,

    weight: Number(answers.current_weight || 0),
    height: Number(answers.height_cm || 0),
    age: Number(answers.age || 0),

    healthScore: totalScore,
    healthLabel: resultData?.label || "",
    bodyInsights: resultData?.issues?.join("||") || "",
    whyThisHappens: resultData?.message || "",
    possibleOutcomes: resultData?.outcome?.join("||") || "",
    foodRestrictions: answers.food_restrictions || [],

    // 🔥 ADD THESE
    questionnaireAnswers: answers,
    questionnaireSubAnswers: subAnswers,
    questionnaireExtraInputs: extraInputs,

    date: consultationForm.date,
    time: consultationForm.time,
  });

  if (!gender) return null;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen bg-[#FAFAFB] pt-[50%] md:pt-32 pb-32 "
      >
        <div className="max-w-[760px] mx-auto px-5">
          {
            !showResult && (
              // Heading
              <div className="text-center mb-8 flex flex-col gap-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3E1747] leading-tight">
                  Complete Your Assessment
                </h2>
                <p className="text-[#3E1747]/70 text-lg font-light">
                  {/* very short text */}
                  Answer a few simple questions about your lifestyle and habits to get a personalized nutrition protocol tailored for you.
                </p>
              </div>
            )
          }

          {!showResult ? (

            <div
              ref={containerRef}
              className="bg-white rounded-[30px] p-6"
            >

              <ProgressBar
                step={step}
                totalSteps={
                  totalSteps
                }
                progress={
                  progress
                }
              />

              <MilestoneBadge
                text={
                  currentQuestion?.milestoneText
                }
              />

              <QuestionRenderer
                currentQuestion={
                  currentQuestion
                }
                answers={
                  answers
                }
                subAnswers={
                  subAnswers
                }
                extraInputs={
                  extraInputs
                }
                onSingleSelect={
                  handleSingleSelect
                }
                onMultiSelect={
                  handleMultiSelect
                }
                onSubAnswer={
                  handleSubAnswer
                }
                onInputChange={
                  handleInputChange
                }
                onExtraInput={
                  handleExtraInput
                }
              />

              <NavigationButtons
                step={step}
                totalSteps={
                  totalSteps
                }
                onBack={
                  prevStep
                }
                onNext={
                  nextStep
                }
                isValid={validateCurrentStep()}
              />
            </div>
          ) : (
            <ResultSection
              ref={resultRef}
              gender={gender}
              totalScore={
                totalScore
              }
              resultData={
                resultData
              }
              onPrimaryAction={
                handleResultCTA
              }
              isAlreadyBooked={
                isAlreadyBooked
              }
              bookedDate={
                bookedDate
              }
              bookedTime={
                bookedTime
              }
              userName={
                consultationForm.name
              }
              consultationStatus={
                normalizedStatus
              }
              onCancel={() =>
                setShowCancelModal(
                  true
                )
              }
            />
          )}
        </div>
      </section>

      {/* Leads */}
      <LeadsModel
        isOpen={
          showLeadsModal
        }
        onClose={() =>
          setShowLeadsModal(
            false
          )
        }
        totalScore={
          totalScore
        }
        resultData={
          resultData
        }
        answers={answers}
        extraInputs={
          extraInputs
        }
        gender={gender}
        onSuccess={(user) => {

          setConsultationForm((prev) => ({
            ...prev,
            name: user.name,
            email: user.email,
            phone: user.phone,
          }));

          // 🔥 restore backend status
          setConsultationStatus(
            user.status || "draft"
          );

          setShowLeadsModal(false);

          setShowResult(true);

          showToast(
            "Assessment verified successfully",
            "success"
          );
        }}
      />

      {/* Consultation */}
      <ConsultationModal
        isOpen={showPopup}
        isSubmitting={
          isSubmitting
        }
        consultationForm={
          consultationForm
        }
        setConsultationForm={
          setConsultationForm
        }
        onClose={() =>
          setShowPopup(
            false
          )
        }
        onSubmit={async () => {
          try {
            if (
              !isRazorpayLoaded
            ) {
              showToast(
                "Payment gateway loading..."
              );
              return;
            }

            setIsSubmitting(
              true
            );

            const payload =
              buildPayload();

            const orderRes =
              await axios.post(
                `${BackendURL}/consultations/create-order`
              );

            const order =
              orderRes.data
                ?.order;
            if (!order) {
              showToast("Failed to create order. Please try again.", "error");
              setIsSubmitting(false);
              return;
            }

            const razorpay =
              new window.Razorpay({
                key: process.env
                  .NEXT_PUBLIC_RAZORPAY_KEY,

                amount: order.amount,

                currency: "INR",

                order_id: order.id,

                name: "X Vital",

                description:
                  "Consultation Booking",

                prefill: {
                  name: payload.name,
                  email: payload.email,
                  contact: payload.phone,
                },

                handler: async (response) => {
                  try {

                    console.log(
                      "RAZORPAY SUCCESS:",
                      response
                    );

                    await toastPromise(
                      axios.post(
                        `${BackendURL}/consultations/verify-payment`,
                        {
                          email:
                            consultationForm.email,

                          date:
                            consultationForm.date,

                          time:
                            consultationForm.time,

                          razorpay_order_id:
                            response.razorpay_order_id,

                          razorpay_payment_id:
                            response.razorpay_payment_id,

                          razorpay_signature:
                            response.razorpay_signature,
                        }
                      ),
                      {
                        loading:
                          "Verifying payment...",

                        success:
                          "Payment successful! Booking confirmed.",

                        error:
                          "Payment verification failed.",
                      }
                    );

                    setConsultationStatus(
                      "pending"
                    );

                    setRestoredResult({
                      totalScore,
                      resultData,
                      bookingStatus:
                        "pending",
                      bookedDate:
                        consultationForm.date,
                      bookedTime:
                        consultationForm.time,
                    });

                    setShowPopup(false);

                    setShowResult(true);

                    setShowWhatsappModal(true);

                  } catch (err) {
                    console.error(err);

                    setShowPaymentFailedModal(
                      true
                    );
                  }
                },

                modal: {
                  ondismiss: () => {
                    console.log("Razorpay popup closed");
                  },
                },
              });

            razorpay.on(
              "payment.failed",
              function (response) {
                console.error(
                  "Payment Failed:",
                  response
                );

                showToast(
                  "Payment failed. Please try again.",
                  "error"
                );
              }
            );
            razorpay.open();
          } finally {
            setIsSubmitting(
              false
            );
          }
        }}
      />

      {/* Cancel */}
      <CancelModal
        isOpen={
          showCancelModal
        }
        onClose={() =>
          setShowCancelModal(
            false
          )
        }
        isLoading={
          isCancelling
        }
        onConfirm={async () => {
          try {
            setIsCancelling(
              true
            );

            await toastPromise(
              axios.patch(
                `${BackendURL}/consultations/cancel`,
                {
                  email:
                    consultationForm.email,
                }
              ), {
              loading: "Cancelling consultation...",
              success: "Consultation cancelled",
              error: "Failed to cancel consultation"
            }
            );

            setConsultationStatus(
              "cancelled"
            );

            setRestoredResult(
              (
                prev
              ) => ({
                ...prev,
                bookingStatus:
                  "cancelled",
              })
            );

            setShowCancelModal(
              false
            );
          } finally {
            setIsCancelling(
              false
            );
          }
        }}
      />

      {/* Reschedule */}
      <RescheduleModal
        isOpen={
          showRescheduleModal
        }
        onClose={() =>
          setShowRescheduleModal(
            false
          )
        }
        date={
          rescheduleDate
        }
        setDate={
          setRescheduleDate
        }
        time={
          rescheduleTime
        }
        setTime={
          setRescheduleTime
        }
        isLoading={isRescheduling}
        onSubmit={async () => {
          if (!rescheduleDate || !rescheduleTime) {
            showToast("Please select date and time", "error");
            return;
          }
          try {
            setIsRescheduling(
              true
            );
            await toastPromise(
              axios.patch(
                `${BackendURL}/consultations/reschedule`,
                {
                  email:
                    consultationForm.email,
                  date:
                    rescheduleDate,
                  time:
                    rescheduleTime,
                }
              ), {
              loading: "Rescheduling consultation...",
              success: "Consultation rescheduled successfully",
              error: "Failed to reschedule consultation"
            }
            );


            setConsultationStatus(
              "rescheduled"
            );

            setConsultationForm(prev => ({
              ...prev,
              date: rescheduleDate,
              time: rescheduleTime
            }));

            setRestoredResult({
              totalScore,
              resultData,
              bookingStatus: "rescheduled",
              bookedDate: rescheduleDate,
              bookedTime: rescheduleTime
            });

            setRescheduleDate("");
            setRescheduleTime("");

            setShowRescheduleModal(
              false
            );
          } finally {
            setIsRescheduling(
              false
            );
          }
        }}
      />

      {/* WhatsApp */}
      {showWhatsappModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white rounded-[30px] p-7 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-5">
              <Icon
                icon="logos:whatsapp-icon"
                width="34"
              />
            </div>

            <h3 className="text-2xl font-semibold mb-3">
              Booking Confirmed 🎉
            </h3>

            <p className="text-sm text-black/60 mb-6 leading-7">
              Join our WhatsApp
              community for support
              and updates.
            </p>

            <a
              href="https://chat.whatsapp.com/IaHhhhhhf86XAcfe2hYBf4tyyA5g?s=sh&p=i&mlu=0"
              target="_blank"
              className="block w-full bg-green-500 text-white py-3 rounded-2xl font-medium"
            >
              Join WhatsApp Community
            </a>

            <button
              onClick={() =>
                setShowWhatsappModal(
                  false
                )
              }
              className="mt-3 text-sm text-black/50"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
      {/* Payment Failed Modal */}
      {showPaymentFailedModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">

          <div className="bg-white rounded-[30px] p-7 max-w-md w-full text-center">

            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-5">

              <Icon
                icon="solar:close-circle-bold"
                width="34"
                className="text-red-500"
              />

            </div>

            <h3 className="text-2xl font-semibold mb-3">
              Payment Failed
            </h3>

            <p className="text-sm text-black/60 mb-6 leading-7">
              Your payment was not completed.
              Please try again to confirm
              your consultation booking.
            </p>

            <button
              onClick={() => {
                setShowPaymentFailedModal(false);
                setShowPopup(true);
              }}
              className="block w-full bg-[#3E1747] text-white py-3 rounded-2xl font-medium"
            >
              Try Again
            </button>

            <button
              onClick={() =>
                setShowPaymentFailedModal(false)
              }
              className="mt-3 text-sm text-black/50"
            >
              Cancel
            </button>

          </div>

        </div>
      )}
    </>
  );
}