type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 100;

export function checkRateLimit(sourceId: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(sourceId);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(sourceId, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (bucket.count >= MAX_REQUESTS) {
    return false;
  }

  bucket.count += 1;
  return true;
}
