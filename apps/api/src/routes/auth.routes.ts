import { Router } from 'express';

import { authController } from '../controllers/auth.controller.js';
import { authRateLimit } from '../middleware/rateLimiter.js';
import { redis } from '../db/redis.js';

export const authRouter = Router();

// Apply rate limiter to all auth routes
authRouter.use(authRateLimit(redis));

/**
 * POST /api/v1/auth/register
 * Body: { name, email, password }
 */
authRouter.post('/register', (req, res, next) => {
  void authController.register(req, res, next);
});

/**
 * POST /api/v1/auth/login
 * Body: { email, password }
 */
authRouter.post('/login', (req, res, next) => {
  void authController.login(req, res, next);
});

/**
 * POST /api/v1/auth/refresh
 * Body: { refreshToken }
 */
authRouter.post('/refresh', (req, res, next) => {
  void authController.refresh(req, res, next);
});

/**
 * POST /api/v1/auth/logout
 * Body: { refreshToken }
 */
authRouter.post('/logout', (req, res, next) => {
  void authController.logout(req, res, next);
});

/**
 * POST /api/v1/auth/forgot-password
 * Body: { email }
 */
authRouter.post('/forgot-password', (req, res, next) => {
  void authController.forgotPassword(req, res, next);
});

/**
 * POST /api/v1/auth/reset-password
 * Body: { token, password }
 */
authRouter.post('/reset-password', (req, res, next) => {
  void authController.resetPassword(req, res, next);
});

/**
 * POST /api/v1/auth/oauth/google
 * Body: { idToken }
 */
authRouter.post('/oauth/google', (req, res, next) => {
  void authController.googleOAuth(req, res, next);
});
