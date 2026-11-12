"use client";

import { useWalletAddress } from "@/lib/use-backend-query";

export default function WalletCard() {
  const { state, refresh } = useWalletAddress();

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-2xl font-semibold text-white tracking-normal">Wallet</h2>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Network</span>
        <span className="text-sm text-white">Solana · USDC</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Address</span>
        {state.status === "ready" ? (
          <span className="break-all font-mono text-xs text-gray-200">
            {state.data.address}
          </span>
        ) : state.status === "error" ? (
          <span className="text-sm text-red-400">
            {state.message}{" "}
            <button type="button" onClick={refresh} className="underline">
              Try again
            </button>
          </span>
        ) : (
          <span className="text-sm text-gray-400">
            {state.status === "creating-wallet" ? "Setting up your wallet..." : "Loading..."}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        Your wallet is created and secured for you. There is no seed phrase to store.
      </p>
    </div>
  );
}
