import PaymentDetails from "./components/PaymentDetails";
import SendFlow from "./components/SendFlow";

export default function SendPage() {
  return (
    <div
      className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-10"
      style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="font-display text-4xl text-white sm:text-[44px]">Send</h1>
          <p className="text-[15px] text-gray-400">
            Send USDC to any Solana wallet. You check everything before it goes.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <SendFlow />
          <PaymentDetails />
        </div>
      </div>
    </div>
  );
}
