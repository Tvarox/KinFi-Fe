import PaymentDetails from "./components/PaymentDetails";
import SendFlow from "./components/SendFlow";

export default function SendPage() {
  return (
    <div
      className="flex-1 px-4 py-4 max-sm:px-2 max-sm:py-2 sm:px-6 sm:py-5 lg:px-12 lg:py-5"
      style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6 max-sm:gap-3">
        <header className="flex flex-col gap-1">
          <h1 className="font-cinzel text-4xl font-medium text-white max-sm:text-3xl sm:text-[44px]">Send</h1>
          <p className="font-cormorant text-[19px] text-white max-sm:text-base">
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
