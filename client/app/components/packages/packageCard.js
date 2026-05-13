"use client";

export default function PackageCard({ data, onSelect }) {
  return (
    <div
      onClick={() => onSelect(data)}
      className="group cursor-pointer bg-white border border-[#AFAFAF]/15 rounded-[30px] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.04)] hover:shadow-xl transition"
    >
      <p className="text-xs uppercase tracking-wide text-[#4EDDE2] mb-2">
        {data.duration}
      </p>

      <h3 className="text-2xl font-semibold text-[#111111] mb-3">
        {data.name}
      </h3>

      <p className="text-[#3E1747]/60 mb-6">
        {data.description}
      </p>

      <ul className="space-y-2 mb-6">
        {data.highlights.map((item) => (
          <li key={item} className="text-sm text-[#111111]/80">
            ✔ {item}
          </li>
        ))}
      </ul>

      <button className="w-full bg-[#3E1747] text-white py-3 rounded-full hover:bg-[#4EDDE2] hover:text-[#3E1747] transition">
        View Full Details →
      </button>
    </div>
  );
}