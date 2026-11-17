import { ApiError } from "./api";

/** Turn any error into a short message that is safe to show a user. */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.code) {
      case "UNAUTHORIZED":
        return "Your session expired. Please sign in again.";
      case "EXTERNAL_SERVICE_ERROR":
        return "Could not read from Solana. Please try again.";
      case "WALLET_NOT_READY":
        return "Your wallet is still being created. Please wait a moment.";
      case "NETWORK_ERROR":
        return error.message;
      default:
        return error.message || "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}
