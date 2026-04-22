import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '~/env';
import { PLAN_LIMITS, type RateLimitFeature, type UserPlanKey } from './plans';

/**
 * Initializes the Redis client using environment variables for Upstash Redis.
 * If the necessary environment variables are missing, redis will be null and rate limiting is bypassed.
 */
const redis =
	env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null;

/**
 * In-memory cache to store Ratelimit instances for each unique (plan, feature) combination.
 * Prevents creating multiple Ratelimit instances for the same configuration.
 */
const limiterCache = new Map<string, Ratelimit>();

/**
 * Returns a memoized Ratelimit instance for the given user plan and feature.
 * If no Redis connection is available or no rate limit config is found for the feature, returns null.
 *
 * @param plan - The user's subscription plan.
 * @param feature - The particular feature being rate-limited.
 * @returns {Ratelimit | null} - A Ratelimit instance for this plan & feature, or null if unavailable.
 */
function getLimiter(plan: UserPlanKey, feature: RateLimitFeature): Ratelimit | null {
	if (!redis) return null;
	const cfg = PLAN_LIMITS[plan]?.[feature] ?? PLAN_LIMITS.free[feature];
	if (!('points' in cfg)) return null;

	const key = `${plan}:${feature}`;
	if (!limiterCache.has(key)) {
		limiterCache.set(
			key,
			new Ratelimit({
				redis,
				limiter: Ratelimit.slidingWindow(cfg.points, cfg.window),
				prefix: `eg:rl:${key}`,
				analytics: true
			})
		);
	}
	return limiterCache.get(key) ?? null;
}

/**
 * Enforces the rate limit for a given identifier (e.g., userId or IP), user plan, and feature.
 * Uses Upstash Redis and configured rate limit quotas based on the user's plan and the feature.
 *
 * @param identifier - A unique identifier to be rate-limited (e.g. user ID or API key).
 * @param plan - The user's subscription plan (used to determine their limits).
 * @param feature - The feature being accessed (determines which rate limit to apply).
 * @returns {Promise<{ ok: true } | { ok: false; message: string }>} - Success object or rate limit exceeded message.
 */
export async function enforceRateLimit(
	identifier: string,
	plan: UserPlanKey,
	feature: RateLimitFeature
): Promise<{ ok: true } | { ok: false; message: string }> {
	const limiter = getLimiter(plan, feature);
	if (!limiter) return { ok: true };
	const { success } = await limiter.limit(identifier);
	if (!success) return { ok: false, message: 'Too many requests — try again later.' };
	return { ok: true };
}
