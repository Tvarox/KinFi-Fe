const tips = [
  "Sending limits apply to keep your money safe.",
  "The other wallet must already hold USDC. If it does not, we tell you before anything is sent.",
  "A payment is only marked complete after Solana confirms it.",
];

export default function PaymentDetails() {
  return (
    <aside
      aria-label="Before you send"
      className="anim-rise flex flex-col gap-4 self-start rounded-[22px] border border-white/[0.08] p-5 backdrop-blur-md max-sm:gap-2.5 max-sm:p-3.5 lg:sticky lg:top-6"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.48)" }}
    >
      <h2 className="font-cinzel text-[24px] text-white max-sm:text-xl">Before you send</h2>
      <ul className="font-cormorant flex flex-col gap-3.5 text-[17px] leading-relaxed text-gray-300 max-sm:gap-2 max-sm:text-[15px]">
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
