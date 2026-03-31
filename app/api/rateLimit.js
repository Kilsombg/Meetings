const requestLog = new Map();

export function isRateLimited(ip, limit = 5, windowMs = 60_000) {
  const now = Date.now();

  if (!requestLog.has(ip)) {
    requestLog.set(ip, []);
  }

  const timestamps = requestLog.get(ip).filter(t => now - t < windowMs);

  if (timestamps.length >= limit) {
    return true;
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);

  return false;
}