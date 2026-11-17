// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { ApiError } from "./api";

const callBackend = vi.fn();
let auth = { ready: true, authenticated: true, callBackend };

vi.mock("./use-auth", () => ({ useAuth: () => auth }));

import { useBackendQuery } from "./use-backend-query";

beforeEach(() => {
  callBackend.mockReset();
  auth = { ready: true, authenticated: true, callBackend };
});

afterEach(() => vi.useRealTimers());

describe("useBackendQuery", () => {
  it("loads data for a signed-in user", async () => {
    callBackend.mockResolvedValue({ usdc: "5" });
    const { result } = renderHook(() => useBackendQuery<{ usdc: string }>("/wallet/balances"));
    expect(result.current.state.status).toBe("loading");
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    expect(result.current.state).toMatchObject({ status: "ready", data: { usdc: "5" } });
    expect(callBackend).toHaveBeenCalledWith("/wallet/balances");
  });

  it("does not call the backend while signed out", () => {
    auth = { ready: true, authenticated: false, callBackend };
    renderHook(() => useBackendQuery("/wallet/balances"));
    expect(callBackend).not.toHaveBeenCalled();
  });

  it("does not call the backend before Privy is ready", () => {
    auth = { ready: false, authenticated: false, callBackend };
    renderHook(() => useBackendQuery("/wallet/balances"));
    expect(callBackend).not.toHaveBeenCalled();
  });

  it("waits and retries while the wallet is being created", async () => {
    vi.useFakeTimers();
    callBackend
      .mockRejectedValueOnce(new ApiError("not ready", "WALLET_NOT_READY", 403))
      .mockResolvedValueOnce({ address: "abc" });

    const { result } = renderHook(() => useBackendQuery<{ address: string }>("/wallet/address"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(result.current.state.status).toBe("creating-wallet");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });
    expect(result.current.state).toMatchObject({ status: "ready", data: { address: "abc" } });
    expect(callBackend).toHaveBeenCalledTimes(2);
  });

  it("gives up with an error if the wallet never appears", async () => {
    vi.useFakeTimers();
    callBackend.mockRejectedValue(new ApiError("not ready", "WALLET_NOT_READY", 403));

    const { result } = renderHook(() => useBackendQuery("/wallet/address"));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000 * 12);
    });
    expect(result.current.state.status).toBe("error");
    // First attempt plus 10 retries, then it stops.
    expect(callBackend).toHaveBeenCalledTimes(11);
  });

  it("stays loading, with no error, while sign-in tokens are still arriving", async () => {
    callBackend.mockRejectedValue(new ApiError("Signing you in...", "AUTH_NOT_READY"));
    const { result } = renderHook(() => useBackendQuery("/wallet/balances"));
    await waitFor(() => expect(callBackend).toHaveBeenCalled());
    expect(result.current.state.status).toBe("loading");
  });

  it("shows a friendly message on failure and recovers on refresh", async () => {
    callBackend.mockRejectedValueOnce(new ApiError("Solana RPC: x", "EXTERNAL_SERVICE_ERROR", 502));
    const { result } = renderHook(() => useBackendQuery<{ usdc: string }>("/wallet/balances"));
    await waitFor(() => expect(result.current.state.status).toBe("error"));
    expect(result.current.state).toMatchObject({ message: expect.stringMatching(/Solana/) });

    callBackend.mockResolvedValueOnce({ usdc: "7" });
    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.state.status).toBe("ready"));
    expect(result.current.state).toMatchObject({ data: { usdc: "7" } });
  });

  it("keeps the old data on screen while refreshing", async () => {
    callBackend.mockResolvedValueOnce({ usdc: "5" });
    const { result } = renderHook(() => useBackendQuery<{ usdc: string }>("/wallet/balances"));
    await waitFor(() => expect(result.current.state.status).toBe("ready"));

    let release: (v: unknown) => void = () => {};
    callBackend.mockReturnValueOnce(new Promise((resolve) => (release = resolve)));
    act(() => result.current.refresh());

    expect(result.current.refreshing).toBe(true);
    expect(result.current.state).toMatchObject({ status: "ready", data: { usdc: "5" } });

    await act(async () => release({ usdc: "9" }));
    await waitFor(() => expect(result.current.refreshing).toBe(false));
    expect(result.current.state).toMatchObject({ data: { usdc: "9" } });
  });
});
