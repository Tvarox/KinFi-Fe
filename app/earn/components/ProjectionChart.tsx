type Props = { principal: number; apy: number };

function compound(principal: number, apy: number, years: number) {
  return principal * (Math.pow(1 + apy / 100, years) - 1);
}

export default function ProjectionChart({ principal, apy }: Props) {
  const y1 = compound(principal, apy, 1);
  const y3 = compound(principal, apy, 3);
  const y5 = compound(principal, apy, 5);
  const max = y5 || 1;

  const rows = [
    { label: "1 year",  value: y1 },
    { label: "3 years", value: y3 },
    { label: "5 years", value: y5 },
  ];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5"
      style={{ backgroundColor: "#1C1D21" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">If rates stay the same</h2>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: "#27272a", color: "#9ca3af" }}
        >
          Estimate
        </span>
      </div>

      {/* Bar rows */}
      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-4">
            <span className="text-xs text-gray-400 w-14 shrink-0">{r.label}</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#374151" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(r.value / max) * 100}%`,
                  backgroundColor: "#FFA15A",
                }}
              />
            </div>
            <span className="text-sm font-semibold w-20 text-right" style={{ color: "#4ade80" }}>
              {r.value > 0 ? `+$${r.value.toFixed(2)}` : "—"}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        Based on ${principal.toFixed(2)} earning at {apy}% APY, compounded yearly. Real rates change and can drop to zero.
      </p>
    </div>
  );
}

