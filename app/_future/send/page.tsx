"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SendForm        from "./components/SendForm";
import ReceivePanel    from "./components/ReceivePanel";
import TransferDetails from "./components/TransferDetails";
import ReceiveWarning  from "./components/ReceiveWarning";

type Tab = "Send" | "Receive";

// Direction: Send→Receive slides right-to-left, Receive→Send slides left-to-right
const panelVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir * 24,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -24,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function SendPage() {
  const [tab, setTab]       = useState<Tab>("Send");
  const [amount, setAmount] = useState("");

  // +1 → going right (Send→Receive), -1 → going left (Receive→Send)
  const direction = tab === "Receive" ? 1 : -1;

  const switchTab = (t: Tab) => setTab(t);

  return (
    <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8" style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Send</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Send USDC on Base to a contact or any wallet address.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-6 border-b border-white/10 pb-0">
          {(["Send", "Receive"] as Tab[]).map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="relative pb-3 text-base font-semibold transition-colors duration-200"
                style={{ color: isActive ? "#ffffff" : "#6b7280" }}
              >
                {t}
                {isActive && (
                  <motion.span
                    layoutId="send-tab-underline"
                    className="absolute bottom-0 left-0 w-full h-[2px] rounded-full"
                    style={{ backgroundColor: "#FFA15A" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Two-column layout — overflow hidden clips the sliding panels */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start overflow-hidden">

          {/* Left: animated main panel */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={tab}
              custom={direction}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {tab === "Send"
                ? <SendForm amount={amount} setAmount={setAmount} />
                : <ReceivePanel />
              }
            </motion.div>
          </AnimatePresence>

          {/* Right: animated context panel */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${tab}-sidebar`}
              custom={direction}
              variants={panelVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="sticky top-6 self-start"
            >
              {tab === "Send"
                ? <TransferDetails />
                : <ReceiveWarning />
              }
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
