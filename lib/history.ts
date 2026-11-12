import { shortenAddress } from "./format";

/** One line of activity, from GET /wallet/transactions. */
export interface HistoryItem {
  id: string;
  signature: string | null;
  status: "pending" | "confirmed" | "failed";
  direction: "sent" | "received";
  /** USDC base units, or null if unknown. */
  amount: string | null;
  counterparty: string | null;
  /** Unix seconds. */
  timestamp: number | null;
}

export interface HistoryPage {
  items: HistoryItem[];
  next_cursor: string | null;
}

export type HistoryFilter = "all" | "sent" | "received";

export function filterHistory(items: HistoryItem[], filter: HistoryFilter): HistoryItem[] {
  return filter === "all" ? items : items.filter((item) => item.direction === filter);
}

/** "Sent to 9xQe...JwM" or "Received from 9xQe...JwM". */
export function describeHistoryItem(item: HistoryItem): string {
  const who = item.counterparty ? shortenAddress(item.counterparty) : null;
  if (item.direction === "sent") return who ? `Sent to ${who}` : "Sent";
  return who ? `Received from ${who}` : "Received";
}

export function statusLabel(status: HistoryItem["status"]): string {
  if (status === "pending") return "Pending";
  if (status === "failed") return "Failed";
  return "Complete";
}

export function formatTimestamp(seconds: number | null): string {
  if (seconds === null) return "";
  return new Date(seconds * 1000).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Add a page to the list, without showing the same item twice. */
export function mergePages(current: HistoryItem[], next: HistoryItem[]): HistoryItem[] {
  const seen = new Set(current.map((item) => item.id));
  return [...current, ...next.filter((item) => !seen.has(item.id))];
}

export const hasPending = (items: HistoryItem[]) => items.some((item) => item.status === "pending");

/**
 * Fold a freshly loaded first page into a list that may already include older
 * pages. The new page wins, and anything it replaced is dropped: a pending
 * payment turns into a confirmed one with a different id, so matching is by
 * id and by signature. Pending items that are no longer returned are dropped too.
 */
export function mergeFirstPage(current: HistoryItem[], first: HistoryItem[]): HistoryItem[] {
  const ids = new Set(first.map((item) => item.id));
  const signatures = new Set(first.map((item) => item.signature).filter((s): s is string => s !== null));

  const older = current.filter(
    (item) =>
      item.status !== "pending" &&
      !ids.has(item.id) &&
      !(item.signature !== null && signatures.has(item.signature)),
  );
  return [...first, ...older];
}
