"use client";

import { createContext, useContext } from "react";
import { useAccountSetup, type AccountSetupStatus } from "@/lib/use-account-setup";

const AccountSetupContext = createContext<AccountSetupStatus>("idle");

/**
 * Starts the one-time USDC account setup after sign-in and shares how it is
 * going, so a screen can react (for example Receive). Place it inside the
 * signed-in part of the app only.
 */
export default function AccountSetupProvider({ children }: { children: React.ReactNode }) {
  const status = useAccountSetup();
  return <AccountSetupContext.Provider value={status}>{children}</AccountSetupContext.Provider>;
}

/** "idle" outside the provider, so a screen never needs it to render. */
export const useAccountSetupStatus = () => useContext(AccountSetupContext);
