"use client";

import Link from "next/link";
import { useState } from "react";
import { filterHistory, formatClock, groupByDay, type HistoryFilter } from "@/lib/history";
import { useHistory } from "@/lib/use-history";
import ActivityRow from "../../components/ActivityRow";
import LoadingText from "../../components/LoadingText";

const TABS: Array<{ id: HistoryFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "sent", label: "Sent" },
  { id: "received", label: "Received" },
];

const CARD = { backgroundColor: "rgba(28, 29, 33, 0.48)" };
const SHELL = "anim-rise overflow-hidden rounded-[22px] border border-white/[0.08] backdrop-blur-md";

export default function ActivityList() {
  const { state, refreshing, loadingMore, moreError, refresh, loadMore } = useHistory();
  const [filter, setFilter] = useState<HistoryFilter>("all");

  if (state.status === "loading" || state.status === "creating-wallet") {
    return (
      <div className={`${SHELL} font-cormorant p-6`} style={CARD} aria-busy="true">
        <p className="mb-5 text-lg text-gray-400" role="status">
          <LoadingText
            text={state.status === "creating-wallet" ? "Setting up your wallet" : "Loading your activity"}
          />
        </p>
        <div className="flex flex-col gap-5">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-4">
              <div className="skeleton h-10 w-10" style={{ borderRadius: 999 }} />
              <div className="flex flex-1 flex-col gap-2">
                <div className="skeleton h-3.5 w-44" />
                <div className="skeleton h-3 w-28" />
              </div>
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className={`${SHELL} p-8 text-center`} style={CARD} role="alert">
        <p className="text-sm text-red-400">{state.message}</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-4 rounded-full border border-white/15 px-5 py-2 text-sm text-gray-200 transition-colors hover:border-white/40"
        >
          Try again
        </button>
      </div>
    );
  }

  const visible = filterHistory(state.items, filter);
  const groups = groupByDay(visible);

  return (
    <div className={`${SHELL} font-cormorant`} style={CARD}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] px-6 py-4">
        <div
          className="flex gap-1.5 rounded-xl p-1"
          role="tablist"
          aria-label="Filter activity"
          style={{ backgroundColor: "rgba(19, 20, 22, 0.7)" }}
        >
          {TABS.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tab.id)}
                className={`rounded-[9px] px-[18px] py-2 text-sm font-medium transition-colors ${
                  active ? "bg-orange-400/15 text-orange-400" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-[10px] border border-white/15 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:border-white/40 disabled:opacity-50"
        >
          <svg
            width="14"
            height="14"
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
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {visible.length === 0 ? (
        state.items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full text-gray-400"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </span>
            <h2 className="font-display text-3xl text-white">No activity yet</h2>
            <p className="max-w-sm text-sm leading-relaxed text-gray-300">
              Share your address to receive USDC. Payments show up here once Solana confirms them.
            </p>
            <Link
              href="/receive"
              className="mt-1 rounded-[14px] border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40"
            >
              Show my address
            </Link>
          </div>
        ) : (
          <p className="px-6 py-10 text-center text-sm text-gray-400">Nothing here yet.</p>
        )
      ) : (
        groups.map((group) => (
          <section key={group.label} aria-label={group.label}>
            <h2 className="px-6 pb-2 pt-[18px] font-sans text-xs font-medium uppercase tracking-[0.08em] text-gray-400">
              {group.label}
            </h2>
            <ul className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
              {group.items.map((item) => (
                <ActivityRow key={item.id} item={item} timeText={formatClock(item.timestamp)} />
              ))}
            </ul>
          </section>
        ))
      )}

      {(state.nextCursor || moreError) && (
        <div className="flex flex-col items-center gap-2 border-t border-white/[0.07] px-6 py-5">
          {moreError && <p className="text-xs text-red-400">{moreError}</p>}
          {state.nextCursor && (
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              className="rounded-xl border border-white/15 px-[22px] py-2.5 text-sm font-medium text-white transition-colors hover:border-white/40 disabled:opacity-50"
            >
              {loadingMore ? <LoadingText text="Loading" /> : "Load more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
