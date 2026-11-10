import PixelPromptButton from "../PixelPromptButton";

interface BalanceHeroProps {
  total?: string;
}

export default function BalanceHero({ total }: BalanceHeroProps) {
  return (
    <div className="flex flex-col gap-4 py-6">
      {/* Label */}
      <p className="text-sm text-gray-400">Total balance</p>

      {/* Balance */}
      <div className="flex items-end gap-0">
        <span className="text-6xl font-bold text-white tracking-tight">{total ?? 'Loading...'}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-1">
        <PixelPromptButton label="Add money" href="/add-money" />

        <PixelPromptButton href="/send" effectOnly className="bg-[#1C1D21]">
          <span className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
            Send
          </span>
        </PixelPromptButton>

        <PixelPromptButton href="/send" effectOnly className="bg-[#1C1D21]">
          <span className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 7 7 17M17 17H7V7" />
            </svg>
            Receive
          </span>
        </PixelPromptButton>
      </div>
    </div>
  );
}
