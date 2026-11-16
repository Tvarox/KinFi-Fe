'use client';

import { usePrivy } from '@privy-io/react-auth';
import BalanceHero from './components/home/BalanceHero';
import RecentActivity from './components/home/RecentActivity';
import WalletSummary from './components/home/WalletSummary';
import { greeting } from '@/lib/greeting';
import { useUsdcBalance } from '@/lib/use-backend-query';

export default function HomePage() {
  const { state, refreshing, refresh } = useUsdcBalance();
  const { user } = usePrivy();

  const title = greeting({
    name: user?.google?.name,
    email: user?.email?.address ?? user?.google?.email,
  });

  return (
    <div
      className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-10"
      style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 10 }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-4xl text-white sm:text-[44px]">{title}</h1>
            <p className="text-[15px] text-gray-400">Here is your money today.</p>
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-[13px] text-gray-400"
            style={{ backgroundColor: 'rgba(28, 29, 33, 0.5)' }}
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: '#5FD39A' }} />
            Solana
          </span>
        </header>

        <BalanceHero state={state} refreshing={refreshing} onRefresh={refresh} />

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <RecentActivity />
          <WalletSummary address={state.status === 'ready' ? state.data.address : null} />
        </div>
      </div>
    </div>
  );
}
