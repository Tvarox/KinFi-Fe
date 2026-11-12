'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useAuth } from '@/lib/use-auth';

export default function AutoEarnCard() {
  const { authenticated, callBackend } = useAuth();
  const [threshold, setThreshold] = useState<string>('20');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!authenticated) return;
    callBackend('/wallet/threshold/settings')
      .then((res) => {
        if (res.success && res.data) {
          setThreshold(res.data.threshold_balance ?? '20');
          setEnabled(res.data.enabled ?? true);
        }
      })
      .catch(() => {
        // Keep defaults
      });
  }, [authenticated, callBackend]);

  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between gap-5 self-start"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Auto-earn</h2>
          <span
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: enabled ? "#14532d55" : "#78350f44", color: enabled ? "#4ade80" : "#FFA15A" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: enabled ? "#4ade80" : "#FFA15A" }} />
            {enabled ? "On" : "Off"}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed">
          {threshold}% of every deposit goes to auto-earn at an illustrative 5.2% APY.
        </p>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Earning share</span>
            <span className="font-semibold text-white">{threshold}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#27272a" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${threshold}%`, backgroundColor: "#FFA15A" }}
            />
          </div>
        </div>
      </div>

      {/* Action */}
      <Link
        href="/earn"
        className="w-full py-3 text-center text-sm font-medium text-white border border-white/10 hover:border-white/25 rounded-xl transition-colors"
        style={{ backgroundColor: "#131416" }}
      >
        Change rule
      </Link>
    </div>
  );
}
