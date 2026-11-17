"use client";

import { useState } from "react";

const accounts = [
  {
    initials: "MA",
    name: "Main account",
    address: "0x4b2a...91f3",
    balance: "$1,842.60",
    active: true,
  },
  {
    initials: "S",
    name: "Savings",
    address: "0x91a3...c2d0",
    balance: "$0.00",
    active: false,
  },
];

export default function AccountsCard() {
  const [selected, setSelected] = useState(0);

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ backgroundColor: "#1C1D21" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-normal">Accounts</h2>
          <p className="text-xs text-gray-400 mt-0.5">Each account has its own address, balance and earn rule.</p>
        </div>
        <button
          className="flex items-center gap-1.5 text-xs font-medium text-white border border-white/20 rounded-lg px-3 py-2 hover:border-white/40 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add account
        </button>
      </div>

      {/* Account rows */}
      <div className="flex flex-col gap-3">
        {accounts.map((acc, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className="flex items-center gap-3 w-full rounded-xl px-4 py-3.5 text-left transition-colors"
              style={{
                backgroundColor: "#131416",
                border: isSelected ? "1px solid #FFA15A" : "1px solid transparent",
              }}
            >
              {/* Radio */}
              <div
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: isSelected ? "#FFA15A" : "#6b7280" }}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FFA15A" }} />
                )}
              </div>

              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: isSelected ? "#FFA15A33" : "#374151", color: isSelected ? "#FFA15A" : "#9ca3af" }}
              >
                {acc.initials}
              </div>

              {/* Name + address */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{acc.name}</span>
                  {acc.active && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: "#FFA15A22", color: "#FFA15A" }}
                    >
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{acc.address}</p>
              </div>

              {/* Balance */}
              <span className="text-sm font-semibold text-white">{acc.balance}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
