'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useAuth } from '@/lib/use-auth';

interface Deposit {
  tx_hash: string;
  amount: string;
  status: string;
  created_at: number;
}

interface ActivityItem {
  id: string;
  title: string;
  meta: string;
  amount: string;
  amountColor: "white" | "green" | "red";
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  isPending?: boolean;
}

function formatActivity(deposits: Deposit[]): ActivityItem[] {
  return deposits.map((d) => {
    const amountNum = Number(BigInt(d.amount)) / 1e6;
    const isPending = d.status === "pending";
    const date = new Date(d.created_at * 1000);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return {
      id: d.tx_hash,
      title: "Added money",
      meta: `Deposit · ${dateStr}`,
      amount: `+$${amountNum.toFixed(2)}`,
      amountColor: "green" as const,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
      iconBg: "#16653422",
      iconColor: "#4ade80",
      isPending,
    };
  });
}

export default function RecentActivityCard() {
  const { authenticated, callBackend } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    callBackend('/wallet/transactions?type=deposit&limit=5')
      .then((res) => {
        if (res.success && res.data?.deposits) {
          setActivities(formatActivity(res.data.deposits));
        }
      })
      .catch(() => {
        // Keep empty on error
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authenticated, callBackend]);

  const amountColorMap = {
    white: "#ffffff",
    green: "#4ade80",
    red: "#f87171",
  };

  if (loading) {
    return (
      <div className="rounded-2xl p-5 flex flex-col gap-4 flex-1" style={{ backgroundColor: "#1C1D21" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Recent activity</h2>
        </div>
        <div className="text-center text-gray-400 py-8">Loading...</div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-2xl p-5 flex flex-col gap-4 flex-1" style={{ backgroundColor: "#1C1D21" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Recent activity</h2>
        </div>
        <div className="text-center text-gray-400 py-8">No recent activity</div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 flex-1"
      style={{ backgroundColor: "#1C1D21" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">Recent activity</h2>
        <Link
          href="/history"
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          View all
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* List */}
      <div className="flex flex-col divide-y divide-white/5">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1"
          >
            {/* Left: Icon & text */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: item.iconBg, color: item.iconColor }}
              >
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{item.title}</span>
                <span className="text-xs text-gray-400">{item.meta}</span>
              </div>
            </div>

            {/* Right: Status / Amount */}
            <div className="flex items-center gap-3">
              {item.isPending && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#78350f44", color: "#FFA15A" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#FFA15A" }} />
                  Pending
                </span>
              )}
              <span
                className="text-sm font-semibold text-right"
                style={{ color: amountColorMap[item.amountColor] }}
              >
                {item.amount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
