"use client";

import Link from "next/link";
import { useState } from "react";
import { formatUsdc, formatUsdcPrecise, shortenAddress } from "@/lib/format";
import { baseUnitsToAmountInput, checkSendInput, explorerTxUrl } from "@/lib/send";
import { useSend } from "@/lib/use-send";
import { useUsdcBalance } from "@/lib/use-backend-query";

const CARD = { backgroundColor: "#1C1D21" };
const FIELD = { backgroundColor: "#131416" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <span className="text-sm text-gray-400 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-white text-right break-all">{children}</span>
    </div>
  );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="rounded-xl px-6 py-3 text-sm font-semibold transition-opacity disabled:opacity-40"
      style={{ backgroundColor: "#FFA15A", color: "#131416" }}
    />
  );
}

function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/30 disabled:opacity-40"
    />
  );
}

export default function SendFlow() {
  const { state, prepare, confirm, back, reset } = useSend();
  const balance = useUsdcBalance();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const available = balance.state.status === "ready" ? balance.state.data.usdc : null;
  const check = checkSendInput({ to, amount, available });

  const startOver = () => {
    setTo("");
    setAmount("");
    reset();
    balance.refresh();
  };

  // ── Form ────────────────────────────────────────────────────────────────
  if (state.step === "form" || state.step === "preparing") {
    const busy = state.step === "preparing";
    return (
      <form
        className="rounded-2xl p-6 flex flex-col gap-6"
        style={CARD}
        onSubmit={(event) => {
          event.preventDefault();
          if (check.canSubmit && !busy) void prepare(to, amount.trim());
        }}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="send-to" className="text-xs text-gray-400">To</label>
          <input
            id="send-to"
            type="text"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            placeholder="Solana wallet address"
            autoComplete="off"
            spellCheck={false}
            disabled={busy}
            aria-invalid={check.addressError !== null}
            className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none font-mono"
            style={FIELD}
          />
          {check.addressError && <p className="text-xs text-red-400">{check.addressError}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="send-amount" className="text-xs text-gray-400">Amount</label>
            {available !== null && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setAmount(baseUnitsToAmountInput(available))}
                className="text-xs text-gray-300 underline disabled:opacity-40"
              >
                Max {formatUsdc(available)}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-xl px-5 py-5" style={FIELD}>
            <span className="text-3xl font-semibold text-gray-500">$</span>
            <input
              id="send-amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => {
                const cleaned = event.target.value.replace(/[^0-9.]/g, "");
                const firstDot = cleaned.indexOf(".");
                setAmount(
                  firstDot === -1
                    ? cleaned
                    : cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, ""),
                );
              }}
              placeholder="0.00"
              autoComplete="off"
              disabled={busy}
              aria-invalid={check.amountError !== null}
              className="bg-transparent text-3xl font-semibold text-white w-full outline-none placeholder-gray-500"
            />
          </div>
          {check.amountError && <p className="text-xs text-red-400">{check.amountError}</p>}
        </div>

        {state.step === "form" && state.error && (
          <p className="rounded-xl p-3 text-sm text-red-300" style={{ backgroundColor: "#7f1d1d33" }} role="alert">
            {state.error}
          </p>
        )}

        <PrimaryButton type="submit" disabled={!check.canSubmit || busy}>
          {busy ? "Checking..." : "Continue"}
        </PrimaryButton>
      </form>
    );
  }

  // ── Review ──────────────────────────────────────────────────────────────
  if (state.step === "review" || state.step === "signing") {
    const signing = state.step === "signing";
    const { prepared } = state;
    return (
      <div className="rounded-2xl p-6 flex flex-col gap-6" style={CARD}>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">You are sending</span>
          <span className="text-4xl font-bold text-white tracking-tight">
            {formatUsdcPrecise(prepared.amount)}
          </span>
          <span className="text-xs text-gray-400">USDC on Solana</span>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-5">
          <Row label="To"><span className="font-mono text-xs">{prepared.to_address}</span></Row>
          <Row label="Network fee">Paid by Kinfi</Row>
        </div>

        <p className="rounded-xl p-3 text-xs leading-relaxed text-amber-200" style={{ backgroundColor: "#451a0366" }}>
          Payments on Solana cannot be reversed. Check the address before you confirm.
        </p>

        <div className="flex flex-wrap gap-3">
          <PrimaryButton onClick={() => void confirm()} disabled={signing}>
            {signing ? "Waiting for confirmation..." : "Confirm and send"}
          </PrimaryButton>
          <SecondaryButton onClick={back} disabled={signing}>Back</SecondaryButton>
        </div>
      </div>
    );
  }

  // ── Pending ─────────────────────────────────────────────────────────────
  if (state.step === "pending") {
    return (
      <div className="rounded-2xl p-6 flex flex-col gap-5" style={CARD} aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 animate-pulse rounded-full" style={{ backgroundColor: "#FFA15A" }} />
          <h2 className="text-xl font-semibold text-white">Payment sent</h2>
        </div>
        <p className="text-sm text-gray-300">
          {formatUsdcPrecise(state.prepared.amount)} to {shortenAddress(state.prepared.to_address)} is waiting for
          Solana to confirm it. This usually takes a few seconds.
        </p>
        {state.note && <p className="text-sm text-amber-200">{state.note}</p>}
        <a href={explorerTxUrl(state.signature)} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 underline">
          View on Solana Explorer
        </a>
        <div className="flex flex-wrap gap-3">
          <Link href="/history" className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white">
            View history
          </Link>
        </div>
      </div>
    );
  }

  // ── Confirmed ───────────────────────────────────────────────────────────
  if (state.step === "confirmed") {
    return (
      <div className="rounded-2xl p-6 flex flex-col gap-5" style={CARD} aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: "#14532d", color: "#4ade80" }} aria-hidden="true">
            ✓
          </span>
          <h2 className="text-xl font-semibold text-white">Payment complete</h2>
        </div>
        <p className="text-sm text-gray-300">
          {formatUsdcPrecise(state.prepared.amount)} was sent to {shortenAddress(state.prepared.to_address)}.
        </p>
        <a href={explorerTxUrl(state.signature)} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 underline">
          View on Solana Explorer
        </a>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton onClick={startOver}>Send another</PrimaryButton>
          <Link href="/history" className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white">
            View history
          </Link>
        </div>
      </div>
    );
  }

  // ── Failed ──────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl p-6 flex flex-col gap-5" style={CARD} role="alert">
      <h2 className="text-xl font-semibold text-white">Payment not completed</h2>
      <p className="text-sm text-red-300">{state.message}</p>
      {state.signature && (
        <a href={explorerTxUrl(state.signature)} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 underline">
          View on Solana Explorer
        </a>
      )}
      <div className="flex flex-wrap gap-3">
        <PrimaryButton onClick={startOver}>Try again</PrimaryButton>
        <Link href="/history" className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white">
          View history
        </Link>
      </div>
    </div>
  );
}
