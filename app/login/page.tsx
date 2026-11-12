'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { authenticated, login, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: "#131416" }}>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (authenticated) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: "#131416" }}>
        <div className="text-gray-400">Redirecting...</div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex items-center justify-center px-8 py-12"
      style={{ backgroundColor: "#131416" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 border border-white/10"
        style={{ backgroundColor: "#1C1D21" }}
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#FFA15A" }}>
            KinFi
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Your money, working smarter.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500">Sign in to continue</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Login Button */}
        <button
          onClick={() => login()}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#FFA15A", color: "#131416" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Continue with email or Google
        </button>

        {/* Footer text */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
