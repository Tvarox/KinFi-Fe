import ReceivePanel from "./components/ReceivePanel";
import ReceiveWarning from "./components/ReceiveWarning";

export default function ReceivePage() {
  return (
    <div
      className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-10"
      style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="font-cinzel text-4xl text-white sm:text-[44px]">Receive</h1>
          <p className="font-cormorant text-[19px] text-gray-400">Share this address to get paid in USDC on Solana.</p>
        </header>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <ReceivePanel />
          <ReceiveWarning />
        </div>
      </div>
    </div>
  );
}
