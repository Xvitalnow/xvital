export default function NavigationButtons({
  step,
  totalSteps,
  onBack,
  onNext,
  isValid,
}) {
  return (
    <div className="mt-6 pt-5 border-t border-[#AFAFAF]/12 flex items-center justify-between">
      <button
        onClick={onBack}
        className={`px-5 py-2.5 rounded-xl border border-[#AFAFAF]/20 text-sm text-[#3E1747] transition ${
          step === 1 ? "opacity-0 pointer-events-none" : "hover:bg-[#FAFAFB]"
        }`}
      >
        Back
      </button>

      <button
        onClick={onNext}
        className={`px-6 md:px-7 py-3 rounded-xl text-sm font-medium transition-all ${
          isValid
            ? "bg-[#3E1747] text-white hover:bg-[#4EDDE2] hover:text-[#3E1747]"
            : "bg-[#AFAFAF]/15 text-[#3E1747]/35 cursor-not-allowed"
        }`}
      >
        {step === totalSteps ? "Generate Score" : "Next Step"}
      </button>
    </div>
  );
}