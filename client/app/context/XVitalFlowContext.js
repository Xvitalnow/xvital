"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { showToast } from "../lib/toast";
import { useRouter } from "next/navigation";

const XVitalFlowContext = createContext(null);

const STORAGE_KEY = "xvital_flow";

const defaultConsultationForm = {
  name: "",
  phone: "",
  email: "",
  date: "",
  time: "",
};

export function XVitalFlowProvider({ children }) {
  const router = useRouter();

  // 🔥 CONTROL MODE
  const [mode, setMode] = useState("idle"); 
  // idle | fresh | resume | hydrated

  const [gender, setGender] = useState(null);
  const [answers, setAnswers] = useState({});
  const [subAnswers, setSubAnswers] = useState({});
  const [extraInputs, setExtraInputs] = useState({});
  const [consultationStatus, setConsultationStatus] = useState("draft");
  const [consultationForm, setConsultationForm] = useState(
    defaultConsultationForm
  );
  const [restoredResult, setRestoredResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [step, setStep] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);

  // =========================================
  // 🔥 HYDRATE ONLY WHEN MODE = IDLE
  // =========================================
  useEffect(() => {
    if (mode !== "idle") return;

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setGender(parsed.gender || null);
        setAnswers(parsed.answers || {});
        setSubAnswers(parsed.subAnswers || {});
        setExtraInputs(parsed.extraInputs || {});
        setConsultationForm(parsed.consultationForm || defaultConsultationForm);
        setStep(parsed.step || 1);
        setShowResult(parsed.showResult || false);
        setConsultationStatus(parsed.consultationStatus || "pending");

        if (parsed.restoredResult) {
          setRestoredResult(parsed.restoredResult);
        }

        setMode("hydrated"); // ✅ mark hydrated
      } catch (err) {
        showToast("Failed to restore progress. Starting fresh.", "error");
        localStorage.removeItem(STORAGE_KEY);
        router.push("/");
      }
    }

    setIsHydrated(true);
  }, [mode]);

  // =========================================
  // 🔥 AUTO SAVE (ONLY WHEN NOT FRESH RESETTING)
  // =========================================
  useEffect(() => {
    if (mode === "fresh") return; // 🚫 don't save during reset moment

    const data = {
      gender,
      answers,
      subAnswers,
      extraInputs,
      consultationForm,
      restoredResult,
      showResult,
      step,
      consultationStatus,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [
    gender,
    answers,
    subAnswers,
    extraInputs,
    consultationForm,
    restoredResult,
    showResult,
    step,
    consultationStatus,
    mode,
  ]);

  // =========================================
  // ✅ FRESH START (IGNORES STORAGE)
  // =========================================
  const startFreshAssessment = (selectedGender) => {
    setMode("fresh"); // 🔥 BLOCK hydration

    localStorage.removeItem(STORAGE_KEY);

    setGender(selectedGender);
    setAnswers({});
    setSubAnswers({});
    setExtraInputs({});
    setConsultationForm(defaultConsultationForm);
    setRestoredResult(null);
    setShowResult(false);
    setStep(1);
    setConsultationStatus("draft");

    // after reset complete → allow saving again
    setTimeout(() => {
      setMode("idle");
    }, 0);
  };

  // =========================================
  // ✅ RESUME (OVERRIDE EVERYTHING)
  // =========================================
  const restoreAssessmentData = (data) => {
    setMode("resume"); // 🔥 override mode

    setGender(data.gender || null);
    setAnswers(data.answers || {});
    setSubAnswers(data.subAnswers || {});
    setExtraInputs(data.extraInputs || {});
    setConsultationForm(data.consultationForm || defaultConsultationForm);

    const status = data.status?.toLowerCase() || "draft";
    setConsultationStatus(status);

    setRestoredResult({
      totalScore: data.totalScore || 0,
      resultData: data.resultData || null,
      isAlreadyBooked: data.isAlreadyBooked || false,
      bookingStatus: status,
      bookedDate: data.consultationForm?.date || "",
      bookedTime: data.consultationForm?.time || "",
    });

    setShowResult(true);
    setStep(1);

    // allow saving again
    setTimeout(() => {
      setMode("idle");
    }, 0);
  };

  // =========================================
  // ✅ CLEAR RESULT ONLY
  // =========================================
  const clearRestoredAssessment = () => {
    setRestoredResult(null);
    setShowResult(false);
  };

  // =========================================
  // ✅ FULL RESET
  // =========================================
  const resetFlow = () => {
    setMode("fresh");

    localStorage.removeItem(STORAGE_KEY);

    setGender(null);
    setAnswers({});
    setSubAnswers({});
    setExtraInputs({});
    setConsultationForm(defaultConsultationForm);
    setRestoredResult(null);
    setShowResult(false);
    setStep(1);
    setConsultationStatus("draft");

    setTimeout(() => {
      setMode("idle");
    }, 0);
  };

  return (
    <XVitalFlowContext.Provider
      value={{
        consultationForm,
        setConsultationForm,

        gender,
        setGender,

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

        step,
        setStep,

        consultationStatus,
        setConsultationStatus,

        startFreshAssessment,
        restoreAssessmentData,
        clearRestoredAssessment,
        resetFlow,

        isHydrated,
      }}
    >
      {children}
    </XVitalFlowContext.Provider>
  );
}

export function useXVitalFlow() {
  const context = useContext(XVitalFlowContext);

  if (!context) {
    throw new Error("useXVitalFlow must be used inside XVitalFlowProvider");
  }

  return context;
}