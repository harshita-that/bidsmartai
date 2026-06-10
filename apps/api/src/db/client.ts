import { PrismaClient } from '@prisma/client';

import { logger } from '../utils/logger.js';

// ── Prisma Singleton ──────────────────────────────────────────────────────────
// Prevents multiple client instances in development (hot-reload)

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'warn' },
            { emit: 'event', level: 'error' },
          ]
        : [
            { emit: 'event', level: 'warn' },
            { emit: 'event', level: 'error' },
          ],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = db;
}

// Log slow queries in development
if (process.env['NODE_ENV'] === 'development') {
  // @ts-expect-error — Prisma event types
  db.$on('query', (e: { query: string; duration: number }) => {
    if (e.duration > 200) {
      logger.warn({ query: e.query, durationMs: e.duration }, 'Slow query detected');
    }
  });
}

// @ts-expect-error — Prisma event types
db.$on('warn', (e: { message: string }) => logger.warn({ msg: e.message }, 'Prisma warn'));
// @ts-expect-error — Prisma event types
db.$on('error', (e: { message: string }) => logger.error({ msg: e.message }, 'Prisma error'));

// ── Health check helper ───────────────────────────────────────────────────────
export async function checkDbConnection(): Promise<{ ok: boolean; latencyMs?: number }> {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return { ok: true, latencyMs: Date.now() - start };
  } catch {
    return { ok: false };
  }
}
