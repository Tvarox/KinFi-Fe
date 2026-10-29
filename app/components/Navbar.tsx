"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
  { label: "Home",      href: "/" },
  { label: "Earn",      href: "/earn" },
  { label: "Add Money", href: "/add-money" },
  { label: "Send",      href: "/send" },
  { label: "History",   href: "/history" },
  { label: "Settings",  href: "/settings" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="w-full flex items-center justify-between px-8 h-16 border-b border-white/10"
      style={{ backgroundColor: "#131416" }}
    >
      {/* Nav links */}
      <div className="flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative pb-1 text-sm font-medium transition-colors duration-200"
              style={{ color: isActive ? "#FFA15A" : "#9ca3af" }}
            >
              {link.label}

              {/* Animated underline — shared layoutId makes it slide between links */}
              {isActive && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute left-0 -bottom-[1px] h-[2px] w-full rounded-full"
                  style={{ backgroundColor: "#FFA15A" }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
