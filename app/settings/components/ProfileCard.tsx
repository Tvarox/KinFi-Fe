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
    <section
      aria-label="Profile"
      className="anim-rise flex flex-col gap-[18px] rounded-[22px] border border-white/[0.08] p-6 backdrop-blur-md"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.62)" }}
    >
      <h2 className="font-display text-[26px] text-white">Profile</h2>

      <div className="flex items-center gap-4">
        <div
          className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-lg font-semibold"
          style={{ backgroundColor: "#FFA15A", color: "#131416" }}
          aria-hidden="true"
        >
          {initialsFrom(email)}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[13px] text-gray-400">Signed in with {method}</span>
          <span className="truncate text-base font-medium text-white">{email ?? "Not available"}</span>
        </div>
      </div>
    </section>
  );
}
