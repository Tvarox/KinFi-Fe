import { describe, it, expect } from "vitest";
import {
  amountToBaseUnits,
  base64ToBytes,
  baseUnitsToAmountInput,
  checkSendInput,
  explorerTxUrl,
  signatureToBase58,
} from "./send";
import { formatUsdcPrecise } from "./format";

const ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

describe("amountToBaseUnits", () => {
  it("converts exactly", () => {
    expect(amountToBaseUnits("10")).toBe("10000000");
    expect(amountToBaseUnits("10.25")).toBe("10250000");
    expect(amountToBaseUnits("0.000001")).toBeNull();
    expect(amountToBaseUnits("0.3")).toBe("300000");
    expect(amountToBaseUnits("4.35")).toBe("4350000");
  });

  it("rejects zero, negatives, extra decimals and junk", () => {
    for (const bad of ["0", "0.0", "-1", "1.000001", "", " 1", "1,5", "1e3", "abc", ".5", "1."]) {
      expect(amountToBaseUnits(bad)).toBeNull();
    }
  });
});

describe("checkSendInput", () => {
  it("allows a valid address and amount", () => {
    expect(checkSendInput({ to: ADDRESS, amount: "5" })).toEqual({ canSubmit: true, addressError: null, amountError: null });
  });

  it("does not nag about empty fields, but does not allow submit", () => {
    expect(checkSendInput({ to: "", amount: "" })).toEqual({ canSubmit: false, addressError: null, amountError: null });
  });

  it("flags an invalid address once the user typed one", () => {
    const check = checkSendInput({ to: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", amount: "1" });
    expect(check.canSubmit).toBe(false);
    expect(check.addressError).toMatch(/valid Solana address/);
  });

  it("flags a bad amount", () => {
    expect(checkSendInput({ to: ADDRESS, amount: "1.123456" }).amountError).toMatch(/5 decimal/);
    expect(checkSendInput({ to: ADDRESS, amount: "0" }).canSubmit).toBe(false);
  });

  it("flags more than the balance, and allows exactly the balance", () => {
    expect(checkSendInput({ to: ADDRESS, amount: "10.01", available: "10000000" })).toMatchObject({
      canSubmit: false,
      amountError: "That is more than your balance.",
    });
    expect(checkSendInput({ to: ADDRESS, amount: "10", available: "10000000" }).canSubmit).toBe(true);
  });

  it("does not block when the balance is not known yet", () => {
    expect(checkSendInput({ to: ADDRESS, amount: "999999", available: null }).canSubmit).toBe(true);
    expect(checkSendInput({ to: ADDRESS, amount: "999999" }).canSubmit).toBe(true);
  });

  it("ignores surrounding whitespace in the address", () => {
    expect(checkSendInput({ to: `  ${ADDRESS} `, amount: "1" }).canSubmit).toBe(true);
  });
});

describe("baseUnitsToAmountInput", () => {
  it("makes a value for the Max button", () => {
    expect(baseUnitsToAmountInput("1842600000")).toBe("1842.6");
    expect(baseUnitsToAmountInput("50000000")).toBe("50");
    expect(baseUnitsToAmountInput("1")).toBe("0");
    expect(baseUnitsToAmountInput("0")).toBe("0");
  });

  it("round-trips through amountToBaseUnits", () => {
    for (const value of ["1842600000", "123456789", "50000000"]) {
      expect(amountToBaseUnits(baseUnitsToAmountInput(value))).toBe(value === "123456789" ? "123456780" : value);
    }
  });
});

describe("formatUsdcPrecise", () => {
  it("keeps every real decimal, at least two", () => {
    expect(formatUsdcPrecise("10255000")).toBe("$10.255");
    expect(formatUsdcPrecise("10250000")).toBe("$10.25");
    expect(formatUsdcPrecise("10000000")).toBe("$10.00");
    expect(formatUsdcPrecise("1")).toBe("$0.000001");
    expect(formatUsdcPrecise("1234567890000")).toBe("$1,234,567.89");
  });

  it("returns null for bad input", () => {
    expect(formatUsdcPrecise(undefined)).toBeNull();
    expect(formatUsdcPrecise("1.5")).toBeNull();
  });
});

describe("encoding helpers", () => {
  it("decodes base64 to bytes", () => {
    expect(Array.from(base64ToBytes("AQID"))).toEqual([1, 2, 3]);
    expect(base64ToBytes("")).toEqual(new Uint8Array());
  });

  it("encodes raw signature bytes as base58 text of the usual length", () => {
    const bytes = new Uint8Array(64).fill(7);
    const text = signatureToBase58(bytes);
    expect(text).toMatch(/^[1-9A-HJ-NP-Za-km-z]{80,90}$/);
  });

  it("links a signature to the explorer", () => {
    expect(explorerTxUrl("abc")).toBe("https://explorer.solana.com/tx/abc");
  });
});
