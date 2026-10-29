// Icons
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <path d="M1 10h22" />
    </svg>
  );
}
function BankIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22h18M3 10h18M5 10V6M8 10V6m3 4V6m3 4V6m3 4V6M12 2 2 6h20L12 2zM5 22v-4m3 4v-4m3 4v-4m3 4v-4m3 4v-4" />
    </svg>
  );
}

type Method = { id: string; label: string; sub: string; icon: React.ReactNode };

const methods: Method[] = [
  { id: "apple",  label: "Apple Pay",          sub: "Instant",               icon: <PhoneIcon /> },
  { id: "google", label: "Google Pay",          sub: "Instant",               icon: <PhoneIcon /> },
  { id: "card",   label: "Debit or credit card", sub: "Instant",              icon: <CardIcon />  },
  { id: "bank",   label: "Bank transfer",        sub: "Takes 1–3 business days", icon: <BankIcon />  },
];

type Props = { selected: string; setSelected: (id: string) => void };

export default function PayWith({ selected, setSelected }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-white">Pay with</h2>

      <div className="flex flex-col gap-2">
        {methods.map((m) => {
          const isActive = selected === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelected(m.id)}
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

              {/* Method icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-gray-300"
                style={{ backgroundColor: "#27272a" }}
              >
                {m.icon}
              </div>

              {/* Label */}
              <div>
                <p className="text-sm font-semibold text-white">{m.label}</p>
                <p className="text-xs text-gray-400">{m.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-600 mt-1 px-1">
        Kinfi demo. No real money moves here: payments, transfers and deposits are simulated.
      </p>
    </div>
  );
}

