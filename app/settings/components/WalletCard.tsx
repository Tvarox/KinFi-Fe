"use client";

import { useState } from "react";
import { useWalletAddress } from "@/lib/use-backend-query";

export default function WalletCard() {
  const { state, refresh } = useWalletAddress();
  const [copied, setCopied] = useState(false);

  const address = state.status === "ready" ? state.data.address : null;

  const copy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // The address is on screen and can be selected and copied by hand.
    }
  };

  const row = "flex items-center justify-between gap-6 border-t border-white/[0.07] py-3";

  return (
    <section
      aria-label="Wallet"
      className="anim-rise font-cormorant flex flex-col gap-3.5 rounded-[22px] border border-white/[0.08] p-5 backdrop-blur-md"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.48)" }}
    >
      <h2 className="font-cinzel text-[24px] text-white">Wallet</h2>

      <dl className="m-0 flex flex-col">
        <div className={row}>
          <dt className="text-lg text-gray-400">Network</dt>
          <dd className="m-0 text-lg font-medium text-white">Solana · USDC</dd>
        </div>

        <div className={row}>
          <dt className="shrink-0 text-lg text-gray-400">Address</dt>
          <dd className="m-0 flex min-w-0 items-center gap-3">
            {state.status === "ready" ? (
              <>
                <span className="break-all text-right font-mono text-lg text-gray-200">{state.data.address}</span>
                <button
                  type="button"
                  onClick={() => void copy()}
                  aria-live="polite"
                  className="shrink-0 rounded-[10px] border border-white/15 px-3.5 py-2 text-base font-medium text-white transition-colors hover:border-white/40"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </>
            ) : state.status === "error" ? (
              <span className="text-lg text-red-400" role="alert">
                {state.message}{" "}
                <button type="button" onClick={refresh} className="underline">
                  Try again
                </button>
              </span>
            ) : (
              <span className="text-lg text-gray-400">
                {state.status === "creating-wallet" ? "Setting up your wallet..." : "Loading..."}
              </span>
            )}
          </dd>
        </div>

        <div className={`${row} border-b`}>
          <dt className="text-lg text-gray-400">Seed phrase</dt>
          <dd className="m-0 text-lg font-medium text-white">None to store</dd>
        </div>
      </dl>

      <p className="text-lg leading-relaxed text-gray-400">
        Your wallet is created and secured for you. Sign in with the same account on any device to use it.
      </p>
    </section>
  );
}
