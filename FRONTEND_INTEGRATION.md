# Frontend Integration Notes

## Overview

KinFi-Fe is a Next.js App Router application using React, TypeScript, Tailwind
CSS, Privy React Auth, and a shared authenticated API hook.

The backend base URL is configured with:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787/api
```

Production deployments should provide the production API URL through the
environment rather than hardcoding it.

## Authentication flow

`components/Providers.tsx` wraps the application in `PrivyProvider`.

`lib/use-auth.ts` exposes:

- `ready`
- `authenticated`
- `user`
- `login`
- `logout`
- `getBackendHeaders`
- `callBackend`

Authenticated requests send:

```http
Authorization: Bearer <Privy access token>
privy-id-token: <Privy identity token>
```

The hook now refuses to send a protected request when Privy has not supplied
both tokens. This avoids sending unauthenticated requests that the backend
would correctly reject with `401`.

## Page and endpoint integration

### Home

`app/page.tsx`:

- Checks `GET /health`.
- Caches successful health status in `localStorage` under
  `kinfi_health_check`.
- Removes failed/stale health cache entries so failures can be retried.
- Fetches `GET /wallet/balances` after Privy is ready and authenticated.
- Displays loading, unavailable, and connect-wallet states instead of
  fabricated balances.

The home page also uses:

- `/wallet/transactions` through `RecentActivityCard`.
- `/wallet/threshold/settings` through `AutoEarnCard`.

### Earn

`app/earn/page.tsx` fetches `/wallet/balances` and uses the real total balance
for projections. The previous hardcoded `$1,842.60` fallback was removed.

The Earn slider and protocol selector currently calculate client-side
projections. The slider is not saved to the backend because the backend
threshold endpoint expects an absolute USDC threshold rather than a percentage.

### Wallet

`app/wallet/page.tsx` uses:

```text
GET /wallet/balances
```

It displays:

- Total vault balance
- Embedded wallet balance
- USDC balance
- Idle vault balance
- Aave earning balance

The obsolete `/wallet/balance` call was removed.

### Send

`app/send/components/SendForm.tsx`:

- Fetches the available embedded balance from `/wallet/balances`.
- Validates a Base `0x` address.
- Validates a positive USDC amount up to six decimal places.
- Calls `POST /wallet/send` with:

```json
{
  "to_address": "0x...",
  "amount": "10.25"
}
```

- Displays loading, success, and error states.

### Receive

`app/send/components/ReceivePanel.tsx`:

- Fetches `GET /wallet/address`.
- Uses the returned smart vault address for the QR code.
- Copies the backend address instead of a placeholder address.

### History

`app/history/page.tsx` fetches:

```text
GET /wallet/transactions?type=all&limit=100
```

It maps backend deposits into the existing activity table and calculates the
summary totals from loaded rows. Loading, empty, error, and unauthenticated
states are handled.

The backend currently returns deposits and card transactions. The frontend
currently maps deposits; sends and earn operations require a normalized backend
history feed before they can appear as complete history rows.

### Wallet creation

`app/wallet/create/page.tsx` calls:

```text
POST /wallet/create
```

and displays the returned smart vault address and status message.

## Data format

Balance values from the backend are integer micro-USDC strings:

```text
"1842600000" -> "$1,842.60"
```

Frontend formatting converts with:

```ts
Number(BigInt(value)) / 1e6
```

## Branding and fonts

- Body font: local Cinzel font files in `public/fonts/Cinzel`.
- Heading font: local Cormorant font files in `public/fonts/Cormorant`.
- Dark/light favicon marks are configured in `app/layout.tsx`.
- The navbar uses `public/kenfi-lockup-on-dark.svg`.

## Known issues and follow-ups

- Add Money is UI-only because the backend deposit route is currently
  webhook-driven.
- The home balance chart still contains illustrative historical data; the
  backend does not yet expose a historical balance-series endpoint.
- Send and receive require an authenticated Privy session and an embedded
  wallet.
- If an old `/wallet/balance` request appears in browser logs, restart the
  Next.js dev server and hard-refresh to discard the stale client bundle.
- The browser's Cross-Origin-Opener-Policy 404 check is separate from the
  wallet API route and may be emitted by the Privy development flow.

## Verification

From this directory:

```bash
npx tsc --noEmit
npm run build
npm run dev
```

For local authenticated API testing:

1. Start the backend Worker on the configured port.
2. Start the Next.js development server.
3. Log in through Privy.
4. Confirm requests contain both Privy headers.
