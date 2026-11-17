"use client";

import { useAuth } from "@/lib/use-auth";
import PixelPromptButton from "../../components/PixelPromptButton";

export default function SessionCard() {
  const { logout } = useAuth();

  return (
    <section
      aria-label="Session"
      className="anim-rise font-cormorant flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-white/[0.08] p-5 backdrop-blur-md"
      style={{ backgroundColor: "rgba(28, 29, 33, 0.48)" }}
    >
      <div className="flex flex-col gap-1">
        <h2 className="font-cinzel text-[24px] text-white">Session</h2>
        <span className="text-lg text-gray-400">Sign out of Kenfi on this device.</span>
      </div>
      <PixelPromptButton
        size="md"
        effectOnly
        showSuccessState={false}
        onClick={() => void logout()}
        className="bg-[#1C1D21]/60 px-0 py-2.5"
      >
        Sign out
      </PixelPromptButton>
    </section>
  );
}
