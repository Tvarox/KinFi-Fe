"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useWalletAddress } from "@/lib/use-backend-query";
import PixelPromptButton from "../../components/PixelPromptButton";
import { shortenAddress } from "@/lib/format";

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
    } catch {
      flash("Copy failed. Select the address and copy it.");
    }
  };

  const handleShare = async () => {
    if (!address) return;
    try {
      await navigator.share({ title: "My Kenfi address", text: address });
    } catch {
      // The user closed the share sheet. Nothing to do.
    }
  };

  return (
    <section
      aria-label="Your address"
      className="anim-rise font-cormorant flex flex-col items-center gap-6 rounded-[22px] border border-white/[0.08] p-5 backdrop-blur-md sm:p-7"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.48)" }}
    >
      <div className="rounded-[20px] bg-white p-5" style={{ boxShadow: "0 0 40px rgba(255,161,90,0.12)" }}>
        {address ? (
          <QRCodeSVG value={address} size={240} bgColor="#ffffff" fgColor="#131416" />
        ) : (
          <div className="flex h-[240px] w-[240px] items-center justify-center text-center text-sm text-gray-500">
            {state.status === "creating-wallet" ? (
              <span className="flex flex-col items-center gap-3">
                <span
                  className="anim-spin h-7 w-7 rounded-full border-[3px]"
                  style={{ borderColor: "rgba(255,161,90,0.25)", borderTopColor: "#FFA15A" }}
                  aria-hidden="true"
                />
                Setting up your wallet...
              </span>
            ) : state.status === "error" ? (
              "Unavailable"
            ) : (
              <div className="skeleton h-full w-full" style={{ backgroundColor: "#e5e7eb", borderRadius: 8 }} aria-label="Loading address" role="status" />
            )}
          </div>
        )}
      </div>

      <div className="flex max-w-md flex-col items-center gap-2 text-center">
        <p className="text-lg text-gray-400">Your Solana address</p>
        <p className="break-all font-mono text-lg leading-relaxed text-white">{address ? shortenAddress(address, 6, 4) : "Unavailable"}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <PixelPromptButton
          size="md"
          showSuccessState
          disabled={!address}
          onClick={() => void handleCopy()}
          className="px-0 py-2.5"
        >
          Copy address
        </PixelPromptButton>

        {canShare && (
          <PixelPromptButton
            size="md"
            effectOnly
            showSuccessState={false}
            disabled={!address}
            onClick={() => void handleShare()}
            className="bg-[#1C1D21]/60 px-0 py-2.5"
          >
            Share
          </PixelPromptButton>
        )}
      </div>

      {feedback && (
        <p className="text-center text-sm text-gray-300" aria-live="polite">
          {feedback}
        </p>
      )}

      {state.status === "error" && (
        <div className="text-center text-sm text-red-400" role="alert">
          <p>{state.message}</p>
          <button type="button" onClick={refresh} className="mt-2 underline">
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
