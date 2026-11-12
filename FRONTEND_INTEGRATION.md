# Frontend Integration Notes

## Overview

KinFi-Fe is a Next.js App Router app (React, TypeScript, Tailwind) that signs
users in with Privy and talks to the Kinfi backend. V0 is a Solana wallet:
sign in, see your USDC balance, receive.

## Setup

```bash
cp .env.example .env.local   # then fill it in
npm ci
npm run dev
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID. If it is missing the app shows a "not configured" message. |
| `NEXT_PUBLIC_API_BASE_URL` | Backend URL, default `http://localhost:8787/api` |

Privy dashboard settings the app relies on: Solana embedded wallets enabled,
and identity tokens enabled (the backend requires both tokens).

## Authentication

`components/Providers.tsx` wraps the app in `PrivyProvider`:
email and Google sign-in, and `embeddedWallets.solana.createOnLogin:
'users-without-wallets'`, so every user gets a Solana wallet on first sign-in.

`components/AuthGate.tsx` keeps signed-out visitors on `/login` and keys the
page tree by user id, so one user's data can never show for another.

`lib/use-auth.ts` exposes `callBackend<T>(path)`, which sends both headers the
backend requires and returns the response `data`:

```http
Authorization: Bearer <Privy access token>
privy-id-token: <Privy identity token>
```

`lib/api.ts` throws `ApiError` (with a `code`) for error responses.

## Data hooks

`lib/use-backend-query.ts`:

- `useWalletAddress()` calls `GET /wallet/address`
- `useUsdcBalance()` calls `GET /wallet/balances`

Both return `{ state, refreshing, refresh }`. `state.status` is `loading`,
`creating-wallet`, `ready` or `error`. While Privy is still creating a new
user's wallet the backend answers `WALLET_NOT_READY`; the hook retries every
2 seconds (up to 10 times) instead of showing an error.

Balances arrive as integer strings in base units (6 decimals).
`lib/format.ts` formats them with `BigInt` and truncates, never rounds up.

## Screens

| Route | What it does |
|---|---|
| `/login` | Email or Google sign-in |
| `/` | USDC balance with last-updated time and refresh, wallet address |
| `/receive` | Address, QR code, copy and share, "USDC on Solana only" warning |
| `/settings` | Signed-in account, wallet address, sign out |

## Parked screens

Earn, Add money, History, Send and the old vault wallet pages are in
`app/_future/`. That is a private folder, so they are not routed, and they are
excluded from `tsc` and ESLint. See `app/_future/README.md` for when each one
comes back.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```
