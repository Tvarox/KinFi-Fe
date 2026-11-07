'use client';

import { useIdentityToken, usePrivy } from '@privy-io/react-auth';
import { useCallback, useState } from 'react';

export function useAuth() {
  const { authenticated, user, login, logout, ready, getAccessToken } = usePrivy();
  const { identityToken } = useIdentityToken();
  const [isLoading, setIsLoading] = useState(false);

  const getBackendHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const accessToken = await getAccessToken();
    if (!accessToken || !identityToken) {
      throw new Error('Authentication tokens are not ready');
    }

    const headers: Record<string, string> = {
      'privy-id-token': identityToken,
    };
    headers.Authorization = ['Bearer', accessToken].join(' ');
    return headers;
  }, [getAccessToken, identityToken]);

  const callBackend = useCallback(async (
    path: string,
    options: { method?: string; body?: any } = {},
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(await getBackendHeaders()),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `Request failed: ${response.status}`);
      }

      return data;
    } finally {
      setIsLoading(false);
    }
  }, [getBackendHeaders]);

  return {
    authenticated,
    ready,
    user,
    login,
    logout,
    isLoading,
    getBackendHeaders,
    callBackend,
  };
}
