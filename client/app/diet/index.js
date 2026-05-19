"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import AssessmentFlowModal from "@/app/components/assessmentFlowModal";
import { startAssessment } from "@/app/utils/startAssessment";


export default function DietSection() {
  const [genderModalOpen, setGenderModalOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <section className="relative pt-[50%] md:pt-32 pb-32 bg-[#FAFAFB] overflow-hidden">

        {/* Background */}
        <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-[#4EDDE2]/15 blur-3xl rounded-full" />


        <div className="max-w-4xl mx-auto px-6 relative z-10">

          {/* Tag */}
          <div className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#4EDDE2]/30 bg-white/80 backdrop-blur-md text-[#3E1747] text-sm font-medium shadow-sm">
              <Icon icon="solar:danger-triangle-linear" width="18" />
              Modern Health Reality
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#3E1747] leading-tight mb-6">
              Your Body Isn’t the Problem
            </h2>

            <p className="text-[#3E1747]/70 text-lg font-light">
              It’s reacting to the way you live every day.
            </p>
          </div>

          {/* Content Blocks */}
          <div className="space-y-12">

            {/* Block 1 */}
            <div className="border-l-2 border-[#4EDDE2]/40 pl-6">
              <p className="text-lg text-[#3E1747]/80 leading-relaxed">
                Late dinners, long sitting hours, constant stress, and quick processed meals
                this has quietly become your normal routine.
              </p>
            </div>

            {/* Block 2 */}
            <div className="pl-6">
              <p className="text-lg text-[#3E1747]/70 leading-relaxed">
                But internally, your body is adapting to this overload. Your metabolism slows down,
                digestion weakens, and hormones begin to shift not suddenly, but gradually.
              </p>
            </div>

            {/* Block 3 (highlight) */}
            <div className="pl-6">
              <p className="text-lg text-[#3E1747]/80 leading-relaxed">
                Then the signals appear
                <span className="text-[#4EDDE2] font-medium"> low energy, cravings, fat gain, poor focus.</span>
              </p>
            </div>

            {/* Block 4 */}
            <div className="pl-6">
              <p className="text-lg text-[#3E1747]/70 leading-relaxed">
                You try to fix it by eating “better”, being stricter, or following random advice.
                But nothing feels consistent. Results don’t last.
              </p>
            </div>

            {/* Block 5 (strong close) */}
            <div className="pl-6 border-l-2 border-[#3E1747]">
              <p className="text-xl text-[#3E1747] font-medium leading-relaxed">
                It’s not a discipline problem. <br />
                It’s a mismatch between your body and the system you’re following.
              </p>
            </div>

          </div>

          {/* FAQ Section */}
          <div className="mt-28">

            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#3E1747] mb-4">
                Frequently Asked Questions
              </h2>

              <p className="text-[#3E1747]/60 text-lg font-light">
                Everything you should know before starting your nutrition journey.
              </p>
            </div>

            <div className="space-y-6">

              {/* FAQ 1 */}
              <div className="bg-white border border-[#AFAFAF]/20 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-[#3E1747] mb-3">
                  Is this only for weight loss?
                </h3>

                <p className="text-[#3E1747]/70 leading-relaxed">
                  No. XVITAL focuses on overall health improvement including energy,
                  digestion, recovery, hormonal balance, and sustainable body
                  transformation not just fat loss.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="bg-white border border-[#AFAFAF]/20 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-[#3E1747] mb-3">
                  Can I follow this with Indian food?
                </h3>

                <p className="text-[#3E1747]/70 leading-relaxed">
                  Yes. XVITAL is designed specifically around Indian eating habits,
                  lifestyles, and daily routines rather than unrealistic foreign diet
                  systems.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="bg-white border border-[#AFAFAF]/20 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-[#3E1747] mb-3">
                  Do I need supplements to get results?
                </h3>

                <p className="text-[#3E1747]/70 leading-relaxed">
                  Not necessarily. The primary focus is improving nutrition, habits,
                  meal structure, recovery, and consistency before relying on
                  supplements.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-white border border-[#AFAFAF]/20 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-[#3E1747] mb-3">
                  How long does it take to see results?
                </h3>

                <p className="text-[#3E1747]/70 leading-relaxed">
                  Most individuals begin noticing improvements in energy, digestion,
                  and daily performance within the first few weeks depending on their
                  consistency and lifestyle habits.
                </p>
              </div>

              {/* FAQ 5 */}
              <div className="bg-white border border-[#AFAFAF]/20 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-[#3E1747] mb-3">
                  Is the assessment free?
                </h3>

                <p className="text-[#3E1747]/70 leading-relaxed">
                  Yes. The body assessment is completely free and helps identify your
                  lifestyle patterns, health signals, and nutrition needs before
                  recommending the right direction.
                </p>
              </div>

            </div>

          </div>

          {/* CTA */}
          <div className="flex flex-col items-center mt-20">

            <button
              onClick={() => setGenderModalOpen(true)}
              className="group bg-[#3E1747] text-md text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:bg-[#4EDDE2] hover:text-[#3E1747] flex items-center gap-3 shadow-xl"
            >
              <Icon icon="mdi:clipboard-list" width={20} />
              <Icon icon="mdi:clipboard-list md:hidden" width={25} />
              Start Your Body Assessment
              <Icon icon="mdi:arrow-right" width={20} />
            </button>

            <p className="text-[#3E1747]/50 text-sm mt-4">
              Takes 2–3 minutes • No payment required
            </p>

          </div>

        </div>
      </section>

      {genderModalOpen && (
        <AssessmentFlowModal
          isOpen={genderModalOpen}
          onClose={() => setGenderModalOpen(false)}
          onStartFresh={(gender) => {
            setGenderModalOpen(false);
            startAssessment(gender, router);
          }}
        />
      )}
    </>
  );
}