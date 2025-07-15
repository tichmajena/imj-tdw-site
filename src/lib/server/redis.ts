import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { UPSTASH_REDIS_TOKEN, UPSTASH_REDIS_URL } from '$env/static/private';

export const redis = new Redis({
	url: UPSTASH_REDIS_URL,
	token: UPSTASH_REDIS_TOKEN
});

export const ratelimit = {
	create: new Ratelimit({
		redis,
		analytics: true,
		prefix: 'ratelimit:create',
		limiter: Ratelimit.slidingWindow(1, '360s')
	}),
	delete: new Ratelimit({
		redis,
		analytics: true,
		prefix: 'ratelimit:delete',
		limiter: Ratelimit.slidingWindow(1, '360s')
	})
};
export const daylimit = {
	create: new Ratelimit({
		redis,
		analytics: true,
		prefix: 'ratelimit:create',
		limiter: Ratelimit.slidingWindow(1, '15s')
	}),
	delete: new Ratelimit({
		redis,
		analytics: true,
		prefix: 'ratelimit:delete',
		limiter: Ratelimit.slidingWindow(1, '15s')
	})
};
