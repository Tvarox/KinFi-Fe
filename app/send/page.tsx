import PaymentDetails from "./components/PaymentDetails";
import SendFlow from "./components/SendFlow";

export default function SendPage() {
  return (
    <div
      className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
      style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Send</h1>
          <p className="text-sm text-gray-400 mt-1.5">Send USDC on Solana to any wallet address.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
          <SendFlow />
          <PaymentDetails />
        </div>
      </div>
    </div>
  );
}
