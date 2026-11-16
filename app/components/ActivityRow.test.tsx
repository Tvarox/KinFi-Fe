// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ActivityRow from "./ActivityRow";
import type { HistoryItem } from "@/lib/history";

afterEach(cleanup);

const WHO = "3pQaWQeZ4Yq7m2uVJkR5cLx8dPaN3hFs6oEiGy1Lm4z";

const base: HistoryItem = {
  id: "1",
  signature: "5VERv8NMvzbJMEkV8xnrLkEaWRtSz9CosKDYjCJjBRnbJLgp8uirBgmQpjKhoR4tjF3ZpRzrFmBV6UjKdiSZkQUW",
  status: "confirmed",
  direction: "sent",
  amount: "12500000",
  counterparty: WHO,
  timestamp: 1_700_000_000,
};

const renderRow = (item: HistoryItem, props: { showExplorer?: boolean } = {}) =>
  render(
    <ul>
      <ActivityRow item={item} timeText="Today, 10:42 AM" {...props} />
    </ul>,
  );

describe("ActivityRow", () => {
  it("shows a sent payment as a minus amount", () => {
    renderRow(base);
    expect(screen.getByText(/Sent to/)).toBeInTheDocument();
    expect(screen.getByText("−$12.50")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("shows a received payment as a plus amount", () => {
    renderRow({ ...base, direction: "received" });
    expect(screen.getByText(/Received from/)).toBeInTheDocument();
    expect(screen.getByText("+$12.50")).toBeInTheDocument();
  });

  it("labels a pending payment as pending", () => {
    renderRow({ ...base, status: "pending" });
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("strikes through a failed payment and says it did not go through", () => {
    renderRow({ ...base, status: "failed" });
    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("This payment did not go through.")).toBeInTheDocument();
    expect(screen.getByText("−$12.50")).toHaveClass("line-through");
  });

  it("does not invent an amount it does not know", () => {
    renderRow({ ...base, status: "failed", amount: null });
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("links to Solana Explorer when there is a signature", () => {
    renderRow(base);
    const link = screen.getByRole("link", { name: /Solana Explorer/ });
    expect(link).toHaveAttribute("href", expect.stringContaining(base.signature!));
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("can hide the link, and has none without a signature", () => {
    renderRow(base, { showExplorer: false });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    renderRow({ ...base, signature: null });
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows the time it is given", () => {
    renderRow(base);
    expect(screen.getByText(/Today, 10:42 AM/)).toBeInTheDocument();
  });
});
