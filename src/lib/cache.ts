import { Redis } from "@upstash/redis";

// Falls back gracefully if env vars aren't set (local dev without Redis)
const hasRedis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasRedis
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// TTLs in seconds — mirrors what the Go backend used
export const TTL = {
  schedule: 6 * 60 * 60, // 6 hr
  search: 6 * 60 * 60, // 6 hr
  genres: 7 * 24 * 60 * 60, // 7 days
  anime: 3 * 60 * 60, // 3 hr (releasing/default)
  finished: 7 * 24 * 60 * 60, // 7 days
} as const;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number,
): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {
    // Cache failure is non-fatal — just skip
  }
}

export async function cacheDel(...keys: string[]): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(...keys);
  } catch {}
}
