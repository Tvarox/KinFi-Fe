interface MetricCardProps {
  label: string;
  value: string;
  subtitle: string;
  isGreen?: boolean;
}

export default function MetricCard({
  label,
  value,
  subtitle,
  isGreen = false,
}: MetricCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2 flex-1"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span
        className="text-2xl sm:text-3xl font-bold tracking-tight"
        style={{ color: isGreen ? "#4ade80" : "#ffffff" }}
      >
        {value}
      </span>
      <span className="text-xs text-gray-400">{subtitle}</span>
    </div>
  );
}

