import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { pinoHttp } from 'pino-http';

import { logger } from './utils/logger.js';
import { requestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { router } from './routes/index.js';

// ── App Setup ─────────────────────────────────────────────────────────────────
const app = express();

// Security headers
app.use(helmet());

// CORS
const allowedOrigins = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
logger.info({ allowedOrigins }, 'CORS allowed origins');
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (server-to-server, health checks)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      logger.warn({ origin, allowedOrigins }, 'CORS rejected origin');
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

// Request ID (attach before logging so it appears in logs)
app.use(requestId);

// Structured HTTP logging
app.use(
  pinoHttp({
    logger,
    customProps: (req: any) => ({ requestId: req.headers['x-request-id'] }),
    serializers: {
      req: (req: { method: string; url: string }) => ({ method: req.method, url: req.url }),
    },
  }),
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/v1', router);

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── 404 Catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = parseInt(process.env['PORT'] ?? '3001', 10);
const HOST = process.env['HOST'] ?? '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  logger.info({ port: PORT, env: process.env['NODE_ENV'] }, '🚀 BidSmart API started');
});

// ── Graceful Shutdown ─────────────────────────────────────────────────────────
const shutdown = (signal: string) => {
  logger.info({ signal }, 'Shutting down gracefully...');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { app };
