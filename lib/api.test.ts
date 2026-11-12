import { describe, it, expect, vi, afterEach } from "vitest";
import { ApiError, apiRequest } from "./api";

function respond(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("apiRequest", () => {
  it("returns the data of a successful envelope", async () => {
    respond({ success: true, data: { usdc: "5" } });
    await expect(apiRequest("/wallet/balances")).resolves.toEqual({ usdc: "5" });
  });

  it("sends JSON, headers and method", async () => {
    respond({ success: true, data: {} });
    await apiRequest("/x", { method: "POST", headers: { Authorization: "Bearer t" }, body: { a: 1 } });
    const [url, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(String(url)).toMatch(/\/x$/);
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json", Authorization: "Bearer t" });
    expect(init.body).toBe('{"a":1}');
  });

  it("throws ApiError with code and message from an error envelope", async () => {
    respond({ success: false, error: { code: "WALLET_NOT_READY", message: "still creating" } }, 403);
    const error = await apiRequest("/x").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: "WALLET_NOT_READY", message: "still creating", status: 403 });
  });

  it("understands the older { error: string } shape", async () => {
    respond({ error: "Unauthorized: Missing identity or auth token" }, 401);
    const error = await apiRequest("/x").catch((e) => e);
    expect(error).toMatchObject({ code: "UNAUTHORIZED", status: 401 });
  });

  it("throws on a non-JSON response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>", { status: 502 })));
    const error = await apiRequest("/x").catch((e) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(502);
  });

  it("maps an unreachable server to NETWORK_ERROR", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const error = await apiRequest("/x").catch((e) => e);
    expect(error).toMatchObject({ code: "NETWORK_ERROR" });
  });
});
