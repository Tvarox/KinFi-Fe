export default function SignInMethodsCard() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <div>
        <h2 className="text-2xl font-semibold text-white tracking-normal">Sign-in methods</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Simulated in this demo. Nothing is linked to a real account.
        </p>
      </div>

      {/* Email */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#131416" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Email</p>
            <p className="text-xs text-gray-400">maya@example.com</p>
          </div>
        </div>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#14532d", color: "#4ade80" }}
        >
          Primary
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Google */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#131416" }}
          >
            {/* Globe icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Google</p>
            <p className="text-xs text-gray-400">Connected</p>
          </div>
        </div>
        <button
          className="text-xs font-medium text-white border border-white/20 rounded-lg px-3 py-1.5 hover:border-white/40 transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Passkey */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#131416" }}
          >
            {/* Key icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="7.5" cy="15.5" r="5.5" />
              <path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Passkey</p>
            <p className="text-xs text-gray-400">Sign in with your fingerprint or face</p>
          </div>
        </div>
        <button
          className="text-xs font-medium text-white border border-white/20 rounded-lg px-3 py-1.5 hover:border-white/40 transition-colors"
        >
          Add passkey
        </button>
      </div>
    </div>
  );
}
