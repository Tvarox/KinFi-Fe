import type { ActivityRow } from './ActivityTable';

export default function StatsSummary({ rows }: { rows: ActivityRow[] }) {
  const stats = ['Added', 'Sent', 'Received', 'Earn']
    .map((label) => ({
      label: label === 'Earn' ? 'Earned' : label,
      value: rows
        .filter((row) => row.tag === label && row.status === 'Completed')
        .reduce((total, row) => total + (Number(row.amount.replace(/[^0-9.-]/g, '')) || 0), 0),
      green: label === 'Earn',
    }));

  return (
    <div className="flex flex-col gap-3">
      {/* 4 stat boxes */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl px-5 py-4 flex flex-col gap-2"
            style={{ backgroundColor: "#1C1D21" }}
          >
            <span className="text-xs text-gray-400">{s.label}</span>
            <span
              className="text-2xl font-semibold"
              style={{ color: s.green ? "#4ade80" : "#ffffff" }}
            >
              ${s.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-500 px-1">
        Completed activity only, all time.{" "}
        <span style={{ color: "#FFA15A" }}>Pending</span> and failed items are not counted.
      </p>
    </div>
  );
}
