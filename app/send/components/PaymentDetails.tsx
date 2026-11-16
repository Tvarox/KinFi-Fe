const tips = [
  "Sending limits apply to keep your money safe.",
  "The other wallet must already hold USDC. If it does not, we tell you before anything is sent.",
  "A payment is only marked complete after Solana confirms it.",
];

export default function PaymentDetails() {
  return (
    <aside
      aria-label="Before you send"
      className="anim-rise flex flex-col gap-4 self-start rounded-[22px] border border-white/[0.08] p-6 backdrop-blur-md lg:sticky lg:top-6"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.62)" }}
    >
      <h2 className="font-display text-[26px] text-white">Before you send</h2>
      <ul className="flex flex-col gap-3.5 text-sm leading-relaxed text-gray-300">
        {tips.map((tip) => (
          <li key={tip} className="flex gap-3">
            <span aria-hidden="true" className="text-orange-400">●</span>
            {tip}
          </li>
        ))}
      </ul>
    </aside>
  );
}
