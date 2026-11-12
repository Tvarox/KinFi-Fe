const FEE_RATE = 0.035;

function fmt(n: number) {
  return n > 0 ? `$${n.toFixed(2)}` : "—";
}

type Props = { amount: number };

export default function Summary({ amount }: Props) {
  const fee       = amount * FEE_RATE;
  const youGet    = amount - fee;
  const toMorpho  = youGet * 0.2;
  const spendable = youGet * 0.8;

  const rows = [
    { label: "You pay",                value: fmt(amount),    accent: false },
    { label: "Fee (3.5%, illustrative)", value: fmt(fee),     accent: false },
    { label: "You get",                value: fmt(youGet),    accent: true  },
  ];

  const earnRows = [
    { label: "20% to Morpho",   value: fmt(toMorpho)  },
    { label: "Stays spendable", value: fmt(spendable) },
  ];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-lg font-semibold text-white tracking-normal">Summary</h2>

      {/* Main rows */}
      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-300 flex items-center gap-1">
              {r.label}
              {r.accent && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block ml-0.5" />
              )}
            </span>
            <span className="text-sm font-medium text-gray-400">{r.value}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Auto-earn preview */}
      <div className="flex flex-col gap-3">
        <p className="text-xs text-gray-500">Auto-earn preview</p>
        {earnRows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{r.label}</span>
            <span className="text-sm font-medium text-gray-400">{r.value}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer box */}
      <div
        className="flex gap-3 rounded-xl p-4"
        style={{ backgroundColor: "#131416" }}
      >
        {/* Info icon */}
        <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="font-semibold text-white">Simulated payment.</span>{" "}
          No card, wallet or bank is charged and no real USDC is bought.
        </p>
      </div>

      {/* Pay button */}
      <button
        disabled={amount <= 0}
        className="w-full rounded-xl py-3.5 text-sm font-semibold transition-colors"
        style={{
          backgroundColor: amount > 0 ? "#FFA15A" : "#27272a",
          color:           amount > 0 ? "#131416" : "#6b7280",
          cursor:          amount > 0 ? "pointer"  : "default",
        }}
      >
        Pay (simulated)
      </button>
    </div>
  );
}
