import PixelPromptButton from "../PixelPromptButton";
import LoadingText from "../LoadingText";
import { formatUsdc } from "@/lib/format";
import type { QueryState, UsdcBalance } from "@/lib/use-backend-query";

interface BalanceHeroProps {
  state: QueryState<UsdcBalance>;
  refreshing: boolean;
  onRefresh: () => void;
}

const CARD = { backgroundColor: "rgba(28, 29, 33, 0.48)" };

function LoadingStatus({ settingUp }: { settingUp: boolean }) {
  return (
    <LoadingText
      className="font-cormorant text-lg text-gray-400"
      text={settingUp ? "Setting up your wallet" : "Loading your balance"}
    />
  );
}

function updatedText(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `Updated ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

function Actions() {
  return (
    // Side by side on phones/tablets; stacked column beside the balance on desktop.
    <div className="grid w-full grid-cols-2 gap-3 lg:flex lg:w-40 lg:flex-col lg:items-end">
      <PixelPromptButton
        label="Send"
        href="/send"
        size="lg"
        showSuccessState={false}
        className="w-full"
      />
      <PixelPromptButton
        label="Receive"
        href="/receive"
        size="lg"
        effectOnly
        className="w-full bg-[#1C1D21]/60"
      />
    </div>
  );
}

export default function BalanceHero({ state, refreshing, onRefresh }: BalanceHeroProps) {
  const shell =
    "anim-rise flex flex-col gap-7 rounded-[22px] border border-white/[0.08] p-4 backdrop-blur-md sm:p-6 lg:flex-row lg:items-center lg:justify-between";

  if (state.status === "loading" || state.status === "creating-wallet") {
    const settingUp = state.status === "creating-wallet";
    return (
      <section aria-label="Balance" aria-busy="true" className={shell} style={CARD}>
        <div className="flex flex-col gap-3">
          <span className="text-sm text-gray-400">Total balance</span>
          <div className="skeleton h-20 w-72 max-w-full" style={{ borderRadius: 14 }} />
          <LoadingStatus settingUp={settingUp} />
        </div>
        <Actions />
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section aria-label="Balance" className={shell} style={CARD}>
        <div className="flex flex-col gap-3" role="alert">
          <span className="font-cormorant text-lg text-gray-400">Total balance</span>
          <h2 className="font-display text-4xl leading-tight text-white">We can&apos;t load your balance</h2>
          <p className="max-w-md text-sm leading-relaxed text-gray-300">
            {state.message} Your money is not affected.
          </p>
          <div>
            <PixelPromptButton
              label="Try again"
              onClick={onRefresh}
              showSuccessState={false}
              disabled={refreshing}
            />
          </div>
        </div>
        <Actions />
      </section>
    );
  }

  const amount = formatUsdc(state.data.usdc) ?? "Unavailable";
  const updated = updatedText(state.data.updated_at);

  return (
    <section aria-label="Balance" className={shell} style={CARD}>
      <div className="flex flex-col gap-2">
        <span className="font-cormorant text-lg text-gray-400">Total balance</span>
        <span
          className="font-cinzel text-7xl leading-none text-white sm:text-8xl lg:text-[104px]"
          aria-live="polite"
        >
          {amount}
        </span>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{ color: "#FFA15A", backgroundColor: "rgba(255,161,90,0.12)", border: "1px solid rgba(255,161,90,0.35)" }}
          >
            USDC on Solana
          </span>
          {updated && <span className="text-[13px] text-gray-400">{updated}</span>}
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label={refreshing ? "Refreshing balance" : "Refresh balance"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-gray-400 transition-colors hover:border-white/40 hover:text-white disabled:opacity-50"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={refreshing ? "anim-spin" : undefined}
            >
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 4v5h-5" />
            </svg>
          </button>
        </div>
      </div>
      <Actions />
    </section>
  );
}
