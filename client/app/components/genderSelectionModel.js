"use client";

import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { startAssessment } from "../utils/startAssessment.js";
import AssessmentChoiceModal from "./assessmentChoiceModel.js";
import ResumeAssessmentModal from "./resumeAssessmentModel.js";

export default function GenderSelectionModal({ isOpen, onClose }) {
  const router = useRouter();

  const [selectedGender, setSelectedGender] = useState(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  if (!isOpen) return null;

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setShowChoiceModal(true);
  };

  const handleStartFresh = (gender) => {
    onClose();
    setShowChoiceModal(false);
    setShowResumeModal(false);
    startAssessment(gender, router);
  };

  const handleResume = () => {
    setShowChoiceModal(false);
    setShowResumeModal(true);
  };

  return (
    <>
      {/* Gender Modal */}
      {!showChoiceModal && !showResumeModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#3E1747]/60 hover:text-[#3E1747]"
            >
              <Icon icon="solar:close-circle-linear" width="26" />
            </button>

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
          </div>
        </div>
      )}

      {/* Choice Modal */}
      <AssessmentChoiceModal
        isOpen={showChoiceModal}
        onClose={() => {
          setShowChoiceModal(false);
          onClose();
        }}
        selectedGender={selectedGender}
        onResume={handleResume}
        onStartFresh={handleStartFresh}
      />

      {/* Resume Modal */}
      <ResumeAssessmentModal
        isOpen={showResumeModal}
        onClose={() => {
          setShowResumeModal(false);
          onClose();
        }}
        selectedGender={selectedGender}
        router={router}
        onStartFresh={handleStartFresh}
      />
    </>
  );
}