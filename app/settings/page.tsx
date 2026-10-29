import ProfileCard       from "./components/ProfileCard";
import PreferencesCard   from "./components/PreferencesCard";
import AccountsCard      from "./components/AccountsCard";
import NotificationsCard from "./components/NotificationsCard";
import SignInMethodsCard  from "./components/SignInMethodsCard";
import SecurityCard      from "./components/SecurityCard";

export default function SettingsPage() {
  return (
    <div className="flex-1 px-8 py-8" style={{ backgroundColor: "#131416" }}>
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            Your profile, accounts and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
