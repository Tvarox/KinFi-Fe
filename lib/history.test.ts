import { describe, it, expect } from "vitest";
import {
  describeHistoryItem,
  filterHistory,
  formatTimestamp,
  hasPending,
  mergeFirstPage,
  mergePages,
  statusLabel,
  type HistoryItem,
} from "./history";

const item = (over: Partial<HistoryItem>): HistoryItem => ({
  id: "a",
  signature: "sigA",
  status: "confirmed",
  direction: "received",
  amount: "1000000",
  counterparty: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  timestamp: 1_700_000_000,
  ...over,
});

describe("describeHistoryItem", () => {
  it("names the other side", () => {
    expect(describeHistoryItem(item({ direction: "sent" }))).toBe("Sent to EPjF...Dt1v");
    expect(describeHistoryItem(item({ direction: "received" }))).toBe("Received from EPjF...Dt1v");
  });

  it("copes with an unknown counterparty", () => {
    expect(describeHistoryItem(item({ direction: "sent", counterparty: null }))).toBe("Sent");
    expect(describeHistoryItem(item({ direction: "received", counterparty: null }))).toBe("Received");
  });
});

describe("statusLabel", () => {
  it("uses plain words", () => {
    expect(statusLabel("pending")).toBe("Pending");
    expect(statusLabel("failed")).toBe("Failed");
    expect(statusLabel("confirmed")).toBe("Complete");
  });
});

describe("filterHistory", () => {
  const items = [item({ id: "1", direction: "sent" }), item({ id: "2", direction: "received" }), item({ id: "3", direction: "sent" })];

  it("filters by direction", () => {
    expect(filterHistory(items, "sent").map((i) => i.id)).toEqual(["1", "3"]);
    expect(filterHistory(items, "received").map((i) => i.id)).toEqual(["2"]);
    expect(filterHistory(items, "all")).toHaveLength(3);
  });
});

describe("formatTimestamp", () => {
  it("formats unix seconds and handles null", () => {
    expect(formatTimestamp(null)).toBe("");
    expect(formatTimestamp(1_700_000_000)).toMatch(/Nov \d+, \d+:\d{2}/);
  });
});

describe("hasPending", () => {
  it("is true only when something is pending", () => {
    expect(hasPending([item({}), item({ id: "b", status: "pending" })])).toBe(true);
    expect(hasPending([item({}), item({ id: "b", status: "failed" })])).toBe(false);
    expect(hasPending([])).toBe(false);
  });
});

describe("mergePages", () => {
  it("appends a page without duplicates", () => {
    const merged = mergePages([item({ id: "1" }), item({ id: "2" })], [item({ id: "2" }), item({ id: "3" })]);
    expect(merged.map((i) => i.id)).toEqual(["1", "2", "3"]);
  });
});

describe("mergeFirstPage", () => {
  it("replaces a pending payment with its confirmed version (different id, same signature)", () => {
    const current = [item({ id: "send-1", signature: "sigX", status: "pending", direction: "sent" }), item({ id: "old", signature: "sigOld" })];
    const first = [item({ id: "sigX", signature: "sigX", status: "confirmed", direction: "sent" })];
    const merged = mergeFirstPage(current, first);
    expect(merged.map((i) => [i.id, i.status])).toEqual([["sigX", "confirmed"], ["old", "confirmed"]]);
  });

  it("keeps older pages that were already loaded", () => {
    const current = [item({ id: "1", signature: "s1" }), item({ id: "9", signature: "s9" })];
    const merged = mergeFirstPage(current, [item({ id: "1", signature: "s1" }), item({ id: "2", signature: "s2" })]);
    expect(merged.map((i) => i.id)).toEqual(["1", "2", "9"]);
  });

  it("drops a pending item the server no longer returns", () => {
    const merged = mergeFirstPage([item({ id: "p", signature: "sp", status: "pending" })], []);
    expect(merged).toEqual([]);
  });

  it("shows a payment that changed state exactly once", () => {
    const current = [item({ id: "1", signature: "s1", status: "pending" })];
    const merged = mergeFirstPage(current, [item({ id: "1", signature: "s1", status: "failed" })]);
    expect(merged).toHaveLength(1);
    expect(merged[0].status).toBe("failed");
  });
});
