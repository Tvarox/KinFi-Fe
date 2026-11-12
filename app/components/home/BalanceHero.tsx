import PixelPromptButton from "../PixelPromptButton";
import { formatUsdc } from "@/lib/format";
import type { QueryState, UsdcBalance } from "@/lib/use-backend-query";

interface BalanceHeroProps {
  state: QueryState<UsdcBalance>;
  refreshing: boolean;
  onRefresh: () => void;
}

function updatedText(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `Updated ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

export default function BalanceHero({ state, refreshing, onRefresh }: BalanceHeroProps) {
  let amount = "$0.00";
  let note = "";
  let isError = false;

  if (state.status === "loading") {
    amount = "...";
    note = "Loading your balance";
  } else if (state.status === "creating-wallet") {
    amount = "...";
    note = "Setting up your wallet";
  } else if (state.status === "error") {
    amount = "Unavailable";
    note = state.message;
    isError = true;
  } else {
    amount = formatUsdc(state.data.usdc) ?? "Unavailable";
    note = updatedText(state.data.updated_at);
  }

  return (
    <div className="flex flex-col gap-4 py-6">
      <p className="text-sm text-gray-400">Total balance · USDC on Solana</p>

      <div className="flex items-end gap-0">
        <span
          className="text-6xl font-bold text-white tracking-tight"
          aria-live="polite"
        >
          {amount}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs" style={{ color: isError ? "#f87171" : "#9ca3af" }}>
        <span>{note}</span>
        {(state.status === "ready" || state.status === "error") && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="rounded-full border border-white/15 px-3 py-1 text-gray-300 transition-colors hover:border-white/30 disabled:opacity-50"
          >
            {refreshing ? "Refreshing..." : state.status === "error" ? "Try again" : "Refresh"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 mt-1">
        <PixelPromptButton label="Receive" href="/receive" />
      </div>
    </div>
  );
}
