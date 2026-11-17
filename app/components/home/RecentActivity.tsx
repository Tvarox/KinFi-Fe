"use client";

import Link from "next/link";
import { dayLabel, formatClock } from "@/lib/history";
import { useHistory } from "@/lib/use-history";
import ActivityRow from "../ActivityRow";

const SHOWN = 3;

const CARD = { backgroundColor: "rgba(28, 29, 33, 0.48)" };
const SHELL = "anim-rise overflow-hidden rounded-[22px] border border-white/[0.08] backdrop-blur-md";

function Header() {
  return (
    <div className="flex items-center justify-between px-6 pb-3 pt-5">
      <h2 className="font-display text-[26px] text-white">Recent activity</h2>
      <Link href="/history" className="text-sm font-medium text-orange-400 hover:text-orange-300">
        View all
      </Link>
    </div>
  );
}

/** The latest few payments. The full list, with filters, lives on History. */
export default function RecentActivity() {
  // One extra, so we know whether there is more than we show.
  const { state, refresh } = useHistory(SHOWN + 2);

  if (state.status === "loading" || state.status === "creating-wallet") {
    return (
      <section aria-label="Recent activity" aria-busy="true" className={SHELL} style={CARD}>
        <Header />
        <div className="flex flex-col gap-4 border-t border-white/[0.06] px-6 py-5">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-4">
              <div className="skeleton h-10 w-10 rounded-full" style={{ borderRadius: 999 }} />
              <div className="flex flex-1 flex-col gap-2">
                <div className="skeleton h-3.5 w-40" />
                <div className="skeleton h-3 w-24" />
              </div>
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section aria-label="Recent activity" className={SHELL} style={CARD}>
        <Header />
        <div className="border-t border-white/[0.06] px-6 py-6 text-sm" role="alert">
          <p className="text-gray-300">We can&apos;t load your activity right now.</p>
          <button type="button" onClick={refresh} className="mt-2 text-orange-400 underline">
            Try again
          </button>
        </div>
      </section>
    );
  }

  const items = state.items.slice(0, SHOWN);

  return (
    <section aria-label="Recent activity" className={SHELL} style={CARD}>
      <Header />
      {items.length === 0 ? (
        <p className="border-t border-white/[0.06] px-6 py-8 text-center text-sm text-gray-400">
          No activity yet. Share your address to receive USDC.
        </p>
      ) : (
        <ul className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
          {items.map((item) => (
            <ActivityRow
              key={item.id}
              item={item}
              showExplorer={false}
              timeText={`${dayLabel(item.timestamp)}${item.timestamp ? `, ${formatClock(item.timestamp)}` : ""}`}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
