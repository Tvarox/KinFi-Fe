"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface PixelPromptButtonProps {
  label?: string;
  /** Navigates like a link when set. */
  href?: string;
  onClick?: () => void;
  className?: string;
  effectOnly?: boolean;
  /**
   * Turns the button green and says "Copied" after one click. Off by default:
   * only a button that copies something should ask for it.
   */
  showSuccessState?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  /** "lg" is the main call to action on a screen. */
  size?: "md" | "lg";
  children?: ReactNode;
}

const DEFAULT_COLUMNS = 36;
const DEFAULT_ROWS = 10;
const PIXEL_SIZE = 3;
const GAP = 3;
const STEP = PIXEL_SIZE + GAP;
const TWINKLE_MS = 120;
const MAX_TWINKLE_PIXELS = 12;

const SIZES = {
  md: { box: "px-6 py-2 rounded-xl", text: "text-sm font-medium tracking-wide" },
  lg: { box: "px-0 py-3.5 rounded-[14px]", text: "text-lg font-semibold" },
} as const;

function PixelPromptButton({
  label = "Add Money",
  href,
  onClick,
  className = "",
  effectOnly = false,
  showSuccessState = false,
  type = "button",
  disabled = false,
  size = "md",
  children,
}: PixelPromptButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [twinklePixels, setTwinklePixels] = useState<Set<number>>(new Set());
  const [hoverPixels, setHoverPixels] = useState<Map<number, number>>(new Map());
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [grid, setGrid] = useState({ columns: DEFAULT_COLUMNS, rows: DEFAULT_ROWS });
  const pixelsRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  // Fit the dot grid to the button, so wide buttons are covered end to end.
  useEffect(() => {
    const element = pixelsRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      setGrid({
        columns: Math.max(1, Math.ceil(width / STEP)),
        rows: Math.max(1, Math.ceil(height / STEP)),
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const { columns, rows } = grid;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = pixelsRef.current?.getBoundingClientRect();
      if (!rect || disabled) return;

      const col = Math.floor((e.clientX - rect.left) / STEP);
      const row = Math.floor((e.clientY - rect.top) / STEP);

      const next = new Map<number, number>();
      // Light up a 4x4 area around the pointer.
      for (let r = row - 1; r <= row + 2; r++) {
        for (let c = col - 1; c <= col + 2; c++) {
          if (r >= 0 && r < rows && c >= 0 && c < columns) {
            const distance = Math.max(Math.abs(r - row), Math.abs(c - col));
            next.set(r * columns + c, distance >= 2 ? 0.35 : 1);
          }
        }
      }
      setHoverPixels(next);
    },
    [columns, rows, disabled],
  );

  const handleClick = (e?: React.MouseEvent) => {
    if (disabled) return;
    setIsPressed(true);
    if (showSuccessState) setHasCopied(true);

    // Create ripple at click position
    if (e) {
      const rect = pixelsRef.current?.getBoundingClientRect();
      if (rect) {
        const id = rippleIdRef.current++;
        setRipples((prev) => [
          ...prev,
          { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
        ]);
        // Remove ripple after animation completes
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }
    }

    onClick?.();

    // Reset press state after the ripple.
    setTimeout(() => setIsPressed(false), 300);
  };

  // Twinkle: randomly light up pixels.
  useEffect(() => {
    if (disabled || (showSuccessState && hasCopied)) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const total = columns * rows;

    const interval = setInterval(() => {
      setTwinklePixels((prev) => {
        const next = new Set(prev);
        const idx = Math.floor(Math.random() * total);
        if (next.has(idx)) {
          next.delete(idx);
        } else {
          if (next.size >= MAX_TWINKLE_PIXELS) {
            const active = Array.from(next);
            next.delete(active[Math.floor(Math.random() * active.length)]);
          }
          next.add(idx);
        }
        return next;
      });
    }, TWINKLE_MS);

    return () => clearInterval(interval);
  }, [effectOnly, disabled, hasCopied, showSuccessState, columns, rows]);

  // Only the lit pixels are drawn. Dark ones are the button's own background.
  const lit = new Set<number>(hoverPixels.keys());
  for (const index of twinklePixels) lit.add(index);

  const pixels = Array.from(lit)
    .filter((index) => index < columns * rows)
    .map((index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const isBorder = row === 0 || row === rows - 1 || col === 0 || col === columns - 1;
      return (
        <div
          key={index}
          className="absolute"
          style={{
            top: row * STEP,
            left: col * STEP,
            width: PIXEL_SIZE,
            height: PIXEL_SIZE,
            backgroundColor: isHovered
              ? "rgba(255, 228, 194, 0.16)"
              : "rgba(255, 255, 255, 0.1)",
            border: isBorder
              ? `1px solid ${isHovered ? "rgba(255, 228, 194, 0.1)" : "rgba(255, 255, 255, 0.08)"}`
              : "none",
            borderRadius: "1px",
            opacity: hoverPixels.get(index) ?? 1,
            transition: "background-color 0.1s ease",
            boxShadow: isHovered
              ? "0 0 5px rgba(255, 228, 194, 0.22), 0 0 10px rgba(255, 161, 85, 0.12)"
              : "0 0 4px rgba(255, 255, 255, 0.08)",
          }}
        />
      );
    });

  const look = SIZES[size];
  const classes =
    `relative inline-flex items-center justify-center overflow-hidden ${look.box}` +
    (effectOnly
      ? " text-white border border-white/15 bg-[#1C1D21]/60 hover:text-[#131416] hover:border-[#D97845] hover:shadow-[0_0_18px_rgba(255,161,90,0.35)]"
      : hasCopied
        ? " bg-green-500 text-white"
        : " text-white border border-white/15 bg-[#1C1D21]/60 hover:text-[#131416] hover:border-[#D97845] hover:shadow-[0_0_18px_rgba(255,161,90,0.35)]") +
    (disabled ? " opacity-40 cursor-not-allowed" : "") +
    (className ? " " + className : "");

  const style = {
    transition: "all 0.2s ease",
    transform: isPressed ? "scale(0.95)" : "scale(1)",
  };

  const content = (
    <>
      {/* Pixel grid overlay */}
      <div
        ref={pixelsRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          padding: `${GAP}px`,
          backgroundColor: isHovered ? "#D97845" : "transparent",
        }}
      >
        {pixels}
      </div>

      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 4,
            height: 4,
            borderRadius: "50%",
            backgroundColor: hasCopied ? "#22c55e" : "#FFA15A",
            boxShadow: `0 0 16px ${hasCopied ? "rgba(34, 197, 94, 0.6)" : "rgba(255, 161, 85, 0.6)"}`,
            transform: "translate(-50%, -50%) scale(0)",
            animation: "ripple 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Button content */}
      <span
        className={`relative z-10 ${look.text}`}
        style={{
          userSelect: "none",
          fontFamily: "'Cinzel', serif",
        }}
      >
        {children ?? (hasCopied ? "Copied" : label)}
      </span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoverPixels(new Map());
        }}
        className={classes}
        style={style}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoverPixels(new Map());
      }}
      className={classes}
      style={style}
    >
      {content}
    </button>
  );
}

export default PixelPromptButton;
