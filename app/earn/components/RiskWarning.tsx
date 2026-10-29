export default function RiskWarning() {
  return (
    <div
      className="flex gap-3 rounded-2xl p-5"
      style={{ backgroundColor: "#451a0344", border: "1px solid #92400e55" }}
    >
      <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
      <p className="text-xs text-gray-300 leading-relaxed">
        <span className="font-bold text-white">Earning carries risk.</span>{" "}
        Rates are variable and are not guaranteed. Funds placed in lending protocols can lose value from smart contract bugs, market events or a protocol failing. Earning is not a bank deposit and is not insured.{" "}
        <span className="font-bold text-white">Only put in what you can afford to have locked up.</span>
      </p>
    </div>
  );
}

