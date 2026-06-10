import { Router } from 'express';
import type { Request, Response } from 'express';
import os from 'os';

import { checkDbConnection } from '../db/client.js';
import { redis } from '../db/redis.js';

export const healthRouter = Router();

/**
 * GET /api/v1/health
 * Returns live service health status — pings DB and reports latency.
 */
healthRouter.get('/', async (_req: Request, res: Response) => {
  const uptimeSeconds = process.uptime();
  const memUsage = process.memoryUsage();

  // Run DB and Redis health checks
  const [dbCheck, redisPing] = await Promise.all([
    Promise.race([
      checkDbConnection(),
      new Promise<{ ok: false }>((resolve) => setTimeout(() => resolve({ ok: false }), 3000)),
    ]),
    Promise.race([
      redis.ping().then(() => true).catch(() => false),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000)),
    ]),
  ]);

  const allHealthy = dbCheck.ok && redisPing;
  const statusCode = allHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: allHealthy,
    data: {
      status: allHealthy ? 'ok' : 'degraded',
      version: process.env['npm_package_version'] ?? '0.1.0',
      environment: process.env['NODE_ENV'] ?? 'development',
      uptime: {
        seconds: Math.floor(uptimeSeconds),
        human: formatUptime(uptimeSeconds),
      },
      memory: {
        heapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memUsage.heapTotal / 1024 / 1024),
        rssMB: Math.round(memUsage.rss / 1024 / 1024),
      },
      system: {
        platform: os.platform(),
        nodeVersion: process.version,
        cpus: os.cpus().length,
      },
      services: {
        database: dbCheck.ok
          ? { status: 'ok', latencyMs: dbCheck.latencyMs }
          : { status: 'error' },
        redis: redisPing ? { status: 'ok' } : { status: 'error' },
      },
      timestamp: new Date().toISOString(),
    },
  });
});

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
