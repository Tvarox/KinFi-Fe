const details = [
  { label: "Network", value: "Solana" },
  { label: "Asset", value: "USDC" },
  { label: "Network fee", value: "Paid by Kinfi" },
  { label: "Speed", value: "A few seconds" },
];

export default function PaymentDetails() {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-5 self-start sticky top-6"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-base font-semibold text-white">Payment details</h2>

      <div className="flex flex-col gap-4">
        {details.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{d.label}</span>
            <span className="text-sm font-semibold text-white">{d.value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10" />

      <p className="text-xs text-gray-500 leading-relaxed">
        Sending limits apply. You can only send to a wallet that has already received USDC.
      </p>
    </div>
  );
}
