const PRESETS = [50, 100, 250, 500];

type Props = {
  amount: number;
  setAmount: (v: number) => void;
};

export default function AmountInput({ amount, setAmount }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setAmount(raw === "" ? 0 : Math.min(5000, parseInt(raw, 10)));
  };

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-lg font-semibold text-white tracking-normal">How much?</h2>

      {/* Big amount input */}
      <div
        className="flex items-center justify-between rounded-xl px-5 py-5"
        style={{ backgroundColor: "#131416" }}
      >
        <div className="flex items-center gap-1 flex-1">
          <span className="text-3xl font-semibold text-gray-500">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={amount === 0 ? "" : amount}
            onChange={handleChange}
            placeholder="0"
            className="bg-transparent text-3xl font-semibold text-white w-full outline-none placeholder-gray-500"
          />
        </div>
        <span className="text-sm text-gray-400 ml-4">USD</span>
      </div>

      {/* Preset pills */}
      <div className="flex items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setAmount(p)}
            className="text-sm font-medium text-white rounded-full px-4 py-1.5 border transition-colors"
            style={{
              backgroundColor: amount === p ? "#FFA15A22" : "#131416",
              borderColor:     amount === p ? "#FFA15A"   : "#374151",
              color:           amount === p ? "#FFA15A"   : "#ffffff",
            }}
          >
            ${p}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500">Min \$10 · Max \$5,000 per deposit</p>
    </div>
  );
}
