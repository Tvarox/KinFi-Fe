"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useWalletAddress } from "@/lib/use-backend-query";

export default function ReceivePanel() {
  const { state, refresh } = useWalletAddress();
  const [feedback, setFeedback] = useState<string | null>(null);

  const address = state.status === "ready" ? state.data.address : null;
  const canShare = typeof navigator !== "undefined" && "share" in navigator;

  const flash = (message: string) => {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      flash("Copied!");
    } catch {
      flash("Copy failed. Select the address and copy it.");
    }
  };

  const handleShare = async () => {
    if (!address) return;
    try {
      await navigator.share({ title: "My Kinfi address", text: address });
    } catch {
      // The user closed the share sheet. Nothing to do.
    }
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col items-center gap-6"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <span className="text-sm font-medium px-4 py-1.5 rounded-full" style={{ backgroundColor: "#FFA15A22", color: "#FFA15A", border: "1px solid #FFA15A55" }}>
        USDC on Solana
      </span>

      <div className="bg-white rounded-2xl p-5 shadow-lg">
        {address ? (
          <QRCodeSVG value={address} size={180} bgColor="#ffffff" fgColor="#000000" />
        ) : (
          <div className="flex h-[180px] w-[180px] items-center justify-center text-center text-sm text-gray-500">
            {state.status === "creating-wallet"
              ? "Setting up your wallet..."
              : state.status === "error"
                ? "Unavailable"
                : "Loading address..."}
          </div>
        )}
      </div>

      <div className="text-center flex flex-col gap-1">
        <p className="text-xs text-gray-400">Your Solana address</p>
        <p className="break-all font-mono text-xs text-gray-300">{address ?? "Unavailable"}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!address}
          className="flex items-center gap-2 text-sm font-semibold rounded-xl px-8 py-3 transition-colors disabled:opacity-50"
          style={{ backgroundColor: "#FFA15A", color: "#131416" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy address
        </button>

        {canShare && (
          <button
            type="button"
            onClick={handleShare}
            disabled={!address}
            className="text-sm font-semibold rounded-xl px-8 py-3 border border-white/15 text-white transition-colors hover:border-white/30 disabled:opacity-50"
          >
            Share
          </button>
        )}
      </div>

      <p className="min-h-5 text-center text-sm text-gray-300" aria-live="polite">
        {feedback}
      </p>

      {state.status === "error" && (
        <div className="text-center text-sm text-red-400">
          <p>{state.message}</p>
          <button type="button" onClick={refresh} className="mt-2 underline">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
