"use client";

import { useIdentityToken, usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";
import { ApiError, apiRequest } from "./api";

/** Privy session plus an authenticated call to the Kinfi backend. */
export function useAuth() {
  const { authenticated, user, login, logout, ready, getAccessToken } =
    usePrivy();
  const { identityToken } = useIdentityToken();

  const getBackendHeaders = useCallback(async (): Promise<
    Record<string, string>
  > => {
    const accessToken = await getAccessToken();
    if (!accessToken || !identityToken) {
      // Right after sign-in the tokens can arrive a moment apart.
      throw new ApiError("Signing you in...", "AUTH_NOT_READY");
    }
    return {
      Authorization: `Bearer ${accessToken}`,
      "privy-id-token": identityToken,
    };
  }, [getAccessToken, identityToken]);

  /** Call a protected backend route. Returns the response `data`. */
  const callBackend = useCallback(
    async <T,>(
      path: string,
      options: { method?: string; body?: unknown } = {},
    ): Promise<T> =>
      apiRequest<T>(path, {
        ...options,
        headers: await getBackendHeaders(),
      }),
    [getBackendHeaders],
  );

  return {
    authenticated,
    ready,
    user,
    login,
    logout,
    getBackendHeaders,
    callBackend,
  };
}
