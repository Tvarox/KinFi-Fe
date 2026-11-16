import ProfileCard from "./components/ProfileCard";
import WalletCard from "./components/WalletCard";
import SessionCard from "./components/SessionCard";

export default function SettingsPage() {
  return (
    <div
      className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-10"
      style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="font-display text-4xl text-white sm:text-[44px]">Settings</h1>
          <p className="text-[15px] text-gray-400">Your account and wallet details.</p>
        </header>

        <div className="flex flex-col gap-5">
          <ProfileCard />
          <WalletCard />
          <SessionCard />
        </div>
      </div>
    </div>
  );
}
