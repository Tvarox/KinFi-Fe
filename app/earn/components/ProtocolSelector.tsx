const protocols = [
  { id: "Aave",   label: "Aave",   sub: "Large lending market",  apy: 3.9, avatarBg: "#6d28d9", avatarColor: "#c4b5fd" },
  { id: "Morpho", label: "Morpho", sub: "Curated lending vaults", apy: 5.2, avatarBg: "#1e40af", avatarColor: "#93c5fd" },
  { id: "Yo",     label: "Yo",     sub: "Multi-chain yield vault", apy: 4.3, avatarBg: "#854d0e", avatarColor: "#fde68a",
    badge: "Newer" },
];

type Props = { protocol: string; setProtocol: (id: string) => void };

export default function ProtocolSelector({ protocol, setProtocol }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-white tracking-normal">Where should it earn?</h2>

      <div className="flex flex-col gap-2">
        {protocols.map((p) => {
          const isActive = protocol === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setProtocol(p.id)}
              className="flex items-center gap-4 w-full rounded-2xl px-5 py-4 text-left transition-colors"
              style={{
                backgroundColor: "#1C1D21",
                border: isActive ? "1px solid #FFA15A" : "1px solid transparent",
              }}
            >
              {/* Radio */}
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: isActive ? "#FFA15A" : "#6b7280" }}
              >
                {isActive && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FFA15A" }} />
                )}
              </div>

              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                style={{ backgroundColor: p.avatarBg, color: p.avatarColor }}
              >
                {p.id[0]}
              </div>

              {/* Name + sub */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{p.label}</span>
                  {p.badge && (
                    <span className="text-[10px] text-gray-400 font-medium">{p.badge}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{p.sub}</p>
              </div>

              {/* APY */}
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{p.apy}%</p>
                <p className="text-xs text-gray-500">APY, illustrative</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
