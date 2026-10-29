"use client";

const PRESETS = [10, 20, 30, 50];

type Props = { percent: number; setPercent: (v: number) => void };

export default function EarnSlider({ percent, setPercent }: Props) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: "#1C1D21" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">How much should earn?</h2>
          <p className="text-xs text-gray-400 mt-0.5">Applies to each new deposit</p>
        </div>
        <span className="text-3xl font-bold text-white">{percent}%</span>
      </div>

      {/* Slider */}
      <div className="flex flex-col gap-1">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={percent}
          onChange={(e) => setPercent(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none"
          style={{
            background: `linear-gradient(to right, #FFA15A 0%, #FFA15A ${percent}%, #374151 ${percent}%, #374151 100%)`,
          }}
        />
        <div className="flex justify-between">
          <span className="text-xs text-gray-500">0%</span>
          <span className="text-xs text-gray-500">100%</span>
        </div>
      </div>

      {/* Preset pills */}
      <div className="flex items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setPercent(p)}
            className="text-sm font-medium rounded-full px-4 py-1.5 border transition-colors"
            style={{
              backgroundColor: percent === p ? "#FFA15A22" : "#131416",
              borderColor:     percent === p ? "#FFA15A"   : "#374151",
              color:           percent === p ? "#FFA15A"   : "#9ca3af",
            }}
          >
            {p}%
          </button>
        ))}
      </div>
    </div>
  );
}

