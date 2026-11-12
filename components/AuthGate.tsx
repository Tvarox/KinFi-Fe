'use client';

import { usePrivy } from '@privy-io/react-auth';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';

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
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  return <Fragment key={user?.id}>{children}</Fragment>;
}
