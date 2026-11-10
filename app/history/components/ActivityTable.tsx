"use client";

import { useState } from "react";

// ── Icons ────────────────────────────────────────────────────────────────────

function IconArrowUpCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m16 12-4-4-4 4M12 16V8" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function IconArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}
function IconTrendingUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  );
}
function IconArrowDownLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 7 7 17M17 17H7V7" />
    </svg>
  );
}
function IconArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────

export type ActivityRow = {
  date: string;
  time: string;
  activity: string;
  details: string;
  status: "Completed" | "Pending" | "Failed";
  amount: string;
  amountColor: "white" | "green" | "red";
  icon: React.ReactNode | "plus";
  iconBg: string;
  iconColor: string;
  tag: "Added" | "Sent" | "Received" | "Earn";
};

const sampleRows: ActivityRow[] = [
  {
    date: "Oct 28", time: "14:03",
    activity: "Auto-earn to Morpho", details: "20% rule",
    status: "Completed", amount: "$48.25", amountColor: "white",
    icon: <IconArrowUpCircle />, iconBg: "#FFA15A22", iconColor: "#FFA15A",
    tag: "Earn",
  },
  {
    date: "Oct 28", time: "14:02",
    activity: "Added money", details: "Apple Pay · fee $8.75",
    status: "Completed", amount: "+$241.25", amountColor: "green",
    icon: <IconPlus />, iconBg: "#16653422", iconColor: "#4ade80",
    tag: "Added",
  },
  {
    date: "Oct 27", time: "11:40",
    activity: "Sent to Priya", details: "0x8f2d...a41c",
    status: "Completed", amount: "−$40.00", amountColor: "red",
    icon: <IconArrowUpRight />, iconBg: "#7f1d1d22", iconColor: "#f87171",
    tag: "Sent",
  },
  {
    date: "Oct 27", time: "06:00",
    activity: "Interest", details: "Morpho",
    status: "Completed", amount: "+$0.31", amountColor: "green",
    icon: <IconTrendingUp />, iconBg: "#16653422", iconColor: "#4ade80",
    tag: "Earn",
  },
  {
    date: "Oct 26", time: "09:15",
    activity: "Added money", details: "Google Pay · fee $3.50",
    status: "Pending", amount: "+$96.50", amountColor: "green",
    icon: <IconClock />, iconBg: "#27272a", iconColor: "#9ca3af",
    tag: "Added",
  },
  {
    date: "Oct 25", time: "16:30",
    activity: "From Daniel", details: "0xc40b...1e5a",
    status: "Completed", amount: "+$120.00", amountColor: "green",
    icon: <IconArrowDownLeft />, iconBg: "#16653422", iconColor: "#4ade80",
    tag: "Received",
  },
  {
    date: "Oct 24", time: "13:12",
    activity: "Withdrew from Aave", details: "To spendable",
    status: "Completed", amount: "$75.00", amountColor: "white",
    icon: <IconArrowDown />, iconBg: "#FFA15A22", iconColor: "#FFA15A",
    tag: "Earn",
  },
];

const tabs = ["All", "Added", "Sent", "Received", "Earn"] as const;
type Tab = (typeof tabs)[number];

const amountStyles: Record<string, string> = {
  white: "#ffffff",
  green: "#4ade80",
  red:   "#f87171",
};

// ── Component ─────────────────────────────────────────────────────────────────

type ActivityTableProps = {
  rows?: ActivityRow[];
  loading?: boolean;
};

export default function ActivityTable({ rows = sampleRows, loading = false }: ActivityTableProps) {
  const [activeTab, setActiveTab] = useState<Tab>("All");

  const filtered =
    activeTab === "All" ? rows : rows.filter((r) => r.tag === activeTab);

  const downloadCsv = () => {
    const headers = ["Date", "Time", "Activity", "Details", "Status", "Amount"];
    const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [
      headers,
      ...filtered.map((row) => [
        row.date,
        row.time,
        row.activity,
        row.details,
        row.status,
        row.amount,
      ]),
    ]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kenfi-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="rounded-2xl overflow-x-auto tracking-wide"
      style={{ backgroundColor: "#1C1D21" }}
    >
      {/* Top bar: search + date range + export */}
      <div className="flex min-w-[720px] flex-wrap items-center gap-3 p-4 border-b border-white/10">
        {/* Search */}
        <div
          className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5"
          style={{ backgroundColor: "#131416" }}
        >
          <IconSearch />
          <input
            type="text"
            placeholder="Search activity"
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
          />
        </div>

        {/* Date from */}
        <input
          type="date"
          className="rounded-xl px-3 py-2.5 text-sm text-gray-400 outline-none"
          style={{ backgroundColor: "#131416", colorScheme: "dark" }}
        />

        <span className="text-gray-500 text-sm">to</span>

        {/* Date to */}
        <input
          type="date"
          className="rounded-xl px-3 py-2.5 text-sm text-gray-400 outline-none"
          style={{ backgroundColor: "#131416", colorScheme: "dark" }}
        />

        {/* Export CSV */}
        <button
          type="button"
          onClick={downloadCsv}
          className="flex items-center gap-2 text-sm font-medium text-white border border-white/20 rounded-xl px-4 py-2.5 hover:border-white/40 transition-colors whitespace-nowrap"
        >
          <IconDownload />
          Export CSV
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex min-w-[520px] items-center gap-6 px-5 pt-4 pb-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative pb-3 text-sm font-medium transition-colors"
              style={{ color: isActive ? "#FFA15A" : "#9ca3af" }}
            >
              {tab}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 w-full h-[2px] rounded-full"
                  style={{ backgroundColor: "#FFA15A" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Column headers */}
      <div className="grid min-w-[760px] grid-cols-[120px_1fr_1fr_140px_120px] gap-4 px-5 py-3 border-t border-white/10">
        {["Date", "Activity", "Details", "Status", "Amount"].map((h) => (
          <span key={h} className="text-xs text-gray-500">{h}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {loading && <div className="px-5 py-10 text-center text-gray-400">Loading transactions...</div>}
        {!loading && filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-gray-400">No transactions found</div>
        )}
        {filtered.map((row, i) => (
          <div
            key={i}
            className="grid min-w-[760px] grid-cols-[120px_1fr_1fr_140px_120px] gap-4 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors"
          >
            {/* Date */}
            <div>
              <p className="text-sm font-medium text-white">{row.date}</p>
              <p className="text-xs text-gray-500">{row.time}</p>
            </div>

            {/* Activity */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: row.iconBg, color: row.iconColor }}
              >
                {row.icon === "plus" ? <IconPlus /> : row.icon}
              </div>
              <span className="text-sm font-medium text-white">{row.activity}</span>
            </div>

            {/* Details */}
            <span className="text-sm text-gray-400">{row.details}</span>

            {/* Status badge */}
            <div>
              {row.status === "Completed" ? (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#14532d44", color: "#4ade80" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Completed
                </span>
              ) : row.status === "Failed" ? (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ backgroundColor: "#7f1d1d44", color: "#f87171" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Failed
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#78350f44", color: "#FFA15A" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#FFA15A" }} />
                  Pending
                </span>
              )}
            </div>

            {/* Amount */}
            <span
              className="text-sm font-semibold text-right"
              style={{ color: amountStyles[row.amountColor] }}
            >
              {row.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
