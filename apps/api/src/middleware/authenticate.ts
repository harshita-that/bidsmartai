import type { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

// Extend Express Request to carry authenticated user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userTier?: string;
    }
  }
}

/**
 * Verifies the Bearer JWT on protected routes.
 * Attaches userId, userEmail, userTier to req.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHORIZED', 'Missing or invalid Authorization header'));
  }

  const token = authHeader.slice(7);
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    req.userTier = payload.tier;
    next();
  } catch {
    next(new AppError(401, 'INVALID_TOKEN', 'Access token is invalid or expired'));
  }
}

/**
 * Requires the authenticated user to have one of the specified tiers.
 * Must be used after the `authenticate` middleware.
 */
export function requireTier(...tiers: string[]) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    const tier = _req.userTier;
    if (!tier || !tiers.includes(tier)) {
      return next(
        new AppError(
          403,
          'TIER_REQUIRED',
          `This feature requires a ${tiers.join(' or ')} subscription`,
        ),
      );
    }
    next();
  };
}
