"use client";

import { useAccountSetupStatus } from "@/components/AccountSetup";

const tips = [
  { strong: "Only send USDC on the Solana network", rest: " to this address." },
  { strong: "Other coins, or USDC on another network,", rest: " may be lost for good." },
  { strong: "Incoming payments", rest: " appear in History once Solana confirms them." },
];

export default function ReceiveWarning() {
  // Normally Kenfi sets up the USDC account itself, so a first deposit just
  // works. Only if that could not be done do we warn about the sender's cost.
  const setup = useAccountSetupStatus();

  return (
    <aside
      aria-label="Receive safely"
      className="anim-rise flex flex-col gap-4 self-start rounded-[22px] border border-white/[0.08] p-6 backdrop-blur-md lg:sticky lg:top-6"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.62)" }}
    >
      <h2 className="font-display text-[26px] text-white">Receive safely</h2>

      <ul className="flex flex-col gap-3.5 text-sm leading-relaxed text-gray-300">
        {tips.map((tip) => (
          <li key={tip.strong} className="flex gap-3">
            <span aria-hidden="true" className="text-orange-400">●</span>
            <span>
              <span className="font-semibold text-white">{tip.strong}</span>
              {tip.rest}
            </span>
          </li>
        ))}

        {setup === "unavailable" && (
          <li className="flex gap-3" data-testid="first-deposit-note">
            <span aria-hidden="true" className="text-orange-400">●</span>
            <span>
              <span className="font-semibold text-white">First time receiving USDC?</span>
              {" "}The sender&apos;s wallet pays a one-time account deposit of about 0.0015 SOL. If it holds
              less SOL than that, the payment fails and the sender only loses a tiny network fee.
            </span>
          </li>
        )}
      </ul>

      <p className="text-xs leading-relaxed text-gray-400">
        Payments on Solana are public. Anyone can see this address&apos;s activity.
      </p>
    </aside>
  );
}
