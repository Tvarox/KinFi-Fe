export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8787/api";

/** An error from the Kinfi backend, or from reaching it. */
export class ApiError extends Error {
  constructor(
    message: string,
    /** Machine-readable code, e.g. "WALLET_NOT_READY". */
    public readonly code: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface Envelope<T> {
  success?: boolean;
  data?: T;
  error?: { code?: string; message?: string } | string;
}

/**
 * Call the backend and return the `data` of a successful response.
 * Throws ApiError for HTTP errors, error envelopes and unreachable servers.
 */
export async function apiRequest<T>(
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
  } = {},
): Promise<T> {
  const { method = "GET", headers = {}, body } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Cannot reach Kinfi right now.", "NETWORK_ERROR");
  }

  let payload: Envelope<T> | null = null;
  try {
    payload = (await response.json()) as Envelope<T>;
  } catch {
    // Not JSON. Handled below.
  }

  if (!response.ok || payload?.success === false || !payload) {
    // Older routes returned { error: "message" } instead of an envelope.
    const error = payload?.error;
    const message =
      typeof error === "string" ? error : (error?.message ?? undefined);
    const code = typeof error === "string" ? undefined : error?.code;
    throw new ApiError(
      message ?? `Request failed (${response.status})`,
      code ?? (response.status === 401 ? "UNAUTHORIZED" : "REQUEST_FAILED"),
      response.status,
    );
  }

  return payload.data as T;
}
