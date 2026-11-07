'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/use-auth';

interface WalletBalances {
  embedded: string;
  usdc: string;
  idle: string;
  aave: string;
  total: string;
}

function formatUsdc(value: string): string {
  try {
    return (Number(BigInt(value)) / 1e6).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  } catch {
    return 'Unavailable';
  }
}

export default function WalletPage() {
  const { authenticated, ready, callBackend } = useAuth();
  const [balances, setBalances] = useState<WalletBalances | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !authenticated) {
      setBalances(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    callBackend('/wallet/balances')
      .then((response) => {
        if (cancelled) return;

        if (response.success && response.data) {
          setBalances(response.data as WalletBalances);
        } else {
          setBalances(null);
          setError(response.error?.message || 'Failed to load wallet balances');
        }
      })
      .catch((requestError: Error) => {
        if (!cancelled) {
          setBalances(null);
          setError(requestError.message || 'Failed to load wallet balances');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
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
        <p className="mb-6 text-gray-400">
          You need to log in to view your vault balance.
        </p>
        <a href="/login" className="text-orange-400 hover:underline">
          Go to login
        </a>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading balances...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-400">{error}</div>;
  }

  const balanceRows = balances
    ? [
        ['Embedded wallet', balances.embedded],
        ['USDC balance', balances.usdc],
        ['Idle vault balance', balances.idle],
        ['Aave earning balance', balances.aave],
      ]
    : [];

  return (
    <div className="flex-1 px-8 py-8" style={{ backgroundColor: '#131416' }}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Wallet</h1>
          <p className="mt-1.5 text-sm text-gray-400">
            Your smart vault and embedded wallet balances.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 p-6" style={{ backgroundColor: '#1C1D21' }}>
          <p className="mb-2 text-sm text-gray-400">Total vault balance</p>
          <p className="text-4xl font-bold text-white">
            {balances ? `$${formatUsdc(balances.total)}` : 'Unavailable'} USDC
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {balanceRows.map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 p-5"
              style={{ backgroundColor: '#1C1D21' }}
            >
              <p className="mb-2 text-sm text-gray-400">{label}</p>
              <p className="text-2xl font-semibold text-white">${formatUsdc(value)} USDC</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
