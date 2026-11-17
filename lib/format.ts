const USDC_DECIMALS = 6;

/**
 * Format a USDC amount given in base units (an integer string with 6
 * decimals) as dollars, for example "1842600000" becomes "$1,842.60".
 *
 * Uses BigInt, so large balances keep full precision. Extra decimals are
 * truncated, never rounded up, so the app never shows more money than exists.
 * Returns null if the input is not a non-negative integer string.
 */
export function formatUsdc(baseUnits: string | undefined | null): string | null {
  if (baseUnits === undefined || baseUnits === null) return null;
  if (!/^\d+$/.test(baseUnits)) return null;

  // BigInt() calls, not 10n literals: tsconfig targets below ES2020.
  const value = BigInt(baseUnits);
  const unit = BigInt(10) ** BigInt(USDC_DECIMALS);
  const dollars = value / unit;
  const cents = (value % unit) / BigInt(10) ** BigInt(USDC_DECIMALS - 2);

  const dollarsText = dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${dollarsText}.${cents.toString().padStart(2, "0")}`;
}

/** "9xQeWvG8...tJwM" style short form of a long address. */
export function shortenAddress(address: string, head = 4, tail = 4): string {
  if (address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

/**
 * Like formatUsdc but keeps every decimal the amount really has (at least 2,
 * at most 6), for places where precision matters, such as a payment review.
 * "10255000" becomes "$10.255".
 */
export function formatUsdcPrecise(baseUnits: string | undefined | null): string | null {
  if (baseUnits === undefined || baseUnits === null) return null;
  if (!/^\d+$/.test(baseUnits)) return null;

  const value = BigInt(baseUnits);
  const unit = BigInt(10) ** BigInt(USDC_DECIMALS);
  const dollars = (value / unit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const fraction = (value % unit).toString().padStart(USDC_DECIMALS, "0").replace(/0+$/, "");

  return `$${dollars}.${fraction.padEnd(2, "0")}`;
}
