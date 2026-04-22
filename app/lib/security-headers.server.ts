import { env } from "./env.server";

export function buildSecurityHeaders(): Record<string, string> {
  const isProd = env.NODE_ENV === "production";

  const csp = [
    "default-src 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    isProd ? "script-src 'self'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
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
    headers["Strict-Transport-Security"] =
      "max-age=63072000; includeSubDomains; preload";
  }

  return headers;
}

export function applySecurityHeaders(responseHeaders: Headers) {
  for (const [key, value] of Object.entries(buildSecurityHeaders())) {
    responseHeaders.set(key, value);
  }
}
