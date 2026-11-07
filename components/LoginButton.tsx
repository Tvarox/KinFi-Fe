'use client';

import { usePrivy } from '@privy-io/react-auth';

export default function LoginButton() {
  const { authenticated, login, logout, ready } = usePrivy();

  if (!ready) {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  if (!authenticated) {
    return (
      <button
        onClick={() => login()}
        className="px-5 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#FFA15A", color: "#131416" }}
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <button
      onClick={() => logout()}
      className="px-5 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-white/10 border border-white/15 text-white"
      style={{ backgroundColor: "#1C1D21" }}
    >
      Disconnect
    </button>
  );
}
