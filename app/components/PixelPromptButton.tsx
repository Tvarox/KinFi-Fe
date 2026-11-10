"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface PixelPromptButtonProps {
  label?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  effectOnly?: boolean;
  showSuccessState?: boolean;
  children?: ReactNode;
}

const GRID_COLUMNS = 36;
const GRID_ROWS = 10;
const PIXEL_SIZE = 3;
const GAP = 2;

function PixelPromptButton({
  label = "Add Money",
  href,
  onClick,
  className = "",
  effectOnly = false,
  showSuccessState = true,
  children,
}: PixelPromptButtonProps) {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [twinklePixels, setTwinklePixels] = useState<Set<number>>(new Set());
  const [hoverPixels, setHoverPixels] = useState<Map<number, number>>(new Map());
  const pixelsRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = pixelsRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const col = Math.floor(x / (PIXEL_SIZE + GAP));
      const row = Math.floor(y / (PIXEL_SIZE + GAP));

      const newHover = new Map<number, number>();
      // Light up a 4x4 area around the pointer
      for (let r = row - 1; r <= row + 2; r++) {
        for (let c = col - 1; c <= col + 2; c++) {
          if (r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLUMNS) {
            const distance = Math.max(Math.abs(r - row), Math.abs(c - col));
            newHover.set(r * GRID_COLUMNS + c, distance >= 2 ? 0.35 : 1);
          }
        }
      }
      setHoverPixels(newHover);
    },
    []
  );

  const handleClick = () => {
    setIsPressed(true);
    if (showSuccessState) setHasCopied(true);
    onClick?.();
    if (href) router.push(href);

    // Reset press state after ripple
    setTimeout(() => setIsPressed(false), 300);
  };

  // Twinkle animation: randomly light up pixels
  useEffect(() => {
    if (effectOnly || (showSuccessState && hasCopied)) return;

    const interval = setInterval(() => {
      setTwinklePixels((prev) => {
        const next = new Set(prev);
        const idx = Math.floor(Math.random() * GRID_COLUMNS * GRID_ROWS);
        if (next.has(idx)) {
          next.delete(idx);
        } else {
          next.add(idx);
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [effectOnly, hasCopied, showSuccessState]);

  const pixels = Array.from({ length: GRID_COLUMNS * GRID_ROWS }, (_, i) => {
    const row = Math.floor(i / GRID_COLUMNS);
    const col = i % GRID_COLUMNS;
    const isBorder =
      row === 0 || row === GRID_ROWS - 1 || col === 0 || col === GRID_COLUMNS - 1;
    const hoverOpacity = hoverPixels.get(i);
    const isLit = hoverOpacity !== undefined || (!effectOnly && twinklePixels.has(i));

    return (
      <div
        key={i}
        className="absolute"
        style={{
          top: row * (PIXEL_SIZE + GAP),
          left: col * (PIXEL_SIZE + GAP),
          width: PIXEL_SIZE,
          height: PIXEL_SIZE,
          backgroundColor: isLit
            ? "rgba(255, 228, 194, 0.16)"
            : "transparent",
          border: isLit && isBorder ? "1px solid rgba(255, 228, 194, 0.1)" : "none",
          borderRadius: "1px",
          opacity: hoverOpacity ?? 1,
          transition: "background-color 0.1s ease",
          boxShadow: isLit
            ? "0 0 5px rgba(255, 228, 194, 0.22), 0 0 10px rgba(255, 161, 85, 0.12)"
            : "none",
        }}
      />
    );
  });

  return (
    <button
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPixels(new Map())}
      className={
        "relative px-6 py-2 rounded-xl overflow-hidden" +
        (effectOnly
          ? " text-white border border-white/15 hover:border-white/30"
          : hasCopied
            ? " bg-green-500 text-white"
            : " text-[#131416] border border-[#D97845]") +
        (className ? " " + className : "")
      }
      style={{
        transition: "all 0.2s ease",
        transform: isPressed ? "scale(0.95)" : "scale(1)",
      }}
    >
      {/* Pixel grid overlay */}
      <div
        ref={pixelsRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${PIXEL_SIZE}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${PIXEL_SIZE}px)`,
          gap: `${GAP}px`,
          padding: `${GAP}px`,
          width: "100%",
          height: "100%",
          backgroundColor: effectOnly ? "transparent" : "#D97845",
        }}
      >
        {pixels}
      </div>

      {/* Button content */}
      <span
        className="relative z-10 text-sm font-medium tracking-wide"
        style={{ userSelect: "none" }}
      >
        {children ?? (hasCopied ? "✅ Copied" : label)}
      </span>
    </button>
  );
}

export default PixelPromptButton;