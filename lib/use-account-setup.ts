"use client";

import { useEffect, useState } from "react";
import { ApiError } from "./api";
import { useAuth } from "./use-auth";

/**
 * Whether the user's USDC account exists on Solana, so a first deposit from
 * any wallet just works.
 *
 *   idle         not asked yet
 *   creating     Kenfi is creating it and waiting for Solana to confirm
 *   ready        it exists
 *   unavailable  it could not be done right now (the app carries on as usual)
 */
export type AccountSetupStatus = "idle" | "creating" | "ready" | "unavailable";

const POLL_MS = 3000;
const MAX_POLLS = 8;
const WALLET_RETRY_MS = 2000;
const WALLET_MAX_RETRIES = 10;

/**
 * Asks the backend, once per sign-in, to make sure the user's USDC account
 * exists. This is housekeeping: it never shows an error and never blocks
 * anything. If it fails for any reason the status is simply "unavailable".
 */
export function useAccountSetup(): AccountSetupStatus {
  const { ready, authenticated, callBackend } = useAuth();
  const [status, setStatus] = useState<AccountSetupStatus>("idle");

  useEffect(() => {
    if (!ready || !authenticated) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let walletRetries = 0;
    let polls = 0;

    const run = async () => {
      try {
        const { status: next } = await callBackend<{ status: "ready" | "creating" | "unavailable" }>(
          "/wallet/setup",
          { method: "POST" },
        );
        if (cancelled) return;
        setStatus(next);

        if (next === "creating" && polls < MAX_POLLS) {
          polls += 1;
          timer = setTimeout(run, POLL_MS);
        }
      } catch (error) {
        if (cancelled) return;

        // Tokens arrive a moment after sign-in; callBackend changes when they
        // do, which re-runs this effect.
        if (error instanceof ApiError && error.code === "AUTH_NOT_READY") return;

        // The wallet is created right after sign-in. Wait for it.
        if (error instanceof ApiError && error.code === "WALLET_NOT_READY" && walletRetries < WALLET_MAX_RETRIES) {
          walletRetries += 1;
          timer = setTimeout(run, WALLET_RETRY_MS);
          return;
        }

        // Anything else: not worth bothering the user about.
        setStatus("unavailable");
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [ready, authenticated, callBackend]);

  return status;
}
