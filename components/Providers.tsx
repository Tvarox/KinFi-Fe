'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center text-sm text-gray-300">
        Kenfi is not configured. Set NEXT_PUBLIC_PRIVY_APP_ID (see .env.example).
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Email one-time code only. This sets what the login modal offers;
        // keep Google disabled in the Privy dashboard as well.
        loginMethods: ['email'],
        appearance: {
          theme: 'dark',
        },
        // Every user gets a Solana wallet on first sign-in. No seed phrase.
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
