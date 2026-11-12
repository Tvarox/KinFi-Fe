'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useCreateWallet, useWallets } from '@privy-io/react-auth/solana';
import { useEffect, useRef } from 'react';

// Privy's createOnLogin runs at sign-in. Give it a moment before stepping in.
const GRACE_PERIOD_MS = 3000;

/**
 * Safety net. Privy's docs do not say whether `users-without-wallets` also
 * covers someone who already has a wallet on another chain, so a user with
 * only an Ethereum wallet (for example from an earlier version of the app)
 * could be left without a Solana one. If there is still none after a short
 * wait, create it. createWallet does not make a second wallet by default.
 */
export default function EnsureSolanaWallet() {
  const { ready: privyReady, authenticated } = usePrivy();
  const { ready, wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const attempted = useRef(false);

  const hasWallet = wallets.length > 0;

  useEffect(() => {
    if (!privyReady || !authenticated || !ready || hasWallet || attempted.current) {
      return;
    }

    const timer = setTimeout(() => {
      attempted.current = true;
      createWallet({}).catch((error: unknown) => {
        console.error('Could not create a Solana wallet', error);
      });
    }, GRACE_PERIOD_MS);

    return () => clearTimeout(timer);
  }, [privyReady, authenticated, ready, hasWallet, createWallet]);

  return null;
}
