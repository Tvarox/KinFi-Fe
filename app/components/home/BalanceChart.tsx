"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Dot,
} from "recharts";

const allData: Record<string, { date: string; value: number }[]> = {
  "1W": [
    { date: "Oct 22", value: 1510 },
    { date: "Oct 23", value: 1580 },
    { date: "Oct 24", value: 1620 },
    { date: "Oct 25", value: 1650 },
    { date: "Oct 26", value: 1750 },
    { date: "Oct 27", value: 1800 },
    { date: "Oct 28", value: 1842 },
  ],
  "1M": [
    { date: "Sep 29", value: 1400 },
    { date: "Oct 1",  value: 1401 },
    { date: "Oct 6",  value: 1403 },
    { date: "Oct 8",  value: 1406 },
    { date: "Oct 14", value: 1412 },
    { date: "Oct 18", value: 1422 },
    { date: "Oct 21", value: 1474 },
    { date: "Oct 23", value: 1580 },
    { date: "Oct 25", value: 1650 },
    { date: "Oct 26", value: 1750 },
    { date: "Oct 27", value: 1800 },
    { date: "Oct 28", value: 1842 },
  ],
  "3M": [
    { date: "Aug 1",  value: 1200 },
    { date: "Aug 15", value: 1220 },
    { date: "Sep 1",  value: 1280 },
    { date: "Sep 15", value: 1350 },
    { date: "Sep 29", value: 1400 },
    { date: "Oct 14", value: 1412 },
    { date: "Oct 21", value: 1474 },
    { date: "Oct 28", value: 1842 },
  ],
  "All": [
    { date: "Jan",  value: 0    },
    { date: "Mar",  value: 200  },
    { date: "May",  value: 600  },
    { date: "Jul",  value: 900  },
    { date: "Sep",  value: 1200 },
    { date: "Oct",  value: 1842 },
  ],
};

const gains: Record<string, string> = {
  "1W": "+$368.52",
  "1M": "+$421.58",
  "3M": "+$641.58",
  "All": "+$1,842.00",
};

const tabs = ["1W", "1M", "3M", "All"] as const;
type TabKey = (typeof tabs)[number];

// Custom dot — only render on last point
function CustomDot(props: any) {
  const { cx, cy, index, dataLength } = props;
  if (index !== dataLength - 1) return null;
  return (
    <circle cx={cx} cy={cy} r={5} fill="#FFA15A" stroke="#131416" strokeWidth={2} />
  );
}

export default function BalanceChart() {
  const [active, setActive] = useState<TabKey>("1M");
  const data = allData[active];

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: "#1C1D21" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Balance over time</h2>
          <p className="text-xs font-medium mt-0.5" style={{ color: "#4ade80" }}>
            {gains[active]} in this period
          </p>
        </div>

        {/* Time filters */}
        <div
          className="flex items-center rounded-xl overflow-hidden border border-white/10"
          style={{ backgroundColor: "#131416" }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className="px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: active === t ? "#27272a" : "transparent",
                color:           active === t ? "#ffffff" : "#6b7280",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FFA15A" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#FFA15A" stopOpacity={0}    />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff0d"
            horizontal vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={48}
            domain={["auto", "auto"]}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1C1D21",
              border: "1px solid #ffffff1a",
              borderRadius: "12px",
              color: "#fff",
              fontSize: 12,
            }}
            formatter={(v: any) => [`$${Number(v).toLocaleString()}`, "Balance"]}
            labelStyle={{ color: "#9ca3af" }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#FFA15A"
            strokeWidth={2}
            fill="url(#balanceGrad)"
            dot={(props) => (
              <CustomDot {...props} dataLength={data.length} />
            )}
            activeDot={{ r: 5, fill: "#FFA15A", stroke: "#131416", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

