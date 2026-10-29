"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const ADDRESS = "0x4b2a7c9d51e08f3a62b4d7e19c0a5f8e6c9d91f3";

export default function ReceivePanel() {
  const [copied, setCopied] = useState(false);
  const [network, setNetwork] = useState<"Base" | "USDC">("Base");

  const handleCopy = () => {
    navigator.clipboard.writeText(ADDRESS);
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
        <QRCodeSVG value={ADDRESS} size={180} bgColor="#ffffff" fgColor="#000000" />
      </div>

      {/* Address info */}
      <div className="text-center flex flex-col gap-1">
        <p className="text-xs text-gray-400">Your Main account address on Base</p>
        <p className="text-xs font-mono text-gray-300 break-all">{ADDRESS}</p>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
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
    </div>
  );
}

