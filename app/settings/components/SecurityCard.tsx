export default function SecurityCard() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <div>
        <h2 className="text-xl font-semibold text-white">Security</h2>
        <p className="text-xs text-gray-400 mt-0.5">For Main account</p>
      </div>

      {/* Export private key */}
      <button
        className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white rounded-xl py-3 border border-white/20 hover:border-white/40 transition-colors"
        style={{ backgroundColor: "transparent" }}
      >
        {/* Key icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="7.5" cy="15.5" r="5.5" />
          <path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" />
        </svg>
        Export private key
      </button>

      {/* Sign out */}
      <button
        className="w-full flex items-center justify-center gap-2 text-sm font-medium rounded-xl py-3 border transition-colors hover:bg-red-950/30"
        style={{ color: "#ef4444", borderColor: "#ef444466", backgroundColor: "transparent" }}
      >
        {/* Arrow-right-from-bracket icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign out
      </button>
    </div>
  );
}

