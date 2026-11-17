// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ApiError } from "./api";
import type { HistoryItem } from "./history";

const callBackend = vi.fn();
let auth = { ready: true, authenticated: true, callBackend };
vi.mock("./use-auth", () => ({ useAuth: () => auth }));

import { useHistory } from "./use-history";

const item = (id: string, over: Partial<HistoryItem> = {}): HistoryItem => ({
  id,
  signature: id,
  status: "confirmed",
  direction: "received",
  amount: "1000000",
  counterparty: "abc",
  timestamp: 1,
  ...over,
});

const page = (items: HistoryItem[], next_cursor: string | null = null) => ({ items, next_cursor });
const advance = (ms: number) => act(async () => void (await vi.advanceTimersByTimeAsync(ms)));

beforeEach(() => {
  vi.useFakeTimers();
  callBackend.mockReset();
  auth = { ready: true, authenticated: true, callBackend };
});
afterEach(() => vi.useRealTimers());

describe("useHistory", () => {
  it("loads the first page", async () => {
    callBackend.mockResolvedValue(page([item("a")], "cursor-1"));
    const { result } = renderHook(() => useHistory());
    expect(result.current.state.status).toBe("loading");
    await advance(0);
    expect(result.current.state).toMatchObject({ status: "ready", items: [{ id: "a" }], nextCursor: "cursor-1" });
    expect(callBackend).toHaveBeenCalledWith("/wallet/transactions?limit=20");
  });

  it("does nothing while signed out", async () => {
    auth = { ready: true, authenticated: false, callBackend };
    renderHook(() => useHistory());
    await advance(0);
    expect(callBackend).not.toHaveBeenCalled();
  });

  it("waits for a new wallet instead of failing", async () => {
    callBackend
      .mockRejectedValueOnce(new ApiError("x", "WALLET_NOT_READY", 403))
      .mockResolvedValueOnce(page([item("a")]));
    const { result } = renderHook(() => useHistory());
    await advance(0);
    expect(result.current.state.status).toBe("creating-wallet");
    await advance(2000);
    expect(result.current.state.status).toBe("ready");
  });

  it("shows a friendly error and recovers on refresh", async () => {
    callBackend.mockRejectedValueOnce(new ApiError("RPC down", "EXTERNAL_SERVICE_ERROR", 502));
    const { result } = renderHook(() => useHistory());
    await advance(0);
    expect(result.current.state).toMatchObject({ status: "error", message: expect.stringContaining("Solana") });

    callBackend.mockResolvedValueOnce(page([item("a")]));
    act(() => result.current.refresh());
    await advance(0);
    expect(result.current.state.status).toBe("ready");
  });

  describe("load more", () => {
    it("appends the next page using the cursor", async () => {
      callBackend.mockResolvedValueOnce(page([item("a")], "c1")).mockResolvedValueOnce(page([item("b")], null));
      const { result } = renderHook(() => useHistory());
      await advance(0);
      await act(async () => void (await result.current.loadMore()));
      expect(callBackend).toHaveBeenLastCalledWith("/wallet/transactions?limit=20&before=c1");
      expect(result.current.state).toMatchObject({ items: [{ id: "a" }, { id: "b" }], nextCursor: null });
    });

    it("does nothing at the end of the list", async () => {
      callBackend.mockResolvedValue(page([item("a")], null));
      const { result } = renderHook(() => useHistory());
      await advance(0);
      callBackend.mockClear();
      await act(async () => void (await result.current.loadMore()));
      expect(callBackend).not.toHaveBeenCalled();
    });

    it("keeps the list and shows a message if the next page fails", async () => {
      callBackend.mockResolvedValueOnce(page([item("a")], "c1")).mockRejectedValueOnce(new ApiError("x", "NETWORK_ERROR"));
      const { result } = renderHook(() => useHistory());
      await advance(0);
      await act(async () => void (await result.current.loadMore()));
      expect(result.current.moreError).toBeTruthy();
      expect(result.current.state).toMatchObject({ status: "ready", items: [{ id: "a" }] });
    });
  });

  describe("pending payments", () => {
    it("refreshes every 5 seconds until nothing is pending", async () => {
      const pending = item("send-1", { status: "pending", signature: "sig1", direction: "sent" });
      const done = item("sig1", { status: "confirmed", signature: "sig1", direction: "sent" });
      callBackend
        .mockResolvedValueOnce(page([pending]))
        .mockResolvedValueOnce(page([pending]))
        .mockResolvedValueOnce(page([done]));
      const { result } = renderHook(() => useHistory());
      await advance(0);
      expect(callBackend).toHaveBeenCalledTimes(1);

      await advance(5000);
      expect(callBackend).toHaveBeenCalledTimes(2);
      await advance(5000);
      expect(callBackend).toHaveBeenCalledTimes(3);
      expect(result.current.state).toMatchObject({ items: [{ id: "sig1", status: "confirmed" }] });

      await advance(30_000);
      expect(callBackend).toHaveBeenCalledTimes(3); // stopped polling
    });

    it("does not poll when nothing is pending", async () => {
      callBackend.mockResolvedValue(page([item("a")]));
      renderHook(() => useHistory());
      await advance(0);
      await advance(30_000);
      expect(callBackend).toHaveBeenCalledTimes(1);
    });

    it("keeps older pages that were loaded while refreshing", async () => {
      const pending = item("p", { status: "pending", signature: "sp" });
      callBackend
        .mockResolvedValueOnce(page([pending, item("a")], "c1"))
        .mockResolvedValueOnce(page([item("b")], null)) // load more
        .mockResolvedValueOnce(page([item("sp", { signature: "sp" }), item("a")], "c1"));
      const { result } = renderHook(() => useHistory());
      await advance(0);
      await act(async () => void (await result.current.loadMore()));
      await advance(5000);
      const ids = (result.current.state as { items: HistoryItem[] }).items.map((i) => i.id);
      expect(ids).toEqual(["sp", "a", "b"]);
    });
  });
});
