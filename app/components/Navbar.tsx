"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginButton from "../../components/LoginButton";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Earn", href: "/earn" },
  { label: "Wallet", href: "/wallet" },
  { label: "Add Money", href: "/add-money" },
  { label: "Send", href: "/send" },
  { label: "History", href: "/history" },
  { label: "Settings", href: "/settings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Left sidebar — visible on lg+, part of document flow (not fixed/overlapping) */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-white/10" style={{ backgroundColor: "#131416" }}>
        <div className="flex items-center gap-2 p-6">
          <Link href="/" aria-label="KinFi home" className="flex items-center">
            <img src="/kenfi-lockup-on-dark.svg" alt="KinFi" className="h-8 w-auto" />
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative flex items-center gap-3 px-4 py-3 transition-colors duration-200
                  ${isActive ? "text-orange-400" : "text-gray-400 hover:text-white"}
                `}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="desktop-nav-underline"
                    className="absolute bottom-1 left-4 right-4 h-px rounded-full bg-orange-400"
                    style={{ boxShadow: "0 0 8px 2px rgba(255, 161, 90, 0.65)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Connect / Disconnect button inside desktop sidebar */}
        <div className="p-4">
          <LoginButton />
        </div>
      </aside>

      {/* Hamburger overlay (mobile only) */}
      <div className="lg:hidden fixed inset-0 z-[60]">
        {!isMobileMenuOpen && (
          <div className="absolute top-4 right-4 z-[61]">
            <button
              className="p-2 rounded-md bg-white/10 text-white"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        )}
        <AnimatePresence mode="wait">
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="fixed top-0 left-0 h-screen w-[280px] lg:hidden flex-col bg-[#131416] border-r border-white/10 z-[60]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6">
                <img src="/kenfi-lockup-on-dark.svg" alt="KinFi" className="h-8 w-auto" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-md hover:bg-white/10 focus:outline-none"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                      relative flex items-center gap-3 px-4 py-3 transition-colors duration-200 block
                      ${isActive ? "text-orange-400" : "text-gray-400 hover:text-white"}
                      `}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                        layoutId="mobile-nav-underline"
                        className="absolute bottom-1 left-4 right-4 h-px rounded-full bg-orange-400"
                        style={{ boxShadow: "0 0 8px 2px rgba(255, 161, 90, 0.65)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                      )}
                    </Link>
                  );
                })}
              </nav>
              {/* Connect / Disconnect button inside mobile panel */}
              <div className="p-4 mt-auto">
                <LoginButton />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
