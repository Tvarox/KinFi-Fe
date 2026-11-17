'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/use-auth';

export default function WalletCreatePage() {
  const { authenticated, ready, callBackend, isLoading } = useAuth();
  const [status, setStatus] = useState<'idle' | 'creating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
  const [vaultAddress, setVaultAddress] = useState<string | null>(null);

  if (!ready) {
    return <div className="p-8 text-center text-gray-400">Loading auth...</div>;
  }

  if (!authenticated) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
        <p className="mb-6 text-gray-400">You need to log in to create a smart vault.</p>
        <a href="/login" className="text-orange-400 hover:underline">Go to login</a>
      </div>
    );
  }

  const handleCreate = async () => {
    setStatus('creating');
    setMessage('');

    try {
      const res = await callBackend('/wallet/create', {
        method: 'POST',
        body: {},
      });

      if (res.success) {
        setStatus('success');
        setVaultAddress(res.data?.smart_vault_address ?? null);
        setMessage(res.data?.message || 'Wallet created successfully');
      } else {
        setStatus('error');
        setMessage(res.error?.message || 'Failed to create wallet');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Unexpected error');
    }
  };

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Create Smart Vault</h1>

      {status === 'idle' && (
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-orange-600 transition"
        >
          {isLoading ? 'Creating...' : 'Create Wallet'}
        </button>
      )}

      {status === 'success' && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
          <p className="font-bold mb-2">✅ {message}</p>
          {vaultAddress && (
            <p className="text-sm font-mono break-all">{vaultAddress}</p>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          <p className="font-bold mb-2">❌ {message}</p>
        </div>
      )}
    </div>
  );
}
