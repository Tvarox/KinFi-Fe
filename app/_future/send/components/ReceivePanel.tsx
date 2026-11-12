"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/lib/use-auth";

export default function ReceivePanel() {
  const { authenticated, ready, callBackend } = useAuth();
  const [address, setAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [network, setNetwork] = useState<"Base" | "USDC">("Base");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !authenticated) return;

    let cancelled = false;
    callBackend("/wallet/address")
      .then((response) => {
        if (cancelled) return;
        if (response.success && response.data?.smart_vault_address) {
          setAddress(response.data.smart_vault_address);
        } else {
          setError(response.error?.message || "Unable to load your receive address");
        }
      })
      .catch((requestError: Error) => {
        if (!cancelled) setError(requestError.message || "Unable to load your receive address");
      });

    return () => {
      cancelled = true;
    };
  }, [authenticated, callBackend, ready]);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col items-center gap-6"
      style={{ backgroundColor: "#1C1D21" }}
    >
      {/* Network pills */}
      <div className="flex items-center gap-2">
        {(["Base", "USDC"] as const).map((n) => (
          <button
            key={n}
            onClick={() => setNetwork(n)}
            className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: network === n ? "#FFA15A22" : "#131416",
              color:           network === n ? "#FFA15A"   : "#9ca3af",
              border:          network === n ? "1px solid #FFA15A55" : "1px solid transparent",
            }}
          >
            {n}
          </button>
        ))}
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-2xl p-5 shadow-lg">
        {address ? (
          <QRCodeSVG value={address} size={180} bgColor="#ffffff" fgColor="#000000" />
        ) : (
          <div className="flex h-[180px] w-[180px] items-center justify-center text-center text-sm text-gray-500">
            {ready ? "Loading address..." : "Loading auth..."}
          </div>
        )}
      </div>

      {/* Address info */}
      <div className="text-center flex flex-col gap-1">
        <p className="text-xs text-gray-400">Your Main account address on Base</p>
        <p className="break-all font-mono text-xs text-gray-300">{address ?? "Unavailable"}</p>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        disabled={!address}
        className="flex items-center gap-2 text-sm font-semibold rounded-xl px-8 py-3 transition-colors"
        style={{ backgroundColor: "#FFA15A", color: "#131416" }}
      >
        {/* Copy icon */}
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        {copied ? "Copied!" : "Copy address"}
      </button>
      {error && <p className="text-center text-sm text-red-400">{error}</p>}
    </div>
  );
}
