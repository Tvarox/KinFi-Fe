import ActivityList from "./components/ActivityList";

export default function HistoryPage() {
  return (
    <div
      className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-10"
      style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="font-display text-4xl text-white sm:text-[44px]">History</h1>
          <p className="text-[15px] text-gray-400">
            Everything that moved in or out of your wallet, read from Solana. A payment shows as complete only
            after Solana confirms it.
          </p>
        </header>
        <ActivityList />
      </div>
    </div>
  );
}
