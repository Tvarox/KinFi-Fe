"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "./api";
import { describeError } from "./errors";
import { useAuth } from "./use-auth";

export type QueryState<T> =
  | { status: "loading" }
  | { status: "creating-wallet" }
  | { status: "ready"; data: T; fetchedAt: number }
  | { status: "error"; message: string };

// Privy creates the Solana wallet right after first sign-in, so for a brief
// moment the backend can answer WALLET_NOT_READY. Wait for it instead of
// showing an error.
const WALLET_RETRY_MS = 2000;
const WALLET_MAX_RETRIES = 10;

/**
 * Load a protected backend route for the signed-in user and keep the result.
 * `refresh()` reloads while keeping the previous data on screen.
 *
 * State is not reset when the user changes; AuthGate remounts the page tree
 * (keyed by user id) so one user's data can never show for another.
 */
export function useBackendQuery<T>(path: string) {
  const { ready, authenticated, callBackend } = useAuth();
  const [state, setState] = useState<QueryState<T>>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!ready || !authenticated) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let retries = 0;

    const load = async () => {
      try {
        const data = await callBackend<T>(path);
        if (cancelled) return;
        setState({ status: "ready", data, fetchedAt: Date.now() });
        setRefreshing(false);
      } catch (error) {
        if (cancelled) return;

        // Tokens arrive a moment after sign-in. callBackend changes identity
        // when they do, which re-runs this effect, so just wait.
        if (error instanceof ApiError && error.code === "AUTH_NOT_READY") return;

        if (
          error instanceof ApiError &&
          error.code === "WALLET_NOT_READY" &&
          retries < WALLET_MAX_RETRIES
        ) {
          retries += 1;
          setState({ status: "creating-wallet" });
          timer = setTimeout(load, WALLET_RETRY_MS);
          return;
        }

        setState({ status: "error", message: describeError(error) });
        setRefreshing(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [ready, authenticated, callBackend, path, version]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setVersion((v) => v + 1);
  }, []);

  return { state, refreshing, refresh };
}

export interface WalletAddress {
  address: string;
  network: "solana";
  asset: "USDC";
}

export interface UsdcBalance {
  address: string;
  network: "solana";
  /** Integer string in base units (6 decimals). */
  usdc: string;
  decimals: number;
  updated_at: string;
}

export const useWalletAddress = () =>
  useBackendQuery<WalletAddress>("/wallet/address");

export const useUsdcBalance = () =>
  useBackendQuery<UsdcBalance>("/wallet/balances");
