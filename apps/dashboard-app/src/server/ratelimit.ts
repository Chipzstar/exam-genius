import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '~/env';
import { PLAN_LIMITS, type RateLimitFeature, type UserPlanKey } from './plans';

const redis =
	env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null;

const limiterCache = new Map<string, Ratelimit>();

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
