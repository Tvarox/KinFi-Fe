import ActivityList from "./components/ActivityList";

export default function HistoryPage() {
  return (
    <div
      className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">History</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Your USDC activity, read from Solana. A payment shows as complete only after Solana confirms it.
          </p>
        </div>
        <ActivityList />
      </div>
    </div>
  );
}
