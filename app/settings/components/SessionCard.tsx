"use client";

import { useAuth } from "@/lib/use-auth";

export default function SessionCard() {
  const { logout } = useAuth();

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-2xl font-semibold text-white tracking-normal">Session</h2>
      <button
        type="button"
        onClick={() => void logout()}
        className="self-start rounded-xl border border-white/15 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/30"
      >
        Sign out
      </button>
    </div>
  );
}
