"use client";

import { useCallback, useEffect, useState } from "react";
import { describeError } from "./errors";
import { ApiError } from "./api";
import { hasPending, mergeFirstPage, mergePages, type HistoryItem, type HistoryPage } from "./history";
import { useAuth } from "./use-auth";

const PAGE_SIZE = 20;
const POLL_MS = 5000;

type State =
  | { status: "loading" }
  | { status: "creating-wallet" }
  | { status: "error"; message: string }
  | { status: "ready"; items: HistoryItem[]; nextCursor: string | null };

const WALLET_RETRY_MS = 2000;
const WALLET_MAX_RETRIES = 10;

/**
 * The signed-in user's activity, newest first. Loads one page at a time, and
 * quietly refreshes every few seconds while any payment is still pending so it
 * flips to Complete or Failed on its own.
 */
export function useHistory() {
  const { ready, authenticated, callBackend } = useAuth();
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const pending = state.status === "ready" && hasPending(state.items);

  // First page, and every manual refresh.
  useEffect(() => {
    if (!ready || !authenticated) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let retries = 0;

    const load = async () => {
      try {
        const page = await callBackend<HistoryPage>(`/wallet/transactions?limit=${PAGE_SIZE}`);
        if (cancelled) return;
        setState((current) =>
          current.status === "ready"
            ? { status: "ready", items: mergeFirstPage(current.items, page.items), nextCursor: current.nextCursor }
            : { status: "ready", items: page.items, nextCursor: page.next_cursor },
        );
        setRefreshing(false);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ApiError && error.code === "AUTH_NOT_READY") return;

        if (error instanceof ApiError && error.code === "WALLET_NOT_READY" && retries < WALLET_MAX_RETRIES) {
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
  }, [ready, authenticated, callBackend, version]);

  // Quiet refresh while something is pending.
  useEffect(() => {
    if (!pending) return;
    const interval = setInterval(() => setVersion((v) => v + 1), POLL_MS);
    return () => clearInterval(interval);
  }, [pending]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setVersion((v) => v + 1);
  }, []);

  const loadMore = useCallback(async () => {
    if (state.status !== "ready" || !state.nextCursor || loadingMore) return;
    setLoadingMore(true);
    setMoreError(null);
    try {
      const page = await callBackend<HistoryPage>(
        `/wallet/transactions?limit=${PAGE_SIZE}&before=${encodeURIComponent(state.nextCursor)}`,
      );
      setState((current) =>
        current.status === "ready"
          ? { status: "ready", items: mergePages(current.items, page.items), nextCursor: page.next_cursor }
          : current,
      );
    } catch (error) {
      setMoreError(describeError(error));
    } finally {
      setLoadingMore(false);
    }
  }, [state, callBackend, loadingMore]);

  return { state, refreshing, loadingMore, moreError, refresh, loadMore };
}
