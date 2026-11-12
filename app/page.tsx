'use client';

import BalanceHero from './components/home/BalanceHero';
import { shortenAddress } from '@/lib/format';
import { useUsdcBalance } from '@/lib/use-backend-query';

export default function HomePage() {
  const { state, refreshing, refresh } = useUsdcBalance();

  return (
    <div
      className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 10 }}
    >
      <div className="mx-auto flex max-w-6xl lg:max-w-7xl flex-col gap-4">
        <BalanceHero state={state} refreshing={refreshing} onRefresh={refresh} />

        {state.status === 'ready' && (
          <div
            className="flex items-center justify-between gap-4 rounded-2xl p-5"
            style={{ backgroundColor: '#1C1D21' }}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-400">Your wallet</span>
              <span className="font-mono text-sm text-white" title={state.data.address}>
                {shortenAddress(state.data.address)}
              </span>
            </div>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-gray-300">
              Solana
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
