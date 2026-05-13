"use client";

const sections = [
  {
    title: "Core Features",
    items: [
      ["One-on-One Calls", "2 Calls", "6 Calls"],
      ["Direct Access", "✔", "✔"],
      ["WhatsApp Support", "✔", "Priority ✔"],
      ["Response Time", "24 Hours", "Priority"],
      ["Diet Plan", "✔", "✔"],
      ["Travel Strategy", "✖", "✔"],
      ["Eating Out Strategy", "✔", "✔"],
      ["Decision-Free Eating", "✖", "✔"],
      ["Lifestyle System", "✖", "✔"],
      ["Progress System", "✖", "✔"],
      ["Tracking Kit", "✖", "✔"],
      ["Recipe Support", "✔", "✔"],
      ["Advanced Recipes", "✖", "✔"],
      ["E-book Access", "Selected", "Full"],
      ["Physical Book", "✖", "✔"],
    ],
  },
  {
    title: "Structure & Personalization",
    items: [
      ["Health Questionnaire", "✔", "✔"],
      ["Lifestyle Assessment", "✔", "✔"],
      ["Body Type Nutrition", "✔", "✔"],
      ["Energy Optimization", "✔", "✔"],
      ["Weight Loss Structuring", "✔", "✔"],
      ["Meal Planning", "✔", "✔"],
      ["Daily Planning", "✔", "✔"],
      ["Revisions", "1", "Multiple"],
      ["Supplement Guidance", "✔", "✔"],
    ],
  },
  {
    title: "Advanced Features",
    items: [
      ["Metabolic Structuring", "✖", "✔"],
      ["Hormonal Nutrition", "✖", "✔"],
      ["Cycle-Based Diet", "✖", "✔"],
      ["PCOS / Thyroid", "✔", "✔"],
      ["Gut Health", "✔", "✔"],
      ["Heart Health", "✔", "✔"],
      ["Fatigue Support", "✔", "✔"],
      ["Illness Diet", "✔", "✔"],
      ["Aggressive Fat Loss", "✖", "✔"],
      ["Wedding Plan", "✖", "✔"],
    ],
  },
  {
    title: "Lifestyle & Extensions",
    items: [
      ["Busy Lifestyle Planning", "✖", "✔"],
      ["Family Meals", "✖", "✔"],
      ["Kids Nutrition", "✖", "✔"],
      ["Pregnancy Nutrition", "✖", "✔"],
      ["Traditional Recipes", "✖", "✔"],
    ],
  },
];

export default function ComparisonTable() {
  return (
    <section className="mt-24 px-4">

      {/* HEADER */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-semibold text-[#111111]">
          Compare XVital Plans
        </h2>
        <p className="text-[#3E1747]/60 mt-3">
          Every Details You Need To Choose Your Best Fit
        </p>
      </div>

      <div className="space-y-10 max-w-6xl mx-auto">

        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-[28px] border border-[#AFAFAF]/10 shadow-2xl overflow-hidden"
          >

            {/* SECTION HEADER */}
            <div className="px-6 py-5 border-b border-[#AFAFAF]/10">
              <h3 className="text-lg font-semibold text-[#3E1747]">
                {section.title}
              </h3>
            </div>

            {/* TABLE */}
            <div className="grid grid-cols-3 text-sm">

              {/* COLUMN HEADERS */}
              <div className="px-6 py-3 text-[#3E1747]/50 text-xs uppercase tracking-wide">
                Feature
              </div>

              <div className="px-6 py-3 text-center text-[#3E1747]/70 text-xs uppercase tracking-wide">
                Reset
              </div>

              <div className="px-6 py-3 text-center text-[#3E1747]/70 text-xs uppercase tracking-wide">
                Control
              </div>

              {section.items.map(([feature, basic, advanced], index) => (
                <>
                  {/* Feature */}
                  <div
                    key={feature}
                    className="px-6 py-4 text-[#111111]/80 border-t border-[#AFAFAF]/10"
                  >
                    {feature}
                  </div>

                  {/* Basic */}
                  <div className="px-6 py-4 text-center text-[#3E1747]/60 border-t border-[#AFAFAF]/10">
                    {basic}
                  </div>

                  {/* Advanced */}
                  <div className="px-6 py-4 text-center text-[#3E1747] border-t border-[#AFAFAF]/10">
                    {advanced}
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}