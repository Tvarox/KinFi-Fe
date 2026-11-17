"use client";

import { useState } from "react";
import { shortenAddress } from "@/lib/format";

const CARD = { backgroundColor: "rgba(28, 29, 33, 0.48)" };
const SHELL = "anim-rise rounded-[22px] border border-white/[0.08] p-5 backdrop-blur-md";

/** The wallet address with a copy button, and the plain facts about the wallet. */
export default function WalletSummary({ address }: { address: string | null }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // The full address is on the Receive page if copying is blocked.
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <section aria-label="Your wallet" className={`${SHELL} flex flex-col gap-4`} style={CARD}>
        <h2 className="font-display text-[26px] text-white">Your wallet</h2>
        <div
          className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] py-2.5 pl-3.5 pr-2.5"
          style={{ backgroundColor: "rgba(19, 20, 22, 0.7)" }}
        >
          <span className="font-mono text-sm text-white" title={address ?? undefined}>
            {address ? shortenAddress(address, 6, 4) : "Loading..."}
          </span>
          <button
            type="button"
            onClick={() => void copy()}
            disabled={!address}
            aria-live="polite"
            className="rounded-[10px] border border-white/15 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:border-white/40 disabled:opacity-40"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </section>

      <section aria-label="Good to know" className={`${SHELL} flex flex-col gap-4`} style={CARD}>
        <h2 className="font-display text-[26px] text-white">Good to know</h2>
        <ul className="font-cormorant flex flex-col gap-3.5 text-[17px] leading-relaxed text-gray-300">
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-orange-400">●</span>
            No seed phrase. Your wallet is created and secured for you.
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-orange-400">●</span>
            Kenfi pays the network fee when you send.
          </li>
          <li className="flex gap-3">
            <span aria-hidden="true" className="text-orange-400">●</span>
            Sending limits apply to keep your money safe.
          </li>
        </ul>
      </section>
    </div>
  );
}
