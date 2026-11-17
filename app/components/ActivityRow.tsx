import { formatUsdc } from "@/lib/format";
import { describeHistoryItem, statusLabel, type HistoryItem } from "@/lib/history";
import { explorerTxUrl } from "@/lib/send";

const TONES = {
  received: { bg: "rgba(95, 211, 154, 0.12)", fg: "#6EE0A8" },
  sent: { bg: "rgba(255, 255, 255, 0.06)", fg: "#F3F0EA" },
  pending: { bg: "rgba(242, 193, 78, 0.12)", fg: "#F2C14E" },
  failed: { bg: "rgba(255, 122, 122, 0.12)", fg: "#FF8A8A" },
} as const;

const BADGE_TONE = {
  confirmed: TONES.received,
  pending: TONES.pending,
  failed: TONES.failed,
} as const;

function iconTone(item: HistoryItem) {
  if (item.status === "pending") return TONES.pending;
  if (item.status === "failed") return TONES.failed;
  return item.direction === "received" ? TONES.received : TONES.sent;
}

function Icon({ item }: { item: HistoryItem }) {
  const paths =
    item.status === "pending" ? (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ) : item.status === "failed" ? (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
      </>
    ) : item.direction === "received" ? (
      <>
        <path d="M17 7L7 17" />
        <path d="M16 17H7V8" />
      </>
    ) : (
      <>
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </>
    );

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths}
    </svg>
  );
}

function Amount({ item }: { item: HistoryItem }) {
  const text = formatUsdc(item.amount);
  if (text === null) return <span className="text-gray-500">Unknown</span>;

  const failed = item.status === "failed";
  const received = item.direction === "received";
  const color = failed ? "#9ca3af" : received ? "#6EE0A8" : "#ffffff";

  return (
    <span className={failed ? "line-through" : ""} style={{ color }}>
      {received ? "+" : "−"}
      {text}
    </span>
  );
}

/**
 * One payment in a list: what it was, when, whether Solana has confirmed it,
 * and the amount. Failed payments are struck through and say no money moved.
 */
export default function ActivityRow({
  item,
  timeText,
  showExplorer = true,
}: {
  item: HistoryItem;
  timeText: string;
  showExplorer?: boolean;
}) {
  const tone = iconTone(item);
  const badge = BADGE_TONE[item.status];

  return (
    <li className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/[0.03]">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: tone.bg, color: tone.fg }}
      >
        <Icon item={item} />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-[15px] font-medium text-white">{describeHistoryItem(item)}</span>
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-gray-400">
          {timeText}
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: badge.bg, color: badge.fg }}
          >
            {statusLabel(item.status)}
          </span>
          {item.status === "failed" && <span>This payment did not go through.</span>}
          {showExplorer && item.signature && (
            <a
              href={explorerTxUrl(item.signature)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
              aria-label="View this transaction on Solana Explorer"
            >
              View
            </a>
          )}
        </span>
      </div>

      <span className="shrink-0 text-base font-semibold tabular-nums">
        <Amount item={item} />
      </span>
    </li>
  );
}
