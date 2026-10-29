import BalanceHero from "./components/home/BalanceHero";
import BalanceChart from "./components/home/BalanceChart";
import MetricCard from "./components/home/MetricCard";
import RecentActivityCard from "./components/home/RecentActivityCard";
import AutoEarnCard from "./components/home/AutoEarnCard";

export default function HomePage() {
  return (
    <div className="flex-1 px-8 py-8" style={{ backgroundColor: "#131416" }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* Section 1: Hero area (left populated, right left empty as requested) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-6 items-center">
          <BalanceHero />
          {/* Empty space on the right for card */}
          <div className="hidden md:block" />
        </div>

        {/* Section 2: Balance over time chart */}
        <BalanceChart />

        {/* Section 3: 3 Metric cards using the reusable component */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="Spendable"
            value="$1,474.08"
            subtitle="Ready to send"
          />
          <MetricCard
            label="Earning"
            value="$368.52"
            subtitle="20% of your balance"
          />
          <MetricCard
            label="Earned"
            value="+$12.47"
            subtitle="Since you started"
            isGreen
          />
        </div>

        {/* Section 4: Recent Activity & Auto-earn */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5 items-start">
          <RecentActivityCard />
          <AutoEarnCard />
        </div>

      </div>
    </div>
  );
}
