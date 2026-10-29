"use client";

import { useState } from "react";
import EarnSlider        from "./components/EarnSlider";
import ProtocolSelector  from "./components/ProtocolSelector";
import ProjectionChart   from "./components/ProjectionChart";
import RiskWarning       from "./components/RiskWarning";
import YourPositions     from "./components/YourPositions";
import EarnSummary       from "./components/EarnSummary";

const TOTAL_BALANCE = 1842.60;

const APY_MAP: Record<string, number> = {
  Aave:   3.9,
  Morpho: 5.2,
  Yo:     4.3,
};

export default function EarnPage() {
  const [percent,  setPercent]  = useState(20);
  const [protocol, setProtocol] = useState("Morpho");

  const goesToEarning  = TOTAL_BALANCE * (percent / 100);
  const staysSpendable = TOTAL_BALANCE - goesToEarning;
  const apy            = APY_MAP[protocol] ?? 5.2;
  const estEarnings    = goesToEarning * (apy / 100);

  return (
    <div className="flex-1 px-8 py-8" style={{ backgroundColor: "#131416" }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Put idle money to work.</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Pick how much of your balance should earn. The rest stays spendable.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-5 items-start">
          {/* Left column — 4 stacked components */}
          <div className="flex flex-col gap-5">
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
          <div className="col-span-2">
            <YourPositions />
          </div>
        </div>
      </div>
    </div>
  );
}
