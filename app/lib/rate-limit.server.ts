type Bucket = { tokens: number; lastRefill: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000;
const MAX_TOKENS = 3;

export function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
} {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing) {
    buckets.set(key, { tokens: MAX_TOKENS - 1, lastRefill: now });
    return { allowed: true, remaining: MAX_TOKENS - 1, retryAfterMs: 0 };
  }

  const elapsed = now - existing.lastRefill;
  const refill = Math.floor((elapsed / WINDOW_MS) * MAX_TOKENS);
  const tokens = Math.min(MAX_TOKENS, existing.tokens + refill);
  const lastRefill = refill > 0 ? now : existing.lastRefill;

  if (tokens <= 0) {
    const retryAfterMs = Math.max(0, WINDOW_MS - elapsed);
    buckets.set(key, { tokens, lastRefill });
    return { allowed: false, remaining: 0, retryAfterMs };
  }

  buckets.set(key, { tokens: tokens - 1, lastRefill });
  return { allowed: true, remaining: tokens - 1, retryAfterMs: 0 };
}

export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "anonymous";
}
