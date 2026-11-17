import { describe, it, expect } from "vitest";
import { formatUsdc, shortenAddress } from "./format";

describe("formatUsdc", () => {
  it("formats base units as dollars", () => {
    expect(formatUsdc("1842600000")).toBe("$1,842.60");
  });

  it("formats zero", () => {
    expect(formatUsdc("0")).toBe("$0.00");
  });

  it("pads small amounts", () => {
    expect(formatUsdc("5")).toBe("$0.00"); // 0.000005 dollars
    expect(formatUsdc("10000")).toBe("$0.01");
    expect(formatUsdc("1000000")).toBe("$1.00");
  });

  it("truncates and never rounds up", () => {
    expect(formatUsdc("1999999")).toBe("$1.99");
    expect(formatUsdc("9999999")).toBe("$9.99");
  });

  it("adds thousands separators", () => {
    expect(formatUsdc("1000000000000")).toBe("$1,000,000.00");
  });

  it("keeps full precision above 2^53 base units", () => {
    // 9,007,199,254.740993 USDC. Number() would lose the last digits.
    expect(formatUsdc("9007199254740993")).toBe("$9,007,199,254.74");
  });

  it("returns null for anything that is not a non-negative integer string", () => {
    expect(formatUsdc(undefined)).toBeNull();
    expect(formatUsdc(null)).toBeNull();
    expect(formatUsdc("")).toBeNull();
    expect(formatUsdc("-5")).toBeNull();
    expect(formatUsdc("1.5")).toBeNull();
    expect(formatUsdc("abc")).toBeNull();
  });
});

describe("shortenAddress", () => {
  const address = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  it("shortens a long address", () => {
    expect(shortenAddress(address)).toBe("EPjF...Dt1v");
  });

  it("leaves short input alone", () => {
    expect(shortenAddress("abc")).toBe("abc");
  });
});
