import StatsSummary  from "./components/StatsSummary";
import ActivityTable from "./components/ActivityTable";

export default function HistoryPage() {
  return (
    <div className="flex-1 px-8 py-8" style={{ backgroundColor: "#131416" }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">History</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Everything that moved in Main account.
          </p>
        </div>

        <StatsSummary />
        <ActivityTable />
      </div>
    </div>
  );
}
