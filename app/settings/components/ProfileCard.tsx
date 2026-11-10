export default function ProfileCard() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ backgroundColor: "#1C1D21" }}
    >
      <h2 className="text-2xl font-semibold text-white tracking-normal">Profile</h2>

      {/* Avatar + Display name */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: "#FFA15A" }}
        >
          MR
        </div>

        {/* Display name field */}
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-xs text-gray-400">Display name</span>
          <div
            className="rounded-lg px-4 py-2.5 text-white text-sm"
            style={{ backgroundColor: "#131416" }}
          >
            Maya R.
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Email row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#131416" }}
          >
            {/* Envelope icon */}
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
          Verified
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Identity check row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#131416" }}
          >
            {/* Shield icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Identity check</p>
            <p className="text-xs text-gray-400">Needed for cards and larger limits. Not part of this demo.</p>
          </div>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          Not started
        </span>
      </div>
    </div>
  );
}
