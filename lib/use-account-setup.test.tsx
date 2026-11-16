// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ApiError } from "./api";

const callBackend = vi.fn();
let auth = { ready: true, authenticated: true, callBackend };
vi.mock("./use-auth", () => ({ useAuth: () => auth }));

import { useAccountSetup } from "./use-account-setup";

const advance = (ms: number) => act(async () => void (await vi.advanceTimersByTimeAsync(ms)));

beforeEach(() => {
  vi.useFakeTimers();
  callBackend.mockReset();
  auth = { ready: true, authenticated: true, callBackend };
});
afterEach(() => vi.useRealTimers());

describe("useAccountSetup", () => {
  it("asks the backend once and reports ready", async () => {
    callBackend.mockResolvedValue({ status: "ready" });
    const { result } = renderHook(() => useAccountSetup());
    expect(result.current).toBe("idle");
    await advance(0);
    expect(result.current).toBe("ready");
    expect(callBackend).toHaveBeenCalledTimes(1);
    expect(callBackend).toHaveBeenCalledWith("/wallet/setup", { method: "POST" });

    await advance(60_000);
    expect(callBackend).toHaveBeenCalledTimes(1); // no repeat once it is done
  });

  it("does nothing while signed out", async () => {
    auth = { ready: true, authenticated: false, callBackend };
    renderHook(() => useAccountSetup());
    await advance(0);
    expect(callBackend).not.toHaveBeenCalled();
  });

  it("keeps checking while Solana confirms, then reports ready", async () => {
    callBackend
      .mockResolvedValueOnce({ status: "creating" })
      .mockResolvedValueOnce({ status: "creating" })
      .mockResolvedValueOnce({ status: "ready" });
    const { result } = renderHook(() => useAccountSetup());
    await advance(0);
    expect(result.current).toBe("creating");
    await advance(3000);
    expect(result.current).toBe("creating");
    await advance(3000);
    expect(result.current).toBe("ready");
    expect(callBackend).toHaveBeenCalledTimes(3);
  });

  it("stops checking after a while rather than asking forever", async () => {
    callBackend.mockResolvedValue({ status: "creating" });
    const { result } = renderHook(() => useAccountSetup());
    await advance(60_000);
    expect(result.current).toBe("creating");
    expect(callBackend.mock.calls.length).toBeLessThanOrEqual(9);
    const calls = callBackend.mock.calls.length;
    await advance(60_000);
    expect(callBackend).toHaveBeenCalledTimes(calls);
  });

  it("does not retry when the backend says it cannot do it", async () => {
    callBackend.mockResolvedValue({ status: "unavailable" });
    const { result } = renderHook(() => useAccountSetup());
    await advance(60_000);
    expect(result.current).toBe("unavailable");
    expect(callBackend).toHaveBeenCalledTimes(1);
  });

  it("waits for a brand-new wallet instead of giving up", async () => {
    callBackend
      .mockRejectedValueOnce(new ApiError("x", "WALLET_NOT_READY", 403))
      .mockResolvedValueOnce({ status: "ready" });
    const { result } = renderHook(() => useAccountSetup());
    await advance(0);
    expect(result.current).toBe("idle");
    await advance(2000);
    expect(result.current).toBe("ready");
  });

  it("waits quietly for sign-in tokens", async () => {
    callBackend.mockRejectedValue(new ApiError("Signing you in...", "AUTH_NOT_READY"));
    const { result } = renderHook(() => useAccountSetup());
    await advance(10_000);
    expect(result.current).toBe("idle");
    expect(callBackend).toHaveBeenCalledTimes(1);
  });

  it("never throws or shows an error if the call fails: it is just unavailable", async () => {
    callBackend.mockRejectedValue(new ApiError("Cannot reach Kenfi right now.", "NETWORK_ERROR"));
    const { result } = renderHook(() => useAccountSetup());
    await advance(0);
    expect(result.current).toBe("unavailable");
  });

  it("stops asking when the user signs out mid-way", async () => {
    callBackend.mockResolvedValue({ status: "creating" });
    const { unmount } = renderHook(() => useAccountSetup());
    await advance(0);
    unmount();
    await advance(60_000);
    expect(callBackend).toHaveBeenCalledTimes(1);
  });
});
