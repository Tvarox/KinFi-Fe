import { getBase58Decoder } from "@solana/kit";

const USDC_DECIMALS = 6;

/** Returned by POST /wallet/send/prepare. */
export interface PreparedSend {
  send_id: string;
  /** Unsigned transaction, base64. */
  transaction: string;
  from_address: string;
  to_address: string;
  /** USDC base units, integer string. */
  amount: string;
  network: "solana";
  expires_at: string;
}

export type SendStatus = "prepared" | "submitted" | "confirmed" | "failed" | "expired";

/** Returned by GET /wallet/send/:id and POST /wallet/send/:id/submitted. */
export interface SendStatusData {
  id: string;
  status: SendStatus;
  signature: string | null;
  /** A message that is safe to show the user, or null. */
  error: string | null;
}

export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** A transaction signature as the usual base58 text, from the raw 64 bytes. */
export function signatureToBase58(bytes: Uint8Array): string {
  return getBase58Decoder().decode(bytes);
}

export function explorerTxUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}`;
}

const ADDRESS_PATTERN = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
// Same rule as the backend: up to 12 whole digits, up to 6 decimals.
const AMOUNT_PATTERN = /^(\d{1,12})(?:\.(\d{1,6}))?$/;

/** "10.25" to base units. Null if it is not a positive amount with at most 6 decimals. */
export function amountToBaseUnits(amount: string): string | null {
  const match = AMOUNT_PATTERN.exec(amount);
  if (!match) return null;

  const whole = BigInt(match[1]);
  const fraction = BigInt((match[2] ?? "").padEnd(USDC_DECIMALS, "0"));
  const value = whole * BigInt(10) ** BigInt(USDC_DECIMALS) + fraction;
  return value > BigInt(0) ? value.toString() : null;
}

export interface SendInputCheck {
  canSubmit: boolean;
  addressError: string | null;
  amountError: string | null;
}

/**
 * Quick checks so the form can guide the user. The backend checks everything
 * again, so this is only for a better experience, never for safety.
 * An error only shows for a field the user has started filling in.
 */
export function checkSendInput(input: {
  to: string;
  amount: string;
  /** The user's balance in base units, if known. */
  available?: string | null;
}): SendInputCheck {
  const to = input.to.trim();
  const amount = input.amount.trim();

  const addressError =
    to !== "" && !ADDRESS_PATTERN.test(to) ? "Enter a valid Solana address." : null;

  let amountError: string | null = null;
  const base = amount === "" ? null : amountToBaseUnits(amount);
  if (amount !== "" && base === null) {
    amountError = "Enter an amount like 10.25, with at most 6 decimal places.";
  } else if (base !== null && input.available != null && /^\d+$/.test(input.available)) {
    if (BigInt(base) > BigInt(input.available)) amountError = "That is more than your balance.";
  }

  return {
    canSubmit: to !== "" && amount !== "" && addressError === null && amountError === null && base !== null,
    addressError,
    amountError,
  };
}

/** The decimal string for the Max button: the whole balance, e.g. "1842.6". */
export function baseUnitsToAmountInput(baseUnits: string): string {
  const value = BigInt(baseUnits);
  const unit = BigInt(10) ** BigInt(USDC_DECIMALS);
  const fraction = (value % unit).toString().padStart(USDC_DECIMALS, "0").replace(/0+$/, "");
  return fraction ? `${value / unit}.${fraction}` : (value / unit).toString();
}
