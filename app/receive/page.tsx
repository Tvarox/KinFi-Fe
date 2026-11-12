import ReceivePanel from "./components/ReceivePanel";
import ReceiveWarning from "./components/ReceiveWarning";

export default function ReceivePage() {
  return (
    <div
      className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Receive</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Share your address to receive USDC on Solana.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
          <ReceivePanel />
          <ReceiveWarning />
        </div>
      </div>
    </div>
  );
}
