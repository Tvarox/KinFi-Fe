"use client";

import { useState } from "react";

const notificationItems = [
  { label: "Payments", description: "Money in and out" },
  { label: "Earnings", description: "Interest and auto-earn moves" },
  { label: "Security", description: "New sign-ins and changes" },
];

export default function NotificationsCard() {
  const [toggles, setToggles] = useState([true, true, true]);

  const toggle = (i: number) =>
    setToggles((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-xl font-semibold text-white">Notifications</h2>

      <div className="flex flex-col gap-5">
        {notificationItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
            </div>

            {/* Toggle */}
            <button
              onClick={() => toggle(i)}
              className="relative inline-flex shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
              style={{ backgroundColor: toggles[i] ? "#FFA15A" : "#374151" }}
            >
              <span
                className="inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5"
                style={{ transform: toggles[i] ? "translateX(22px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

