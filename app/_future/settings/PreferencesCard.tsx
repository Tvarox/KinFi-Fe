"use client";

import { useState } from "react";

export default function PreferencesCard() {
  const [hideBalances, setHideBalances] = useState(false);

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-6"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-2xl font-semibold text-white tracking-normal">Preferences</h2>

      {/* Hide balances row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">Hide balances</p>
          <p className="text-xs text-gray-400 mt-0.5">Replace amounts with dots on screen</p>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setHideBalances((v) => !v)}
          className="relative inline-flex shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
          style={{ backgroundColor: hideBalances ? "#FFA15A" : "#374151" }}
        >
          <span
            className="inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5"
            style={{ transform: hideBalances ? "translateX(22px)" : "translateX(2px)" }}
          />
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Display currency */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-white">Display currency</p>
        <div
          className="flex items-center justify-between rounded-lg px-4 py-3 text-sm text-white"
          style={{ backgroundColor: "#131416" }}
        >
          <span>USD · US dollar</span>
          {/* Chevron */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          Changes how balances are shown, using rough illustrative rates. Deposits and transfers are always in USD and USDC.
        </p>
      </div>
    </div>
  );
}
