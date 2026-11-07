// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8787/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function fetchBackend<T = any>(
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  } = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", headers = {}, body } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: ApiResponse<T>;
  try {
    data = await res.json();
  } catch {
    data = {
      success: false,
      error: { code: "INVALID_RESPONSE", message: "Backend returned invalid JSON" },
    };
  }

  if (!res.ok) {
    return data;
  }

  return data;
}
