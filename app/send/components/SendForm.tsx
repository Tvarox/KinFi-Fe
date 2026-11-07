"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/use-auth";

const recents = [
  { initials: "PS", name: "Priya",  bg: "#6b21a8" },
  { initials: "DK", name: "Daniel", bg: "#1e3a5f" },
  { initials: "AV", name: "Arjun",  bg: "#14532d" },
];

type Props = { amount: string; setAmount: (v: string) => void };

export default function SendForm({ amount, setAmount }: Props) {
  const { authenticated, ready, callBackend } = useAuth();
  const [to, setTo] = useState("");
  const [available, setAvailable] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !authenticated) return;

    let cancelled = false;
    setIsLoadingBalance(true);
    callBackend("/wallet/balances")
      .then((response) => {
        if (cancelled) return;
        if (response.success && response.data?.embedded !== undefined) {
          setAvailable(Number(BigInt(response.data.embedded)) / 1e6);
        } else {
          setError(response.error?.message || "Unable to load available balance");
        }
      })
      .catch((requestError: Error) => {
        if (!cancelled) setError(requestError.message || "Unable to load available balance");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBalance(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authenticated, callBackend, ready]);

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    if (/^\d*(\.\d{0,6})?$/.test(raw)) setAmount(raw);
  };

  const handleSend = async () => {
    setError(null);
    setMessage(null);

    const parsedAmount = Number(amount);
    if (!to.trim() || !/^0x[a-fA-F0-9]{40}$/.test(to.trim())) {
      setError("Enter a valid Base wallet address.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (available !== null && parsedAmount > available) {
      setError("Amount exceeds your available balance.");
      return;
    }

    setIsSending(true);
    try {
      const response = await callBackend("/wallet/send", {
        method: "POST",
        body: { to_address: to.trim(), amount: amount.trim() },
      });
      if (!response.success) {
        throw new Error(response.error?.message || "Transfer failed");
      }
      setMessage(response.data?.message || "Transfer submitted successfully.");
      setAmount("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Transfer failed");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-6"
      style={{ backgroundColor: "#1C1D21" }}
    >
      {/* To field */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400">To</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="@username or 0x... address"
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none"
          style={{ backgroundColor: "#131416" }}
        />
      </div>

      {/* Recent contacts */}
      <div className="flex flex-col gap-3">
        <span className="text-xs text-gray-400">Recent</span>
        <div className="flex items-center gap-2">
          {recents.map((r) => (
            <button
              key={r.name}
              onClick={() => setTo(`@${r.name.toLowerCase()}`)}
              className="flex items-center gap-2 rounded-full px-3 py-1.5 border border-white/10 hover:border-white/25 transition-colors"
              style={{ backgroundColor: "#131416" }}
            >
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: r.bg }}
              >
                {r.initials}
              </span>
              <span className="text-sm text-white">{r.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-gray-400">Amount</span>
        <div
          className="flex items-center justify-between rounded-xl px-5 py-5"
          style={{ backgroundColor: "#131416" }}
        >
          <div className="flex items-center gap-1 flex-1">
            <span className="text-3xl font-semibold text-gray-500">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmount}
              placeholder="0"
              className="bg-transparent text-3xl font-semibold text-white w-full outline-none placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-3 ml-4">
            <span className="text-sm text-gray-400">USDC</span>
            <button
              onClick={() => setAmount(available?.toFixed(6).replace(/\.?0+$/, "") ?? "")}
              className="text-xs font-semibold text-white border border-white/25 rounded-lg px-3 py-1.5 hover:border-white/50 transition-colors"
            >
              Max
            </button>
          </div>
        </div>

        {/* Available + fee */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-400">
            Available{" "}
            <span className="text-white font-medium">
              {isLoadingBalance ? "Loading..." : available === null ? "Unavailable" : `$${available.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}
            </span>
          </span>
          <span className="text-xs text-gray-400">
            Network fee <span className="text-white font-medium">$0.01</span> on Base
          </span>
        </div>
      </div>

      {/* Warning */}
      <div
        className="flex gap-3 rounded-xl p-4"
        style={{ backgroundColor: "#451a0388", borderLeft: "3px solid #92400e" }}
      >
        <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
        <p className="text-xs text-gray-300 leading-relaxed">
          Only send <span className="font-bold text-white">USDC on Base</span>. Other assets, or USDC on another network such as Ethereum or Solana, can be lost for good.
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-green-400">{message}</p>}

      <button
        onClick={handleSend}
        disabled={!ready || !authenticated || isSending || isLoadingBalance}
        className="w-full rounded-xl py-4 text-sm font-semibold transition-colors"
        style={{ backgroundColor: "#FFA15A", color: "#131416", opacity: isSending ? 0.6 : 1 }}
      >
        {isSending ? "Sending..." : "Send USDC"}
      </button>
    </div>
  );
}
