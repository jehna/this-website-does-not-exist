const MAX_CACHE_SIZE = 100;

const COOLDOWN_SECONDS = 10;

/**
 * Okay, so just to handle excess requests from e.g. Hacker News, we need some
 * way to throttle the requests that we do to Cerebras. This is a super simple
 * way of using a previous, cached response only if we get too many requests.
 */
export function throttled<T>(fn: () => Promise<T>): () => Promise<T> {
  const cache: T[] = [];
  let lastCall = 0;

  return async () => {
    const now = Date.now();
    if (now - lastCall < COOLDOWN_SECONDS * 1000) {
      return cache[Math.floor(Math.random() * cache.length)];
    }
    lastCall = now;
    const result = await fn();
    while (cache.length >= MAX_CACHE_SIZE) {
      cache.shift();
    }
    cache.push(result);
    return result;
  };
}
