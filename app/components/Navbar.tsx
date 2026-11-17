"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import LoginButton from "../../components/LoginButton";

const ICON_PATHS: Record<string, React.ReactNode> = {
  home: (
    <>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  send: (
    <>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  receive: (
    <>
      <path d="M17 7L7 17" />
      <path d="M16 17H7V8" />
    </>
  ),
  history: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <circle cx="16" cy="7" r="2" />
      <path d="M4 17h2" />
      <path d="M10 17h10" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
};

const navLinks = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Send", href: "/send", icon: "send" },
  { label: "Receive", href: "/receive", icon: "receive" },
  { label: "History", href: "/history", icon: "history" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

function NavIcon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function Underline({ id, inset }: { id: string; inset: string }) {
  return (
    <motion.span
      layoutId={id}
      className={`absolute bottom-1 h-px rounded-full bg-orange-400 ${inset}`}
      style={{ boxShadow: "0 0 8px 2px rgba(255, 161, 90, 0.65)" }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    />
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { user } = usePrivy();

  // The sign-in page is full screen, with no navigation.
  if (pathname === "/login") return null;

  const email = user?.email?.address ?? user?.google?.email ?? null;
  const initial = email ? email.trim().charAt(0).toUpperCase() : "?";

  return (
    <>
      {/* Left sidebar: large screens */}
      <aside
        className="hidden lg:flex lg:flex-col w-64 shrink-0 gap-8 border-r border-white/10 px-4 py-7 backdrop-blur-md"
        style={{ backgroundColor: "rgba(19, 20, 22, 0.55)" }}
      >
        <Link href="/" aria-label="Kenfi home" className="px-3">
          <img src="/kenfi-lockup-on-dark.svg" alt="Kenfi" className="h-8 w-auto" />
        </Link>

        <nav aria-label="Main" className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`font-cinzel relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition-colors duration-200 ${
                  isActive ? "text-orange-400" : "text-gray-400 hover:text-white"
                }`}
              >
                <NavIcon name={link.icon} />
                {link.label}
                {isActive && <Underline id="desktop-nav-underline" inset="left-3.5 right-3.5" />}
              </Link>
            );
          })}
        </nav>

        <div
          className="mt-auto flex flex-col gap-3 rounded-2xl border border-white/[0.07] p-3.5"
          style={{ backgroundColor: "rgba(28, 29, 33, 0.62)" }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              style={{ backgroundColor: "#FFA15A", color: "#131416" }}
            >
              {initial}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-xs text-gray-400">Signed in</span>
              <span className="truncate text-[13px] text-white">{email ?? "Your account"}</span>
            </div>
          </div>
          <LoginButton />
        </div>
      </aside>

      {/* Bottom tab bar: phones and tablets */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-[60] flex justify-around border-t border-white/10 px-2 pb-5 pt-2 backdrop-blur-md lg:hidden"
        style={{ backgroundColor: "rgba(19, 20, 22, 0.82)" }}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`font-cinzel relative flex min-h-12 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                isActive ? "text-orange-400" : "text-gray-400"
              }`}
            >
              <NavIcon name={link.icon} size={22} />
              {link.label}
              {isActive && <Underline id="mobile-nav-underline" inset="left-[30%] right-[30%]" />}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
