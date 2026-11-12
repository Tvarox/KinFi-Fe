'use client';

import { useEffect, useState } from 'react';
import EarnSlider        from "./components/EarnSlider";
import ProtocolSelector  from "./components/ProtocolSelector";
import ProjectionChart   from "./components/ProjectionChart";
import RiskWarning       from "./components/RiskWarning";
import YourPositions     from "./components/YourPositions";
import EarnSummary       from "./components/EarnSummary";
import { useAuth } from '@/lib/use-auth';

const APY_MAP: Record<string, number> = {
  Aave:   3.9,
  Morpho: 5.2,
  Yo:     4.3,
};

function formatUsd(value: string): number {
  return Number(BigInt(value)) / 1e6;
}

export default function EarnPage() {
  const { authenticated, ready, callBackend } = useAuth();
  const [percent,  setPercent]  = useState(20);
  const [protocol, setProtocol] = useState("Morpho");
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !authenticated) {
      setTotalBalance(null);
      setIsLoadingBalance(false);
      setBalanceError(null);
      return;
    }

    let cancelled = false;
    setIsLoadingBalance(true);
    setBalanceError(null);

    callBackend('/wallet/balances')
      .then((res) => {
        if (cancelled) return;

        if (res.success && res.data?.total !== undefined) {
          setTotalBalance(formatUsd(res.data.total));
        } else {
          setTotalBalance(null);
          setBalanceError(res.error?.message || 'Unable to load your balance');
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setTotalBalance(null);
          setBalanceError(error.message || 'Unable to load your balance');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBalance(false);
      });
  
    return () => {
      cancelled = true;
    };
  }, [authenticated, callBackend, ready]);

  const goesToEarning  = (totalBalance ?? 0) * (percent / 100);
  const staysSpendable = (totalBalance ?? 0) - goesToEarning;
  const apy            = APY_MAP[protocol] ?? 5.2;
  const estEarnings    = goesToEarning * (apy / 100);

  if (!ready) {
    return <div className="p-8 text-center text-gray-400">Loading auth...</div>;
  }

  if (!authenticated) {
    return (
      <div className="p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Connect Wallet</h1>
        <p className="mb-6 text-gray-400">
          You need to log in to configure auto-earn.
        </p>
        <a href="/login" className="text-orange-400 hover:underline">
          Go to login
        </a>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 10 }}>
      <div className="max-w-6xl lg:max-w-7xl mx-auto flex flex-col gap-2 tracking-wide">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Put idle money to work.</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Pick how much of your balance should earn. The rest stays spendable.
          </p>
          {isLoadingBalance && (
            <p className="mt-2 text-sm text-gray-400">Loading your balance...</p>
          )}
          {balanceError && (
            <p className="mt-2 text-sm text-red-400">{balanceError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 items-start">
          {/* Left column — 4 stacked components */}
          <div className="flex flex-col gap-3">
            <EarnSlider       percent={percent}   setPercent={setPercent} />
            <ProtocolSelector protocol={protocol} setProtocol={setProtocol} />
            <ProjectionChart  principal={goesToEarning} apy={apy} />
            <RiskWarning />
          </div>

          {/* Right column — sticky Summary that fills empty space as user scrolls */}
          <EarnSummary
            goesToEarning={goesToEarning}
            staysSpendable={staysSpendable}
            protocol={protocol}
            apy={apy}
            estEarnings={estEarnings}
          />

          {/* Full-width row — spans both left + right columns */}
          <div className="lg:col-span-2">
            <YourPositions />
          </div>
        </div>
      </div>
    </div>
  );
}
