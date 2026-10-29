const stats = [
  { label: "Added",    value: "$1,750.14", green: false },
  { label: "Sent",     value: "$40.00",    green: false },
  { label: "Received", value: "$120.00",   green: false },
  { label: "Earned",   value: "$12.47",    green: true  },
];

export default function StatsSummary() {
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
              {s.value}
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

