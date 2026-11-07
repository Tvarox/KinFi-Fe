import Link from "next/link";

interface BalanceHeroProps {
  total?: string;
}

export default function BalanceHero({ total }: BalanceHeroProps) {
  return (
    <div className="flex flex-col gap-4 py-6">
      {/* Label */}
      <p className="text-sm text-gray-400">Total balance</p>

      {/* Balance */}
      <div className="flex items-end gap-0">
        <span className="text-6xl font-bold text-white tracking-tight">{total ?? 'Loading...'}</span>
      </div>

      {/* Earn badge + disclaimer */}
      <div className="flex items-center gap-3">
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "#14532d55", color: "#4ade80" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          Earned from auto-earn
        </span>
        <span className="text-xs text-gray-500">Illustrative estimate, not guaranteed</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-1">
        <Link
          href="/add-money"
          className="flex items-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#FFA15A", color: "#131416" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add money
        </Link>

        <Link
          href="/send"
          className="flex items-center gap-2 text-sm font-medium rounded-xl px-5 py-2.5 border border-white/15 hover:border-white/30 transition-colors text-white"
          style={{ backgroundColor: "#1C1D21" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
          Send
        </Link>

        <Link
          href="/send"
          className="flex items-center gap-2 text-sm font-medium rounded-xl px-5 py-2.5 border border-white/15 hover:border-white/30 transition-colors text-white"
          style={{ backgroundColor: "#1C1D21" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 7 7 17M17 17H7V7" />
          </svg>
          Receive
        </Link>
      </div>
    </div>
  );
}
