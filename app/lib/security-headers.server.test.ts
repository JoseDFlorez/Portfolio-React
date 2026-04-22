import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("buildSecurityHeaders", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("sets every expected directive in dev", async () => {
    process.env.NODE_ENV = "development";
    const { buildSecurityHeaders } = await import("./security-headers.server");
    const headers = buildSecurityHeaders();
    expect(headers["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(headers["Content-Security-Policy"]).toContain("'unsafe-inline'");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers["Strict-Transport-Security"]).toBeUndefined();
  });

  it("adds HSTS in production and tightens script-src", async () => {
    process.env.NODE_ENV = "production";
    const { buildSecurityHeaders } = await import("./security-headers.server");
    const headers = buildSecurityHeaders();
    expect(headers["Strict-Transport-Security"]).toContain("max-age=");
    const csp = headers["Content-Security-Policy"]!;
    const scriptSrc = csp
      .split(";")
      .map((p) => p.trim())
      .find((p) => p.startsWith("script-src"));
    expect(scriptSrc).toBe("script-src 'self'");
  });
});
