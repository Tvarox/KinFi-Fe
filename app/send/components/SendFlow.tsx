"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatUsdc, formatUsdcPrecise, shortenAddress } from "@/lib/format";
import { amountToBaseUnits, baseUnitsToAmountInput, checkSendInput, explorerTxUrl } from "@/lib/send";
import { useSend } from "@/lib/use-send";
import { useUsdcBalance } from "@/lib/use-backend-query";
import LoadingText from "../../components/LoadingText";
import PixelPromptButton from "../../components/PixelPromptButton";

const CARD = { backgroundColor: "rgba(28, 29, 33, 0.48)" };
const FIELD = { backgroundColor: "rgba(19, 20, 22, 0.7)" };
const SHELL = "anim-rise rounded-[22px] border border-white/[0.08] backdrop-blur-md";
const QUICK_AMOUNTS = [5, 10, 25, 50];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-t border-white/[0.07] py-4 first:border-t-0">
      <dt className="shrink-0 text-sm text-gray-400">{label}</dt>
      <dd className="m-0 break-all text-right text-sm font-medium text-white">{children}</dd>
    </div>
  );
}

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const items = ["Details", "Review", "Confirmation"];
  return (
    <ol aria-label="Progress" className="flex flex-wrap items-center gap-2.5 text-[13px]">
      {items.map((label, index) => {
        const number = index + 1;
        const done = number < current;
        const active = number === current;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className={`flex items-center gap-2 ${active ? "font-medium text-white" : "text-gray-400"}`}
          >
            <span
              aria-hidden="true"
              className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs"
              style={
                done
                  ? { backgroundColor: "rgba(95,211,154,0.16)", color: "#6EE0A8" }
                  : active
                    ? { backgroundColor: "#FFA15A", color: "#131416", fontWeight: 600 }
                    : { border: "1px solid rgba(255,255,255,0.2)" }
              }
            >
              {done ? "✓" : number}
            </span>
            {label}
            {number < 3 && <span aria-hidden="true" className="ml-1.5 h-px w-7 bg-white/20" />}
          </li>
        );
      })}
    </ol>
  );
}

function ResultLinks({ signature }: { signature: string | null }) {
  if (!signature) return null;
  return (
    <a
      href={explorerTxUrl(signature)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-orange-400 underline hover:text-orange-300"
    >
      View on Solana Explorer
    </a>
  );
}

function HistoryLink() {
  return (
    <Link
      href="/history"
      className="inline-flex items-center justify-center rounded-[14px] border border-white/15 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/40"
    >
      View history
    </Link>
  );
}

export default function SendFlow() {
  const { state, prepare, confirm, back, reset } = useSend();
  const balance = useUsdcBalance();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const animationFrame = useRef<number | null>(null);

  const available = balance.state.status === "ready" ? balance.state.data.usdc : null;
  const check = checkSendInput({ to, amount, available });
  const addressLooksValid = to.trim() !== "" && check.addressError === null;

  const startOver = () => {
    setTo("");
    setAmount("");
    reset();
    balance.refresh();
  };

  useEffect(() => {
    return () => {
      if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  const animateAmount = (value: number) => {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);

    const startedAt = Date.now();
    const duration = 500;
    const update = () => {
      const progress = Math.min((Date.now() - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setAmount((value * eased).toFixed(2));
      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(update);
      } else {
        animationFrame.current = null;
        setAmount(String(value));
      }
    };
    animationFrame.current = requestAnimationFrame(update);
  };

  // ── Form ────────────────────────────────────────────────────────────────
  if (state.step === "form" || state.step === "preparing") {
    const busy = state.step === "preparing";
    return (
      <form
        className={`${SHELL} font-cormorant flex flex-col gap-5 p-4 max-sm:gap-3 max-sm:p-3 sm:p-6`}
        style={CARD}
        onSubmit={(event) => {
          event.preventDefault();
          if (check.canSubmit && !busy) void prepare(to, amount.trim());
        }}
      >
        <div className="flex flex-col items-center gap-3.5 text-center max-sm:gap-2">
          <label htmlFor="send-amount" className="text-sm text-gray-400">Amount</label>
          <div className="flex items-center justify-center">
            <span aria-hidden="true" className="-mr-4 font-cinzel text-7xl leading-none text-gray-400 max-sm:-mr-3 max-sm:text-6xl sm:text-[104px]">$</span>
            <input
              id="send-amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => {
                if (animationFrame.current !== null) {
                  cancelAnimationFrame(animationFrame.current);
                  animationFrame.current = null;
                }
                const cleaned = event.target.value.replace(/[^0-9.]/g, "");
                const firstDot = cleaned.indexOf(".");
                const normalized =
                  firstDot === -1
                    ? cleaned
                    : cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, "");
                const [whole, fraction] = normalized.split(".");
                setAmount(fraction === undefined ? whole : `${whole}.${fraction.slice(0, 5)}`);
              }}
              placeholder="0.00"
              autoComplete="off"
              disabled={busy}
              aria-invalid={check.amountError !== null}
              className="send-amount-input flex-none font-cinzel bg-transparent text-center text-7xl leading-none text-white outline-none placeholder-gray-600 max-sm:text-6xl sm:text-[104px]"
              style={{ width: "5em", maxWidth: "5em" }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-sm:gap-1.5">
            {QUICK_AMOUNTS.map((value) => {
              const base = amountToBaseUnits(String(value));
              const tooMuch = available !== null && base !== null && BigInt(base) > BigInt(available);
              const selected = amount.trim() === String(value) || amount.trim() === `${value}.00`;
              return (
                <button
                  key={value}
                  type="button"
                  disabled={busy || tooMuch}
                  onClick={() => animateAmount(value)}
                  aria-pressed={selected}
                  className={`rounded-full border px-[18px] py-2 text-base font-medium transition-colors disabled:opacity-40 max-sm:px-3 max-sm:py-1.5 max-sm:text-sm ${
                    selected
                      ? "border-orange-400/60 bg-orange-400/10 text-orange-400"
                      : "border-white/15 text-white hover:border-orange-400/60"
                  }`}
                  style={selected ? undefined : FIELD}
                >
                  ${value}
                </button>
              );
            })}
          </div>

          <p className="flex min-h-7 items-center gap-2 text-lg text-gray-400 max-sm:text-base">
            <span
              key={check.amountError ?? (available !== null ? "available" : "checking")}
              className={check.amountError ? "animate-status-message text-red-400" : "animate-status-message"}
              role="status"
            >
              {check.amountError ??
                (available !== null ? (
                  `Available ${formatUsdc(available)}`
                ) : (
                  <LoadingText text="Checking your balance" />
                ))}
            </span>
            {available !== null && !check.amountError && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setAmount(baseUnitsToAmountInput(available))}
                className="font-medium text-orange-400 underline disabled:opacity-40"
              >
                Max
              </button>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.07] pt-4 max-sm:gap-1.5 max-sm:pt-3">
          <label htmlFor="send-to" className="text-lg font-medium text-white max-sm:text-base">To</label>
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
            className="w-full rounded-[14px] border border-white/10 px-[18px] py-4 font-mono text-base text-white placeholder-gray-500 outline-none focus:border-orange-400/60 max-sm:py-3 max-sm:text-sm"
            style={FIELD}
          />
          {check.addressError && <p className="text-[13px] text-red-400">{check.addressError}</p>}
          {addressLooksValid && (
            <p className="flex items-center gap-2 text-[13px]" style={{ color: "#6EE0A8" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12l5 5 9-10" />
              </svg>
              Looks like a valid Solana address
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-lg text-gray-400 max-sm:text-base">
          <span>Network fee</span>
          <span className="text-white">Paid by Kenfi</span>
        </div>

        {state.step === "form" && state.error && (
          <p className="rounded-xl p-3 text-sm text-red-300" style={{ backgroundColor: "#7f1d1d33" }} role="alert">
            {state.error}
          </p>
        )}

        <PixelPromptButton
          type="submit"
          size="lg"
          showSuccessState={false}
          disabled={!check.canSubmit || busy}
          className="w-full py-2.5 max-sm:py-2"
        >
          {busy ? "Checking..." : "Review payment"}
        </PixelPromptButton>
      </form>
    );
  }

  // ── Review ──────────────────────────────────────────────────────────────
  if (state.step === "review" || state.step === "signing") {
    const signing = state.step === "signing";
    const { prepared } = state;
    return (
      <div className={`${SHELL} font-cormorant flex flex-col gap-6 p-4 sm:p-6`} style={CARD}>
        <Steps current={2} />

        <div className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-sm text-gray-400">You are sending</span>
          <span className="font-cinzel text-7xl leading-none text-white sm:text-[88px]">
            {formatUsdcPrecise(prepared.amount)}
          </span>
          <span className="text-sm text-gray-400">USDC on Solana</span>
        </div>

        <dl className="m-0 flex flex-col border-y border-white/[0.07]">
          <Row label="To"><span className="font-mono text-[13px]">{prepared.to_address}</span></Row>
          <Row label="Network fee">Paid by Kenfi</Row>
        </dl>

        <p
          role="note"
          className="flex gap-3 rounded-[14px] border p-3.5 text-sm leading-relaxed"
          style={{ backgroundColor: "rgba(242,193,78,0.09)", borderColor: "rgba(242,193,78,0.28)", color: "#F3E3B0" }}
        >
          <span aria-hidden="true" style={{ color: "#F2C14E" }}>!</span>
          <span>Payments on Solana cannot be reversed. Check the address before you confirm.</span>
        </p>

        <div className="flex flex-wrap gap-3">
          <PixelPromptButton
            size="lg"
            showSuccessState={false}
            onClick={() => void confirm()}
            disabled={signing}
            className="flex-1"
          >
            {signing ? "Waiting for confirmation..." : "Confirm and send"}
          </PixelPromptButton>
          <PixelPromptButton
            size="lg"
            effectOnly
            showSuccessState={false}
            onClick={back}
            disabled={signing}
            className="bg-[#1C1D21]/60"
          >
            Back
          </PixelPromptButton>
        </div>
      </div>
    );
  }

  // ── Pending ─────────────────────────────────────────────────────────────
  if (state.step === "pending") {
    return (
      <div className={`${SHELL} font-cormorant flex flex-col gap-5 p-4 sm:p-6`} style={CARD} aria-live="polite">
        <Steps current={3} />
        <div className="flex items-center gap-4">
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center" aria-hidden="true">
            <span className="anim-ring absolute inset-0 rounded-full border-2" style={{ borderColor: "#F2C14E" }} />
            <span
              className="relative flex h-14 w-14 items-center justify-center rounded-full border-2"
              style={{ borderColor: "#F2C14E", backgroundColor: "rgba(242,193,78,0.14)", color: "#F2C14E" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </span>
          </span>
          <h2 className="font-display text-4xl leading-tight text-white">Payment sent</h2>
        </div>
        <p className="text-sm leading-relaxed text-gray-300">
          {formatUsdcPrecise(state.prepared.amount)} to {shortenAddress(state.prepared.to_address)} is waiting for
          Solana to confirm it. This usually takes a few seconds.
        </p>
        {state.note && <p className="text-sm text-amber-200">{state.note}</p>}
        <ResultLinks signature={state.signature} />
        <div className="flex flex-wrap gap-3">
          <HistoryLink />
        </div>
      </div>
    );
  }

  // ── Confirmed ───────────────────────────────────────────────────────────
  if (state.step === "confirmed") {
    return (
      <div className={`${SHELL} font-cormorant flex flex-col items-center gap-6 p-4 text-center sm:p-6`} style={CARD} aria-live="polite">
        <span className="relative flex h-24 w-24 items-center justify-center" aria-hidden="true">
          <span className="anim-ring absolute inset-0 rounded-full border-2" style={{ borderColor: "#5FD39A" }} />
          <span
            className="anim-pop relative flex h-24 w-24 items-center justify-center rounded-full border-2"
            style={{ borderColor: "#5FD39A", backgroundColor: "rgba(95,211,154,0.14)" }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6EE0A8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path className="anim-draw" d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
        </span>

        <div className="flex flex-col items-center gap-2">
          <h2 className="font-display text-5xl leading-tight text-white">Payment complete</h2>
          <span className="font-cinzel text-6xl leading-none text-white">
            {formatUsdcPrecise(state.prepared.amount)}
          </span>
          <p className="text-[15px] text-gray-400">
            Sent to {shortenAddress(state.prepared.to_address)}
          </p>
          <span
            className="mt-1 rounded-full px-3 py-1 text-xs font-medium"
            style={{ color: "#6EE0A8", backgroundColor: "rgba(95,211,154,0.12)" }}
          >
            Confirmed by Solana
          </span>
        </div>

        <ResultLinks signature={state.signature} />

        <div className="flex flex-wrap justify-center gap-3">
          <PixelPromptButton size="lg" showSuccessState={false} onClick={startOver}>
            Send another
          </PixelPromptButton>
          <HistoryLink />
        </div>
      </div>
    );
  }

  // ── Failed ──────────────────────────────────────────────────────────────
  return (
    <div className={`${SHELL} font-cormorant flex flex-col gap-5 p-4 sm:p-6`} style={CARD} role="alert">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(255,122,122,0.12)", color: "#FF8A8A" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5" />
          <path d="M12 16.5v.01" />
        </svg>
      </span>
      <h2 className="font-display text-4xl leading-tight text-white">Payment not completed</h2>
      <p className="text-sm leading-relaxed text-red-300">{state.message}</p>
      <ResultLinks signature={state.signature} />
      <div className="flex flex-wrap gap-3">
        <PixelPromptButton size="lg" showSuccessState={false} onClick={startOver}>
          Try again
        </PixelPromptButton>
        <HistoryLink />
      </div>
    </div>
  );
}
