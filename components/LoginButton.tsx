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
        label="Connect Wallet"
        onClick={() => login()}
        showSuccessState={false}
        className="font-semibold"
      />
    );
  }

  return (
    <PixelPromptButton
      label="Disconnect"
      onClick={() => logout()}
      effectOnly
      className="bg-[#1C1D21] font-medium"
    />
  );
}
