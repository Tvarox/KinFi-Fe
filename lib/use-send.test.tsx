// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ApiError } from "./api";

const callBackend = vi.fn();
const signAndSendTransaction = vi.fn();
let wallets: unknown[] = [{ address: "wallet-1" }];

vi.mock("./use-auth", () => ({ useAuth: () => ({ callBackend }) }));
vi.mock("@privy-io/react-auth/solana", () => ({
  useWallets: () => ({ ready: true, wallets }),
  useSignAndSendTransaction: () => ({ signAndSendTransaction }),
}));

import { useSend } from "./use-send";

const NOW = new Date("2026-11-12T12:00:00Z").getTime();
const prepared = (over: Record<string, unknown> = {}) => ({
  send_id: "send-1",
  transaction: "AQID",
  from_address: "FROM",
  to_address: "TO",
  amount: "10250000",
  network: "solana",
  expires_at: new Date(NOW + 120_000).toISOString(),
  ...over,
});

const SIGNATURE_BYTES = new Uint8Array(64).fill(1);

/** Route backend calls by path and method. */
function backend(handlers: {
  prepare?: () => unknown;
  submitted?: () => unknown;
  status?: () => unknown;
}) {
  callBackend.mockImplementation(async (path: string, options?: { method?: string }) => {
    if (path === "/wallet/send/prepare") return (handlers.prepare ?? (() => prepared()))();
    if (path.endsWith("/submitted")) return (handlers.submitted ?? (() => ({ status: "submitted" })))();
    if (options?.method === undefined) return (handlers.status ?? (() => ({ status: "submitted" })))();
    throw new Error(`unexpected call ${path}`);
  });
}

const advance = (ms: number) => act(async () => void (await vi.advanceTimersByTimeAsync(ms)));

async function toReview(result: { current: ReturnType<typeof useSend> }) {
  await act(async () => void (await result.current.prepare("TO", "10.25")));
  expect(result.current.state.step).toBe("review");
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  callBackend.mockReset();
  signAndSendTransaction.mockReset();
  signAndSendTransaction.mockResolvedValue({ signature: SIGNATURE_BYTES });
  wallets = [{ address: "wallet-1" }];
});

afterEach(() => vi.useRealTimers());

describe("useSend: prepare", () => {
  it("goes from the form to the review screen", async () => {
    backend({});
    const { result } = renderHook(() => useSend());
    expect(result.current.state).toEqual({ step: "form", error: null });
    await toReview(result);
    expect(callBackend).toHaveBeenCalledWith("/wallet/send/prepare", {
      method: "POST",
      body: { to_address: "TO", amount: "10.25" },
    });
  });

  it("trims the address before sending it", async () => {
    backend({});
    const { result } = renderHook(() => useSend());
    await act(async () => void (await result.current.prepare("  TO \n", "1")));
    expect(callBackend.mock.calls[0][1].body.to_address).toBe("TO");
  });

  it("shows the backend's message when the payment is refused", async () => {
    backend({
      prepare: () => {
        throw new ApiError("Your daily limit is $200.", "LIMIT_EXCEEDED_DAILY", 422);
      },
    });
    const { result } = renderHook(() => useSend());
    await act(async () => void (await result.current.prepare("TO", "10")));
    expect(result.current.state).toEqual({ step: "form", error: "Your daily limit is $200." });
  });

  it("shows a friendly message when the backend cannot be reached", async () => {
    backend({
      prepare: () => {
        throw new ApiError("Cannot reach Kenfi right now.", "NETWORK_ERROR");
      },
    });
    const { result } = renderHook(() => useSend());
    await act(async () => void (await result.current.prepare("TO", "10")));
    expect(result.current.state).toEqual({ step: "form", error: "Cannot reach Kenfi right now." });
  });

  it("goes back to the form from review", async () => {
    backend({});
    const { result } = renderHook(() => useSend());
    await toReview(result);
    act(() => result.current.back());
    expect(result.current.state).toEqual({ step: "form", error: null });
  });
});

describe("useSend: confirm", () => {
  it("signs with sponsorship, reports the signature, and waits for confirmation", async () => {
    let polls = 0;
    backend({ status: () => ({ status: ++polls < 3 ? "submitted" : "confirmed" }) });
    const { result } = renderHook(() => useSend());
    await toReview(result);

    await act(async () => void result.current.confirm());
    await advance(0);

    expect(signAndSendTransaction).toHaveBeenCalledWith({
      transaction: new Uint8Array([1, 2, 3]),
      wallet: { address: "wallet-1" },
      options: { sponsor: true },
    });
    expect(result.current.state.step).toBe("pending");

    // The backend was told the signature as base58 text.
    const submittedCall = callBackend.mock.calls.find((c) => String(c[0]).endsWith("/submitted"))!;
    expect(submittedCall[1].body.signature).toMatch(/^[1-9A-HJ-NP-Za-km-z]{60,90}$/);

    await advance(3000 * 3);
    expect(result.current.state.step).toBe("confirmed");
  });

  it("is never confirmed before the backend says so", async () => {
    backend({ status: () => ({ status: "submitted" }) });
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    await advance(3000 * 10);
    expect(result.current.state.step).toBe("pending");
  });

  it("reports a failed payment with the backend's reason", async () => {
    backend({ status: () => ({ status: "failed", error: "The payment failed on Solana." }) });
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    await advance(3000);
    expect(result.current.state).toMatchObject({ step: "failed", message: "The payment failed on Solana." });
  });

  it("keeps waiting through a failed status check", async () => {
    let calls = 0;
    backend({
      status: () => {
        if (++calls === 1) throw new ApiError("net", "NETWORK_ERROR");
        return { status: "confirmed" };
      },
    });
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    await advance(3000 * 2);
    expect(result.current.state.step).toBe("confirmed");
  });

  it("stops waiting after two minutes and points to History", async () => {
    backend({ status: () => ({ status: "submitted" }) });
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    await advance(3000 * 41);
    expect(result.current.state).toMatchObject({ step: "pending", note: expect.stringContaining("History") });
  });

  it("does not sign an expired payment", async () => {
    backend({ prepare: () => prepared({ expires_at: new Date(NOW + 1000).toISOString() }) });
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await advance(2000);
    await act(async () => void result.current.confirm());
    expect(signAndSendTransaction).not.toHaveBeenCalled();
    expect(result.current.state).toMatchObject({ step: "form", error: expect.stringContaining("expired") });
  });

  it("explains when there is no wallet", async () => {
    wallets = [];
    backend({});
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    expect(signAndSendTransaction).not.toHaveBeenCalled();
    expect(result.current.state).toMatchObject({ step: "failed", message: expect.stringContaining("not ready") });
  });

  it("returns to review, quietly, if the user cancels the signing prompt", async () => {
    signAndSendTransaction.mockRejectedValue(new Error("User rejected the request"));
    backend({});
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    expect(result.current.state.step).toBe("review");
    expect(callBackend.mock.calls.some((c) => String(c[0]).endsWith("/submitted"))).toBe(false);
  });

  it("fails clearly, and does not claim anything was sent, on any other signing error", async () => {
    signAndSendTransaction.mockRejectedValue(new Error("sponsorship is not enabled"));
    backend({});
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    expect(result.current.state).toMatchObject({ step: "failed", signature: null });
    expect((result.current.state as { message: string }).message).toContain("History");
    expect(JSON.stringify(result.current.state)).not.toContain("sponsorship");
  });

  it("signs only once if Confirm is clicked twice", async () => {
    backend({});
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => {
      void result.current.confirm();
      void result.current.confirm();
    });
    expect(signAndSendTransaction).toHaveBeenCalledTimes(1);
  });
});

describe("useSend: recording the signature", () => {
  it("retries, then carries on", async () => {
    let attempts = 0;
    backend({
      submitted: () => {
        if (++attempts < 3) throw new ApiError("net", "NETWORK_ERROR");
        return { status: "submitted" };
      },
      status: () => ({ status: "confirmed" }),
    });
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    await advance(1500 * 2 + 3000);
    expect(attempts).toBe(3);
    expect(result.current.state.step).toBe("confirmed");
  });

  it("never turns a recording failure into a failed payment", async () => {
    backend({
      submitted: () => {
        throw new ApiError("net", "NETWORK_ERROR");
      },
    });
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    await advance(1500 * 3);
    expect(result.current.state).toMatchObject({ step: "pending", note: expect.stringContaining("History") });
    callBackend.mockClear();
    await advance(3000 * 5);
    expect(callBackend).not.toHaveBeenCalled(); // no polling without a record
  });
});

describe("useSend: leaving", () => {
  it("ignores a late result after the user starts over", async () => {
    backend({ status: () => ({ status: "confirmed" }) });
    const { result } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    act(() => result.current.reset());
    await advance(3000 * 3);
    expect(result.current.state).toEqual({ step: "form", error: null });
  });

  it("stops polling when the page is closed", async () => {
    backend({ status: () => ({ status: "submitted" }) });
    const { result, unmount } = renderHook(() => useSend());
    await toReview(result);
    await act(async () => void result.current.confirm());
    unmount();
    callBackend.mockClear();
    await advance(3000 * 5);
    expect(callBackend).not.toHaveBeenCalled();
  });
});
