"use client";

import { useState } from "react";
import AmountInput from "./components/AmountInput";
import PayWith     from "./components/PayWith";
import Summary     from "./components/Summary";

export default function AddMoneyPage() {
  const [amount,   setAmount]   = useState(0);
  const [payMethod, setPayMethod] = useState("apple");

  return (
    <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 10 }}>
      <div className="max-w-6xl lg:max-w-7xl mx-auto flex flex-col gap-2 tracking-wide">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Add money</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Turn dollars into USDC on Base. Pay with Apple Pay, Google Pay, a card or your bank.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3 items-start">
          {/* Left column: How much? + Pay with */}
          <div className="flex flex-col gap-3">
            <AmountInput amount={amount} setAmount={setAmount} />
            <PayWith selected={payMethod} setSelected={setPayMethod} />
          </div>

          {/* Right column: Summary — sticky so it follows the left column height */}
          <div className="sticky top-6 self-start">
            <Summary amount={amount} />
          </div>
        </div>
      </div>
    </div>
  );
}
