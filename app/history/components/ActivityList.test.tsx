// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import type { HistoryItem } from "@/lib/history";

const refresh = vi.fn();
const loadMore = vi.fn();
type HistoryHook = {
  state: unknown;
  refreshing: boolean;
  loadingMore: boolean;
  moreError: string | null;
  refresh: () => void;
  loadMore: () => void;
};
let hook: HistoryHook;

vi.mock("@/lib/use-history", () => ({ useHistory: () => hook }));

import ActivityList from "./ActivityList";

const ADDR = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const item = (over: Partial<HistoryItem>): HistoryItem => ({
  id: "a",
  signature: "SIG-A",
  status: "confirmed",
  direction: "received",
  amount: "5000000",
  counterparty: ADDR,
  timestamp: 1_700_000_000,
  ...over,
});

const ready = (items: HistoryItem[], nextCursor: string | null = null) => ({ status: "ready", items, nextCursor });

beforeEach(() => {
  refresh.mockReset();
  loadMore.mockReset();
  hook = { state: ready([]), refreshing: false, loadingMore: false, moreError: null, refresh, loadMore };
});
afterEach(cleanup);

describe("ActivityList", () => {
  it("shows loading and wallet-setup states", () => {
    hook.state = { status: "loading" };
    const { rerender } = render(<ActivityList />);
    expect(screen.getByText("Loading your activity...")).toBeInTheDocument();
    hook.state = { status: "creating-wallet" };
    rerender(<ActivityList />);
    expect(screen.getByText("Setting up your wallet...")).toBeInTheDocument();
  });

  it("shows an error with a way to retry", () => {
    hook.state = { status: "error", message: "Could not read from Solana. Please try again." };
    render(<ActivityList />);
    expect(screen.getByRole("alert")).toHaveTextContent("Could not read from Solana");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(refresh).toHaveBeenCalled();
  });

  it("explains an empty list", () => {
    render(<ActivityList />);
    expect(screen.getByText(/No activity yet/)).toBeInTheDocument();
  });

  it("shows amounts with the right sign, and names the other side", () => {
    hook.state = ready([
      item({ id: "r", direction: "received", amount: "5000000" }),
      item({ id: "s", direction: "sent", amount: "2500000", signature: "SIG-S" }),
    ]);
    render(<ActivityList />);
    expect(screen.getByText("Received from EPjF...Dt1v")).toBeInTheDocument();
    expect(screen.getByText("Sent to EPjF...Dt1v")).toBeInTheDocument();
    expect(screen.getByText("+$5.00")).toBeInTheDocument();
    expect(screen.getByText("-$2.50")).toBeInTheDocument();
  });

  it("labels every payment's state in plain words", () => {
    hook.state = ready([
      item({ id: "1", status: "pending", direction: "sent" }),
      item({ id: "2", status: "confirmed" }),
      item({ id: "3", status: "failed", direction: "sent" }),
    ]);
    render(<ActivityList />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("never shows a pending or failed payment as complete", () => {
    hook.state = ready([item({ id: "1", status: "pending", direction: "sent" })]);
    render(<ActivityList />);
    expect(screen.queryByText("Complete")).not.toBeInTheDocument();
  });

  it("strikes through a failed amount, and admits when an amount is unknown", () => {
    hook.state = ready([
      item({ id: "f", status: "failed", direction: "sent", amount: "1000000" }),
      item({ id: "u", status: "failed", direction: "sent", amount: null, counterparty: null, signature: "SIG-U" }),
    ]);
    render(<ActivityList />);
    expect(screen.getByText("-$1.00")).toHaveClass("line-through");
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    // No counterparty is known, so the row just says "Sent" (the tab also says Sent).
    expect(within(screen.getByRole("list")).getByText("Sent")).toBeInTheDocument();
  });

  it("links to the explorer safely, and only when there is a signature", () => {
    hook.state = ready([item({ id: "a", signature: "SIG-A" }), item({ id: "p", status: "pending", signature: null })]);
    render(<ActivityList />);
    const links = screen.getAllByRole("link", { name: /Solana Explorer/ });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://explorer.solana.com/tx/SIG-A");
    expect(links[0]).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("filters by Sent and Received", () => {
    hook.state = ready([
      item({ id: "r", direction: "received" }),
      item({ id: "s", direction: "sent", signature: "SIG-S" }),
    ]);
    render(<ActivityList />);
    fireEvent.click(screen.getByRole("tab", { name: "Sent" }));
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(1);
    expect(screen.queryByText(/Received from/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Received" }));
    expect(screen.queryByText(/Sent to/)).not.toBeInTheDocument();
    expect(screen.getByText(/Received from/)).toBeInTheDocument();
  });

  it("says so when a filter has nothing, without calling the whole list empty", () => {
    hook.state = ready([item({ id: "r", direction: "received" })]);
    render(<ActivityList />);
    fireEvent.click(screen.getByRole("tab", { name: "Sent" }));
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
    expect(screen.queryByText(/No activity yet/)).not.toBeInTheDocument();
  });

  it("offers Load more only when there is another page", () => {
    hook.state = ready([item({})], null);
    const { rerender } = render(<ActivityList />);
    expect(screen.queryByRole("button", { name: "Load more" })).not.toBeInTheDocument();

    hook.state = ready([item({})], "cursor");
    rerender(<ActivityList />);
    fireEvent.click(screen.getByRole("button", { name: "Load more" }));
    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it("shows a message if the next page failed, and keeps the list", () => {
    hook.state = ready([item({})], "cursor");
    hook.moreError = "Cannot reach Kinfi right now.";
    render(<ActivityList />);
    expect(screen.getByText("Cannot reach Kinfi right now.")).toBeInTheDocument();
    expect(screen.getByText(/Received from/)).toBeInTheDocument();
  });

  it("refreshes on demand", () => {
    render(<ActivityList />);
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    expect(refresh).toHaveBeenCalled();
  });
});
