'use server';

const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests
const WINDOW_SIZE_IN_MILLISECONDS = 60 * 1000; // 1 minute

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory store for request counts. In production, use Redis or similar.
const ipRequestCounts = new Map<string, RateLimitEntry>();

export async function checkRateLimit(ip: string): Promise<{ limited: boolean; message?: string }> {
  const now = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || entry.windowStart < now - WINDOW_SIZE_IN_MILLISECONDS) {
    // New window or expired entry: reset count and window start time
    ipRequestCounts.set(ip, { count: 1, windowStart: now });
    return { limited: false };
  }

  // Current window: check count
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    const timeLeft = Math.ceil((entry.windowStart + WINDOW_SIZE_IN_MILLISECONDS - now) / 1000);
    return { 
      limited: true, 
      message: `Rate limit exceeded. Try again in ${timeLeft > 0 ? timeLeft : 1} seconds.` 
    };
  }

  // Increment count and update entry
  entry.count++;
  ipRequestCounts.set(ip, entry);
  return { limited: false };
}
