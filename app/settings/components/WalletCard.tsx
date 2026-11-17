"use client";

import { useState, useRef, useCallback } from "react";
import { useWalletAddress } from "@/lib/use-backend-query";
import LoadingText from "../../components/LoadingText";

export default function WalletCard() {
  const { state, refresh } = useWalletAddress();
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleIdRef = useRef(0);

  const address = state.status === "ready" ? state.data.address : null;

  const copy = useCallback(
    (e?: React.MouseEvent) => {
      if (!address) return;
      try {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        // Create ripple at click position
        if (e) {
          const rect = e.currentTarget.getBoundingClientRect();
          const id = rippleIdRef.current++;
          setRipples((prev) => [
            ...prev,
            { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
          ]);
          setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
          }, 600);
        }
      } catch {
        // The address is on screen and can be selected and copied by hand.
      }
    },
    [address],
  );

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
          <dt className="text-lg text-white">Network</dt>
          <dd className="m-0 text-lg font-medium text-white">Solana · USDC</dd>
        </div>

        <div className={row}>
          <dt className="shrink-0 text-lg text-white">Address</dt>
          <dd className="m-0 flex min-w-0 items-center gap-3">
            {state.status === "ready" ? (
              <>
                <button
                  type="button"
                  onClick={copy}
                  aria-live="polite"
                  className="min-w-[80px] text-center shrink-0 rounded-[10px] border border-white/15 px-3.5 py-2 text-base font-medium text-white transition-colors hover:border-white/40 relative overflow-hidden"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                >
                  {ripples.map((ripple) => (
                    <div
                      key={ripple.id}
                      className="absolute pointer-events-none"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        backgroundColor: copied ? "#22c55e" : "#FFA15A",
                        boxShadow: `0 0 16px ${copied ? "rgba(34, 197, 94, 0.6)" : "rgba(255, 161, 85, 0.6)"}`,
                        transform: "translate(-50%, -50%) scale(0)",
                        animation: "ripple 0.6s ease-out forwards",
                      }}
                    />
                  ))}
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
              <LoadingText
                className="text-lg text-gray-400"
                text={state.status === "creating-wallet" ? "Setting up your wallet" : "Loading"}
              />
            )}
          </dd>
        </div>

        <div className={`${row} border-b`}>
          <dt className="text-lg text-white">Seed phrase</dt>
          <dd className="m-0 text-lg font-medium text-white">None to store</dd>
        </div>
      </dl>

      <p className="text-lg leading-relaxed text-gray-400">
        Your wallet is created and secured for you. Sign in with the same account on any device to use it.
      </p>
    </section>
  );
}
