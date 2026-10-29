"use client";

import { useState } from "react";
import AmountInput from "./components/AmountInput";
import PayWith     from "./components/PayWith";
import Summary     from "./components/Summary";

export default function AddMoneyPage() {
  const [amount,   setAmount]   = useState(0);
  const [payMethod, setPayMethod] = useState("apple");

  return (
    <div className="flex-1 px-8 py-8" style={{ backgroundColor: "#131416" }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Add money</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Turn dollars into USDC on Base. Pay with Apple Pay, Google Pay, a card or your bank.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
          {/* Left column: How much? + Pay with */}
          <div className="flex flex-col gap-5">
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
