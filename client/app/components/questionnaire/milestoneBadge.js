export default function MilestoneBadge({ text }) {
  if (!text) return null;

  return (
    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#4EDDE2]/20 bg-[linear-gradient(135deg,rgba(78,221,226,0.12),rgba(62,23,71,0.06))] px-4 py-2.5 text-xs md:text-sm text-[#3E1747] shadow-[0_10px_30px_rgba(78,221,226,0.08)] backdrop-blur-sm">
      <span className="w-2 h-2 rounded-full bg-[#4EDDE2]" />
      {text}
    </div>
  );
}