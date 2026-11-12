export default function ReceiveWarning() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 self-start sticky top-6"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-base font-semibold text-white">Before you share it</h2>

      <div
        className="flex gap-3 rounded-xl p-4"
        style={{ backgroundColor: "#451a0366", border: "1px solid #92400e55" }}
      >
        <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
        <p className="text-xs text-gray-300 leading-relaxed">
          Only send <span className="font-bold text-white">USDC on the Solana network</span> to
          this address. Other tokens, or another network, may be lost for good.
        </p>
      </div>

      <div className="flex gap-3 rounded-xl p-4" style={{ backgroundColor: "#131416" }}>
        <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <p className="text-xs text-gray-400 leading-relaxed">
          Payments on Solana are public. Anyone can see this address&apos;s activity.
        </p>
      </div>
    </div>
  );
}
