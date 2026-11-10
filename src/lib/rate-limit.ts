/**
 * Simple in-memory rate limiter.
 * Limits requests per IP per time window.
 * For production, replace with Redis-based solution.
 */

const requests = new Map<string, { count: number; resetTime: number }>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of requests) {
      if (now > val.resetTime) requests.delete(key);
    }
  }, 5 * 60 * 1000).unref?.();
}

export function checkRateLimit(
  ip: string,
  maxRequests: number = 30,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = ip;
  const entry = requests.get(key);

  if (!entry || now >= entry.resetTime) {
    // Bound memory even if many distinct clients arrive within one window.
    if (!entry && requests.size >= 10000) {
      for (const [key, value] of requests) {
        if (now >= value.resetTime) requests.delete(key);
      }
      if (requests.size >= 10000) return { allowed: false, remaining: 0 };
    }
    requests.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}
