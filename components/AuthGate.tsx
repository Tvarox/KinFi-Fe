'use client';

import { usePrivy } from '@privy-io/react-auth';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import AccountSetupProvider from './AccountSetup';
import EnsureSolanaWallet from './EnsureSolanaWallet';
import LoadingText from '../app/components/LoadingText';

const PUBLIC_PATHS = ['/login'];

/**
 * Keeps signed-out visitors on the login page.
 *
 * Children are keyed by user id, so signing out and in as someone else
 * remounts every page and no state from the previous user can show.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user } = usePrivy();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (ready && !authenticated && !isPublic) {
      router.replace('/login');
    }
  }, [ready, authenticated, isPublic, router]);

  if (isPublic) return <>{children}</>;

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 p-8 text-lg text-gray-400">
        <span
          className="anim-spin h-9 w-9 rounded-full border-2 border-white/15 border-t-orange-300"
          aria-hidden="true"
        />
        <LoadingText text="Loading" />
      </div>
    );
  }

  return (
    <Fragment key={user?.id}>
      <EnsureSolanaWallet />
      <AccountSetupProvider>{children}</AccountSetupProvider>
    </Fragment>
  );
}
