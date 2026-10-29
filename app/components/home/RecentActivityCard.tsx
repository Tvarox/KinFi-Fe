import Link from "next/link";

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

export default function RecentActivityCard() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      title: "Auto-earn to Morpho",
      meta: "20% rule · Oct 28, 14:03",
      amount: "$48.25",
      amountColor: "white",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m16 12-4-4-4 4M12 16V8" />
        </svg>
      ),
      iconBg: "#FFA15A22",
      iconColor: "#FFA15A",
    },
    {
      id: "2",
      title: "Added money",
      meta: "Apple Pay · fee $8.75 · Oct 28, 14:02",
      amount: "+$241.25",
      amountColor: "green",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      ),
      iconBg: "#16653422",
      iconColor: "#4ade80",
    },
    {
      id: "3",
      title: "Sent to Priya",
      meta: "0x8f2d...a41c · Oct 27, 11:40",
      amount: "−$40.00",
      amountColor: "red",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      ),
      iconBg: "#7f1d1d22",
      iconColor: "#f87171",
    },
    {
      id: "4",
      title: "Interest",
      meta: "Morpho · Oct 27, 06:00",
      amount: "+$0.31",
      amountColor: "green",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      iconBg: "#16653422",
      iconColor: "#4ade80",
    },
    {
      id: "5",
      title: "Added money",
      meta: "Google Pay · fee $3.50 · Oct 26, 09:15",
      amount: "+$96.50",
      amountColor: "white",
      isPending: true,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      iconBg: "#27272a",
      iconColor: "#9ca3af",
    },
  ];

  const amountColorMap = {
    white: "#ffffff",
    green: "#4ade80",
    red: "#f87171",
  };

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

