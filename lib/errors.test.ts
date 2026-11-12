import { describe, it, expect } from "vitest";
import { ApiError } from "./api";
import { describeError } from "./errors";

describe("describeError", () => {
  it("asks the user to sign in again when the session expired", () => {
    expect(describeError(new ApiError("x", "UNAUTHORIZED", 401))).toMatch(/sign in again/i);
  });

  it("hides provider details when Solana is unavailable", () => {
    const message = describeError(new ApiError("Solana RPC: Unavailable", "EXTERNAL_SERVICE_ERROR", 502));
    expect(message).not.toMatch(/RPC/);
    expect(message).toMatch(/Solana/);
  });

  it("passes a network message through", () => {
    expect(describeError(new ApiError("Cannot reach Kinfi right now.", "NETWORK_ERROR"))).toBe(
      "Cannot reach Kinfi right now.",
    );
  });

  it("never shows an arbitrary error's text", () => {
    expect(describeError(new Error("secret internal detail"))).toBe(
      "Something went wrong. Please try again.",
    );
  });
});
