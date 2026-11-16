// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import BalanceHero from "./BalanceHero";
import type { QueryState, UsdcBalance } from "@/lib/use-backend-query";

afterEach(cleanup);

const ready = (usdc: string): QueryState<UsdcBalance> => ({
  status: "ready",
  fetchedAt: 0,
  data: { address: "7xKXq2NfJd8mWc5RtLp3YvBzHa4uEoGk6SiTnV1Q9fQ2", usdc, updated_at: "2026-11-17T10:42:00Z" } as UsdcBalance,
});

describe("BalanceHero", () => {
  it("shows the balance as dollars", () => {
    render(<BalanceHero state={ready("124500000")} refreshing={false} onRefresh={() => {}} />);
    expect(screen.getByText("$124.50")).toBeInTheDocument();
    expect(screen.getByText("USDC on Solana")).toBeInTheDocument();
  });

  it("shows zero for an empty wallet, not an error", () => {
    render(<BalanceHero state={ready("0")} refreshing={false} onRefresh={() => {}} />);
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("links to Send and Receive", () => {
    render(<BalanceHero state={ready("1000000")} refreshing={false} onRefresh={() => {}} />);
    expect(screen.getByRole("link", { name: "Send" })).toHaveAttribute("href", "/send");
    expect(screen.getByRole("link", { name: "Receive" })).toHaveAttribute("href", "/receive");
  });

  it("refreshes when the refresh button is pressed", () => {
    const onRefresh = vi.fn();
    render(<BalanceHero state={ready("1000000")} refreshing={false} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole("button", { name: "Refresh balance" }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("disables refresh while refreshing", () => {
    render(<BalanceHero state={ready("1000000")} refreshing onRefresh={() => {}} />);
    expect(screen.getByRole("button", { name: "Refreshing balance" })).toBeDisabled();
  });

  it("shows a loading state without a made-up amount", () => {
    render(<BalanceHero state={{ status: "loading" }} refreshing={false} onRefresh={() => {}} />);
    expect(screen.getByText("Loading your balance...")).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });

  it("says when the wallet is being set up", () => {
    render(<BalanceHero state={{ status: "creating-wallet" }} refreshing={false} onRefresh={() => {}} />);
    expect(screen.getByText("Setting up your wallet...")).toBeInTheDocument();
  });

  it("shows a calm error with a way to retry, and no amount", () => {
    const onRefresh = vi.fn();
    render(
      <BalanceHero
        state={{ status: "error", message: "Cannot reach Kenfi right now." }}
        refreshing={false}
        onRefresh={onRefresh}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("We can't load your balance");
    expect(screen.getByRole("alert")).toHaveTextContent("Cannot reach Kenfi right now.");
    expect(screen.getByRole("alert")).toHaveTextContent("Your money is not affected.");
    expect(screen.queryByText("Unavailable")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
