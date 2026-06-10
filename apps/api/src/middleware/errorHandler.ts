import type { Request, Response, NextFunction } from 'express';

import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.headers['x-request-id'] as string | undefined;

  // Handle known application errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId }, 'Application error');
    } else {
      logger.warn({ err: { message: err.message, code: err.code }, requestId }, 'Client error');
    }

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
      ...(requestId ? { meta: { requestId } } : {}),
    });
    return;
  }

  // Handle Zod validation errors (passed through from validators)
  if (err.name === 'ZodError') {
    res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: err },
      ...(requestId ? { meta: { requestId } } : {}),
    });
    return;
  }

  // Unhandled / unexpected errors
  logger.error({ err, requestId }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env['NODE_ENV'] === 'production'
          ? 'An unexpected error occurred'
          : (err.message ?? 'Unknown error'),
    },
    ...(requestId ? { meta: { requestId } } : {}),
  });
}
