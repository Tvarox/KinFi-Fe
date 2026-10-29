const positions = [
  {
    id: "Aave",
    avatarBg: "#6d28d9", avatarColor: "#c4b5fd",
    balance: 100.00, earned: 4.44, apy: 3.9, share: 27,
  },
  {
    id: "Morpho",
    avatarBg: "#1e40af", avatarColor: "#93c5fd",
    balance: 268.52, earned: 8.03, apy: 5.2, share: 73,
  },
];

export default function YourPositions() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: "#1C1D21" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Your positions</h2>
        <span className="text-xs text-gray-400">
          Lifetime earned{" "}
          <span className="font-semibold" style={{ color: "#4ade80" }}>$12.47</span>
        </span>
      </div>

      {/* Positions */}
      <div className="flex flex-col divide-y divide-white/10">
        {positions.map((pos) => (
          <div key={pos.id} className="flex items-center gap-4 py-4">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
              style={{ backgroundColor: pos.avatarBg, color: pos.avatarColor }}
            >
              {pos.id[0]}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{pos.id}</p>
              <p className="text-xs text-gray-400">
                {pos.apy}% APY · earned ${pos.earned.toFixed(2)} · {pos.share}% of earning
              </p>
            </div>

            {/* Balance */}
            <span className="text-sm font-semibold text-white mr-3">
              ${pos.balance.toFixed(2)}
            </span>

            {/* Withdraw */}
            <button
              className="text-xs font-medium text-white border border-white/20 rounded-lg px-4 py-2 hover:border-white/40 transition-colors"
            >
              Withdraw
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

