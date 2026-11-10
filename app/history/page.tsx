'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/use-auth';
import StatsSummary from './components/StatsSummary';
import ActivityTable, { type ActivityRow } from './components/ActivityTable';

interface Deposit {
  tx_hash: string;
  amount: string;
  status: string;
  created_at: number;
}

function formatUsd(value: string): string {
  try {
    return `$${(Number(BigInt(value)) / 1e6).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`;
  } catch {
    return 'Unavailable';
  }
}

function formatDate(timestamp: number): { date: string; time: string } {
  const value = new Date(timestamp * 1000);
  return {
    date: value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function HistoryPage() {
  const { authenticated, ready, callBackend } = useAuth();
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !authenticated) {
      setRows([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    callBackend('/wallet/transactions?type=all&limit=100')
      .then((response) => {
        if (cancelled) return;
        if (!response.success) {
          setError(response.error?.message || 'Unable to load transaction history');
          return;
        }

        const deposits = (response.data?.deposits ?? []) as Deposit[];
        setRows(deposits.map((deposit) => {
          const { date, time } = formatDate(deposit.created_at);
          const failed = deposit.status === 'failed';
          const pending = deposit.status !== 'confirmed' && !failed;

          return {
            date,
            time,
            activity: 'Added money',
            details: deposit.tx_hash ? `Base · ${deposit.tx_hash.slice(0, 8)}...${deposit.tx_hash.slice(-6)}` : 'Base · USDC',
            status: failed ? 'Failed' : pending ? 'Pending' : 'Completed',
            amount: `+${formatUsd(deposit.amount)}`,
            amountColor: failed ? 'red' : 'green',
            icon: 'plus',
            iconBg: failed ? '#7f1d1d22' : '#16653422',
            iconColor: failed ? '#f87171' : '#4ade80',
            tag: 'Added',
          };
        }));
      })
      .catch((requestError: Error) => {
        if (!cancelled) {
          setRows([]);
          setError(requestError.message || 'Unable to load transaction history');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authenticated, callBackend, ready]);

  if (!ready) {
    return <div className="p-8 text-center text-gray-400">Loading auth...</div>;
  }

  if (!authenticated) {
    return (
      <div className="p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Connect Wallet</h1>
        <p className="mb-6 text-gray-400">You need to log in to view transaction history.</p>
        <a href="/login" className="text-orange-400 hover:underline">Go to login</a>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 10 }}>
      <div className="max-w-6xl lg:max-w-7xl mx-auto flex flex-col gap-2 tracking-wide">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">History</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Everything that moved in Main account.
          </p>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        <StatsSummary rows={rows} />
        <ActivityTable rows={rows} loading={loading} />
      </div>
    </div>
  );
}
