'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingText from '../components/LoadingText';
import PixelPromptButton from '../components/PixelPromptButton';

const BENEFITS = [
  'Your wallet is created for you. No seed phrase to store.',
  'You approve every payment yourself.',
  'Balances come straight from Solana.',
];

export default function LoginPage() {
  const { authenticated, login, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || authenticated) {
    return (
      <div className="flex min-h-[100dvh] flex-1 items-center justify-center" role="status">
        <LoadingText
          className="text-sm text-gray-400"
          text={authenticated ? 'Redirecting' : 'Loading'}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-1 flex-col items-center justify-center gap-8 px-6 py-12">
      <img src="/kenfi-lockup-on-dark.svg" alt="Kenfi" className="h-12 w-auto" />

      <main
        className="anim-rise flex w-full max-w-[440px] flex-col gap-7 rounded-[28px] border border-white/[0.08] p-8 backdrop-blur-lg sm:p-10"
        style={{ backgroundColor: 'rgba(28, 29, 33, 0.48)' }}
      >
        <div className="flex flex-col gap-2.5 text-center">
          <h1 className="font-display text-[44px] leading-[1.05] text-white sm:text-[46px]">Welcome to Kenfi</h1>
          <p className="text-[15px] leading-relaxed text-gray-400">
            A simple place to hold, send and receive USDC.
          </p>
        </div>

        <PixelPromptButton
          size="lg"
          showSuccessState={false}
          onClick={() => login()}
          className="w-full"
        >
          <span className="inline-flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
            </svg>
            Continue with email
          </span>
        </PixelPromptButton>

        <ul className="flex flex-col gap-3 border-t border-white/[0.07] pt-5 text-sm leading-relaxed text-gray-300">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex gap-3">
              <span aria-hidden="true" className="text-orange-400">●</span>
              {benefit}
            </li>
          ))}
        </ul>
      </main>

      <p className="max-w-[440px] text-center text-[13px] leading-relaxed text-gray-400">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
