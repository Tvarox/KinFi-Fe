'use client';

import { usePrivy } from '@privy-io/react-auth';
import PixelPromptButton from '../app/components/PixelPromptButton';

export default function LoginButton() {
  const { authenticated, login, logout, ready } = usePrivy();

  if (!ready) {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  if (!authenticated) {
    return (
      <PixelPromptButton
        label="Sign in"
        onClick={() => login()}
        showSuccessState={false}
        className="font-semibold"
      />
    );
  }

  return (
    <PixelPromptButton
      label="Sign out"
      onClick={() => logout()}
      effectOnly
      className="w-full bg-[#1C1D21] font-medium"
    />
  );
}
