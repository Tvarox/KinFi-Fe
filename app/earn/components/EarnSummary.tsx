type Props = {
  goesToEarning: number;
  staysSpendable: number;
  protocol: string;
  apy: number;
  estEarnings: number;
};

export default function EarnSummary({
  goesToEarning,
  staysSpendable,
  protocol,
  apy,
  estEarnings,
}: Props) {
  const rows = [
    { label: "Goes to earning",    value: `$${goesToEarning.toFixed(2)}`,  green: false },
    { label: "Stays spendable",    value: `$${staysSpendable.toFixed(2)}`, green: false },
    { label: "Protocol",           value: protocol,                        green: false },
    { label: "APY (illustrative)", value: `${apy}%`,                       green: false },
    { label: "Est. earnings / year", value: `+$${estEarnings.toFixed(2)}`, green: true  },
  ];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5 sticky top-6"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-base font-semibold text-white">Summary</h2>

      {/* Rows */}
      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-400">{r.label}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: r.green ? "#4ade80" : "#ffffff" }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10" />

      {/* Rule saved button */}
      <button
        className="w-full rounded-xl py-3 text-sm font-medium text-gray-500 transition-colors"
        style={{ backgroundColor: "#27272a" }}
        disabled
      >
        Rule saved
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 leading-relaxed">
        Saving changes how future deposits are split. Money already in your account stays where it is until you rebalance.
      </p>
    </div>
  );
}

