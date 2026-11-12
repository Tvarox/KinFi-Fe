# Parked screens

Screens designed before the V0 backend existed. They are not routed (the `_`
prefix makes this a private folder), and they are excluded from `tsc` and
ESLint. Each one comes back, rebuilt against the real API, in the phase that
needs it:

| Parked | Returns in |
|---|---|
| `home/RecentActivityCard.tsx` | After V0 (a recent-activity card on Home) |
| `earn/`, `add-money/`, `home/AutoEarnCard.tsx`, `wallet/` | After V0 (Auto-Earn, ramps) |
| `home/BalanceChart.tsx` | After V0 (needs a balance history endpoint) |
| `settings/*Card.tsx` | When each setting is real |
