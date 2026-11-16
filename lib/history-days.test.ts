import { describe, expect, it } from "vitest";
import { dayLabel, formatClock, groupByDay, type HistoryItem } from "./history";

// Local-time helpers, so these tests pass in any time zone.
const local = (y: number, m: number, d: number, h = 12, min = 0) =>
  Math.floor(new Date(y, m - 1, d, h, min).getTime() / 1000);

const NOW = new Date(2026, 10, 17, 15, 30).getTime(); // 17 Nov 2026, 15:30 local

const item = (id: string, timestamp: number | null): HistoryItem => ({
  id,
  signature: null,
  status: "confirmed",
  direction: "received",
  amount: "1000000",
  counterparty: null,
  timestamp,
});

describe("dayLabel", () => {
  it("says Today for any time today, including just after midnight", () => {
    expect(dayLabel(local(2026, 11, 17, 0, 1), NOW)).toBe("Today");
    expect(dayLabel(local(2026, 11, 17, 15, 29), NOW)).toBe("Today");
  });

  it("says Yesterday for the previous local day, even late at night", () => {
    expect(dayLabel(local(2026, 11, 16, 23, 59), NOW)).toBe("Yesterday");
    expect(dayLabel(local(2026, 11, 16, 0, 0), NOW)).toBe("Yesterday");
  });

  it("uses a short date for older days this year", () => {
    expect(dayLabel(local(2026, 11, 12), NOW)).toBe("Nov 12");
    expect(dayLabel(local(2026, 1, 3), NOW)).toBe("Jan 3");
  });

  it("includes the year for other years", () => {
    expect(dayLabel(local(2025, 12, 31), NOW)).toBe("Dec 31, 2025");
  });

  it("treats a time slightly in the future (clock skew) as Today", () => {
    expect(dayLabel(local(2026, 11, 17, 15, 35), NOW)).toBe("Today");
  });

  it("has a label when there is no time", () => {
    expect(dayLabel(null, NOW)).toBe("Earlier");
  });
});

describe("groupByDay", () => {
  it("splits the list where the day changes and keeps the order", () => {
    const groups = groupByDay(
      [
        item("a", local(2026, 11, 17, 11, 8)),
        item("b", local(2026, 11, 17, 10, 42)),
        item("c", local(2026, 11, 16, 18, 5)),
        item("d", local(2026, 11, 12, 9, 0)),
      ],
      NOW,
    );
    expect(groups.map((g) => [g.label, g.items.map((i) => i.id)])).toEqual([
      ["Today", ["a", "b"]],
      ["Yesterday", ["c"]],
      ["Nov 12", ["d"]],
    ]);
  });

  it("returns nothing for an empty list", () => {
    expect(groupByDay([], NOW)).toEqual([]);
  });
});

describe("formatClock", () => {
  it("formats the local time", () => {
    expect(formatClock(local(2026, 11, 17, 10, 42))).toBe("10:42 AM");
    expect(formatClock(local(2026, 11, 17, 18, 5))).toBe("6:05 PM");
  });

  it("is empty without a time", () => {
    expect(formatClock(null)).toBe("");
  });
});
