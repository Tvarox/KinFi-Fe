"use client";

import { useState } from "react";
import { formatUsdc } from "@/lib/format";
import {
  describeHistoryItem,
  filterHistory,
  formatTimestamp,
  statusLabel,
  type HistoryFilter,
  type HistoryItem,
} from "@/lib/history";
import { explorerTxUrl } from "@/lib/send";
import { useHistory } from "@/lib/use-history";

const TABS: Array<{ id: HistoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "sent", label: "Sent" },
  { id: "received", label: "Received" },
];

const BADGE: Record<HistoryItem["status"], { bg: string; fg: string }> = {
  pending: { bg: "#78350f55", fg: "#fbbf24" },
  confirmed: { bg: "#14532d55", fg: "#4ade80" },
  failed: { bg: "#7f1d1d55", fg: "#f87171" },
};

function Amount({ item }: { item: HistoryItem }) {
  const text = formatUsdc(item.amount);
  if (text === null) return <span className="text-gray-500">Unknown</span>;

  const failed = item.status === "failed";
  const sign = item.direction === "received" ? "+" : "-";
  const color = failed ? "#9ca3af" : item.direction === "received" ? "#4ade80" : "#ffffff";

  return (
    <span className={failed ? "line-through" : ""} style={{ color }}>
      {sign}
      {text}
    </span>
  );
}

function Row({ item }: { item: HistoryItem }) {
  const badge = BADGE[item.status];
  return (
    <li className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium text-white">{describeHistoryItem(item)}</span>
        <span className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
          {formatTimestamp(item.timestamp)}
          <span className="rounded-full px-2 py-0.5 font-medium" style={{ backgroundColor: badge.bg, color: badge.fg }}>
            {statusLabel(item.status)}
          </span>
          {item.signature && (
            <a
              href={explorerTxUrl(item.signature)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              aria-label="View this transaction on Solana Explorer"
            >
              View
            </a>
          )}
        </span>
      </div>
      <span className="shrink-0 text-sm font-semibold">
        <Amount item={item} />
      </span>
    </li>
  );
}

export default function ActivityList() {
  const { state, refreshing, loadingMore, moreError, refresh, loadMore } = useHistory();
  const [filter, setFilter] = useState<HistoryFilter>("all");

  if (state.status === "loading" || state.status === "creating-wallet") {
    return (
      <div className="rounded-2xl p-8 text-center text-sm text-gray-400" style={{ backgroundColor: "#1C1D21" }}>
        {state.status === "creating-wallet" ? "Setting up your wallet..." : "Loading your activity..."}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "#1C1D21" }} role="alert">
        <p className="text-sm text-red-400">{state.message}</p>
        <button type="button" onClick={refresh} className="mt-3 rounded-full border border-white/15 px-4 py-1.5 text-sm text-gray-200">
          Try again
        </button>
      </div>
    );
  }

  const visible = filterHistory(state.items, filter);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1C1D21" }}>
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 pt-4">
        <div className="flex items-center gap-6" role="tablist" aria-label="Filter activity">
          {TABS.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className="relative pb-3 text-sm font-medium transition-colors"
                style={{ color: active ? "#FFA15A" : "#9ca3af" }}
              >
                {tab.label}
                {active && <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full" style={{ backgroundColor: "#FFA15A" }} />}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="mb-3 rounded-full border border-white/15 px-3 py-1 text-xs text-gray-300 transition-colors hover:border-white/30 disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-gray-400">
          {state.items.length === 0
            ? "No activity yet. Share your address to receive USDC."
            : "Nothing here yet."}
        </p>
      ) : (
        <ul className="divide-y divide-white/10">
          {visible.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </ul>
      )}

      {(state.nextCursor || moreError) && (
        <div className="flex flex-col items-center gap-2 border-t border-white/10 p-4">
          {moreError && <p className="text-xs text-red-400">{moreError}</p>}
          {state.nextCursor && (
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="rounded-full border border-white/15 px-5 py-1.5 text-sm text-gray-200 transition-colors hover:border-white/30 disabled:opacity-50"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
