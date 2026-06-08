/**
 * Simple in-memory rate limiting middleware
 * Tracks requests per IP address and enforces limits
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  windowMs: number = 60000, // 1 minute default
  maxRequests: number = 100 // 100 requests per window
) {
  return (req: any, res: any, next: any) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    // Initialize or get existing record
    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    store[ip].count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - store[ip].count));
    res.setHeader('X-RateLimit-Reset', store[ip].resetTime);

    // Check if limit exceeded
    if (store[ip].count > maxRequests) {
      res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil((store[ip].resetTime - now) / 1000),
      });
      return;
    }

    next();
  };
}

/**
 * Cleanup old entries from store periodically
 */
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((ip) => {
    if (now > store[ip].resetTime + 60000) {
      delete store[ip];
    }
  });
}, 60000); // Cleanup every minute

cleanupTimer.unref?.();
