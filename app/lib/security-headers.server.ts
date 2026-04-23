import { env } from "./env.server";

type SecurityHeaderOptions = {
  scriptNonce?: string;
};

export function createCspNonce(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function buildSecurityHeaders(options: SecurityHeaderOptions = {}): Record<string, string> {
  const isProd = env.NODE_ENV === "production";
  const prodScriptSrc = options.scriptNonce
    ? `script-src 'self' 'nonce-${options.scriptNonce}'`
    : "script-src 'self'";

  const csp = [
    "default-src 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    isProd ? prodScriptSrc : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "connect-src 'self' https://api.resend.com" + (isProd ? "" : " ws: wss:"),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  const headers: Record<string, string> = {
    "Content-Security-Policy": csp,
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  };

  if (isProd) {
    headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload";
  }

  return headers;
}

export function applySecurityHeaders(
  responseHeaders: Headers,
  options: SecurityHeaderOptions = {},
) {
  for (const [key, value] of Object.entries(buildSecurityHeaders(options))) {
    responseHeaders.set(key, value);
  }
}
