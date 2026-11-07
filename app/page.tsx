'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/use-auth';
import AutoEarnCard from './components/home/AutoEarnCard';
import BalanceChart from './components/home/BalanceChart';
import BalanceHero from './components/home/BalanceHero';
import MetricCard from './components/home/MetricCard';
import RecentActivityCard from './components/home/RecentActivityCard';

const HEALTH_STORAGE_KEY = 'kinfi_health_check';

interface WalletBalances {
  embedded: string;
  usdc: string;
  idle: string;
  aave: string;
  total: string;
}

interface HealthCheck {
  connected: boolean;
  message: string;
}

function formatUsd(value: string): string {
  try {
    const amount = Number(BigInt(value)) / 1e6;
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } catch {
    return 'Unavailable';
  }
}

export default function HomePage() {
  const { authenticated, ready, callBackend } = useAuth();
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [balances, setBalances] = useState<WalletBalances | null>(null);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  useEffect(() => {
    const storedHealth = window.localStorage.getItem(HEALTH_STORAGE_KEY);

    if (storedHealth) {
      try {
        const cachedHealth = JSON.parse(storedHealth) as HealthCheck;
        if (cachedHealth.connected) {
          setHealth(cachedHealth);
          return;
        }
      } catch {
      }
      window.localStorage.removeItem(HEALTH_STORAGE_KEY);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8787/api';

    fetch(`${baseUrl}/health`)
      .then(async (response) => {
        const data = await response.json();
        const result: HealthCheck = {
          connected: response.ok && data.status === 'ok',
          message: response.ok && data.status === 'ok'
            ? `✅ Backend connected (v${data.version ?? 'unknown'})`
            : '❌ Backend is unavailable',
        };
        if (result.connected) {
          window.localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(result));
        }
        setHealth(result);
      })
      .catch(() => {
        const result: HealthCheck = {
          connected: false,
          message: '❌ Cannot reach backend',
        };
        setHealth(result);
      });
  }, []);

  useEffect(() => {
    if (!ready || !authenticated) {
      setBalances(null);
      setIsLoadingBalances(false);
      return;
    }

    let cancelled = false;
    setIsLoadingBalances(true);

    callBackend('/wallet/balances')
      .then((response) => {
        if (cancelled) return;
        setBalances(response.success && response.data ? response.data : null);
      })
      .catch(() => {
        if (!cancelled) setBalances(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBalances(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authenticated, callBackend, ready]);

  const balanceValue = (value: string | undefined) => {
    if (!ready || !authenticated) return 'Connect wallet';
    if (isLoadingBalances) return 'Loading...';
    return value ? formatUsd(value) : 'Unavailable';
  };

  const total = balanceValue(balances?.total);
  const spendable = balanceValue(balances?.embedded);
  const earning = balanceValue(balances?.aave);

  return (
    <div className="flex-1 px-8 py-8" style={{ backgroundColor: '#131416' }}>
      <div
        className="mb-6 rounded-lg border p-4"
        style={{
          backgroundColor: health?.connected ? '#166534' : '#7f1d1d',
          color: '#ffffff',
        }}
      >
        {health?.message ?? 'Checking backend...'}
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_360px]">
          <BalanceHero total={total} />
          <div className="hidden md:block" />
        </div>

        <BalanceChart />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard label="Spendable" value={spendable} subtitle="Ready to send" />
          <MetricCard label="Earning" value={earning} subtitle="Auto-earn balance" />
          <MetricCard
            label="Total"
            value={total}
            subtitle="Vault + embedded"
            isGreen
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-[1fr_320px]">
          <RecentActivityCard />
          <AutoEarnCard />
        </div>
      </div>
    </div>
  );
}