// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";

const createWallet = vi.fn();
let privy = { ready: true, authenticated: true };
let solana = { ready: true, wallets: [] as unknown[] };

vi.mock("@privy-io/react-auth", () => ({ usePrivy: () => privy }));
vi.mock("@privy-io/react-auth/solana", () => ({
  useWallets: () => solana,
  useCreateWallet: () => ({ createWallet }),
}));

import EnsureSolanaWallet from "./EnsureSolanaWallet";

async function wait(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  createWallet.mockReset();
  createWallet.mockResolvedValue({});
  privy = { ready: true, authenticated: true };
  solana = { ready: true, wallets: [] };
});

afterEach(() => vi.useRealTimers());

describe("EnsureSolanaWallet", () => {
  it("creates a wallet if there is still none after the grace period", async () => {
    render(<EnsureSolanaWallet />);
    await wait(2900);
    expect(createWallet).not.toHaveBeenCalled();
    await wait(200);
    expect(createWallet).toHaveBeenCalledTimes(1);
  });

  it("does nothing when the user already has a Solana wallet", async () => {
    solana = { ready: true, wallets: [{ address: "abc" }] };
    render(<EnsureSolanaWallet />);
    await wait(10000);
    expect(createWallet).not.toHaveBeenCalled();
  });

  it("does nothing when signed out", async () => {
    privy = { ready: true, authenticated: false };
    render(<EnsureSolanaWallet />);
    await wait(10000);
    expect(createWallet).not.toHaveBeenCalled();
  });

  it("waits for the wallet list to load before deciding", async () => {
    solana = { ready: false, wallets: [] };
    render(<EnsureSolanaWallet />);
    await wait(10000);
    expect(createWallet).not.toHaveBeenCalled();
  });

  it("skips creation if Privy's own auto-create lands during the grace period", async () => {
    const { rerender } = render(<EnsureSolanaWallet />);
    await wait(1500);
    solana = { ready: true, wallets: [{ address: "abc" }] };
    rerender(<EnsureSolanaWallet />);
    await wait(10000);
    expect(createWallet).not.toHaveBeenCalled();
  });

  it("tries only once, even if creation fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    createWallet.mockRejectedValue(new Error("boom"));
    const { rerender } = render(<EnsureSolanaWallet />);
    await wait(3100);
    rerender(<EnsureSolanaWallet />);
    await wait(10000);
    expect(createWallet).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
