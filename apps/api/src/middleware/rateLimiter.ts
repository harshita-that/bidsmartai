import type { Request, Response, NextFunction } from 'express';
import type { Redis } from 'ioredis';

import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

interface RateLimiterOptions {
  /** Window size in seconds */
  windowSec: number;
  /** Max requests allowed per window */
  maxRequests: number;
  /** Key prefix to namespace different limiters */
  keyPrefix?: string;
}

/**
 * Sliding window rate limiter backed by Redis.
 * Falls back to allow-all if Redis is unavailable (fail-open for availability).
 */
export function createRateLimiter(redis: Redis | null, opts: RateLimiterOptions) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!redis || redis.status !== 'ready') {
      // Redis not available — fail open
      return next();
    }

    const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const userId = (req as Request & { userId?: string }).userId;
    const identifier = userId ?? ip;
    const prefix = opts.keyPrefix ?? 'rl';
    const key = `${prefix}:${identifier}`;
    const now = Date.now();
    const windowMs = opts.windowSec * 1000;

    try {
      const pipeline = redis.pipeline();
      // Remove expired entries
      pipeline.zremrangebyscore(key, 0, now - windowMs);
      // Count current entries
      pipeline.zcard(key);
      // Add current request
      pipeline.zadd(key, now, `${now}-${Math.random()}`);
      // Reset TTL
      pipeline.expire(key, opts.windowSec + 1);

      const results = await pipeline.exec();
      const count = (results?.[1]?.[1] as number) ?? 0;

      res.setHeader('X-RateLimit-Limit', opts.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, opts.maxRequests - count - 1));
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

      if (count >= opts.maxRequests) {
        throw new AppError(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests — please slow down');
      }

      next();
    } catch (err) {
      if (err instanceof AppError) return next(err);
      // Redis error — log and fail open
      logger.warn({ err }, 'Rate limiter Redis error — failing open');
      next();
    }
  };
}

// ── Pre-built limiters (instantiated lazily with Redis client) ────────────────

/** Auth endpoints: 10 requests per minute */
export const authRateLimit = (redis: Redis | null) =>
  createRateLimiter(redis, { windowSec: 60, maxRequests: 10, keyPrefix: 'rl:auth' });

/** General API: configurable per tier */
export const apiRateLimit = (redis: Redis | null, maxRequests = 60) =>
  createRateLimiter(redis, { windowSec: 60, maxRequests, keyPrefix: 'rl:api' });
