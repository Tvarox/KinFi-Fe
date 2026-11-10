import ProfileCard       from "./components/ProfileCard";
import PreferencesCard   from "./components/PreferencesCard";
import AccountsCard      from "./components/AccountsCard";
import NotificationsCard from "./components/NotificationsCard";
import SignInMethodsCard  from "./components/SignInMethodsCard";
import SecurityCard      from "./components/SecurityCard";

export default function SettingsPage() {
  return (
    <div className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 10 }}>
      <div className="max-w-6xl lg:max-w-7xl mx-auto flex flex-col gap-2 tracking-wide">
        {/* Page Header */}
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Your profile, accounts and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ProfileCard />
          <PreferencesCard />
          <AccountsCard />
          <NotificationsCard />
          <SignInMethodsCard />
          <SecurityCard />
        </div>
      </div>
    </div>
  );
}
