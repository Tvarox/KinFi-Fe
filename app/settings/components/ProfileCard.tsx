"use client";

import { usePrivy } from "@privy-io/react-auth";

function initialsFrom(email: string | undefined): string {
  if (!email) return "?";
  return email.trim().charAt(0).toUpperCase();
}

export default function ProfileCard() {
  const { user } = usePrivy();

  const email = user?.email?.address ?? user?.google?.email ?? undefined;
  const method = user?.google ? "Google" : user?.email ? "Email" : "Account";

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-2xl font-semibold text-white tracking-normal">Profile</h2>

      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
          style={{ backgroundColor: "#FFA15A", color: "#131416" }}
          aria-hidden="true"
        >
          {initialsFrom(email)}
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs text-gray-400">Signed in with {method}</span>
          <span className="truncate text-sm text-white">{email ?? "Not available"}</span>
        </div>
      </div>
    </div>
  );
}
