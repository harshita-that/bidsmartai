import { Redis } from 'ioredis';
import { logger } from '../utils/logger.js';

const redisUrl = process.env['REDIS_URL'];

// Only connect to Redis if REDIS_URL is provided
// Without Redis, rate limiting is disabled (fail-open)
function createRedisClient(): Redis | null {
  if (!redisUrl) {
    logger.warn('REDIS_URL not set — Redis disabled. Rate limiting will be skipped.');
    return null;
  }

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy(times: number) {
      if (times > 10) {
        logger.error('Redis max retries reached, giving up');
        return null; // stop retrying
      }
      const delay = Math.min(times * 200, 5000);
      return delay;
    },
  });

  client.on('error', (err: Error) => {
    logger.error({ err }, 'Redis connection error');
  });

  client.on('connect', () => {
    logger.info('Redis connected successfully');
  });

  return client;
}

export const redis = createRedisClient();
