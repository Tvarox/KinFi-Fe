import ProfileCard from "./components/ProfileCard";
import WalletCard from "./components/WalletCard";
import SessionCard from "./components/SessionCard";

export default function SettingsPage() {
  return (
    <div
      className="flex-1 px-4 py-4 sm:px-6 sm:py-5 lg:px-12 lg:py-5"
      style={{ backgroundColor: "transparent", position: "relative", zIndex: 10 }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h1 className="font-cinzel text-4xl text-white sm:text-[44px]">Settings</h1>
          <p className="font-cormorant text-[19px] text-gray-400">Your account and wallet details.</p>
        </header>

        <div className="flex flex-col gap-3">
          <ProfileCard />
          <WalletCard />
          <SessionCard />
        </div>
      </div>
    </div>
  );
}
