"use client";

import { useAuth } from "@/lib/use-auth";
import PixelPromptButton from "../../components/PixelPromptButton";

export default function SessionCard() {
  const { logout } = useAuth();

  return (
    <section
      aria-label="Session"
      className="anim-rise flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-white/[0.08] p-6 backdrop-blur-md"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.62)" }}
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-[26px] text-white">Session</h2>
        <span className="text-sm text-gray-400">Sign out of Kenfi on this device.</span>
      </div>
      <PixelPromptButton
        size="lg"
        effectOnly
        showSuccessState={false}
        onClick={() => void logout()}
        className="bg-[#1C1D21]/60"
      >
        Sign out
      </PixelPromptButton>
    </section>
  );
}
