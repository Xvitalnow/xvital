export default function ProgressBar({ step, totalSteps, progress }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[#3E1747]/40">
          Step {step} of {totalSteps}
        </span>

        <span className="text-[11px] uppercase tracking-[0.14em] text-[#4EDDE2]">
          Profile Assessment
        </span>
      </div>

      <div className="w-full bg-[#F0F1F3] h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[#4EDDE2] h-full transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}