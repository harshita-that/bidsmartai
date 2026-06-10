import type { Request, Response, NextFunction } from 'express';

import { authService } from '../services/auth.service.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleOAuthSchema,
  validate,
} from '../validators/auth.validators.js';

// ── Auth Controller ───────────────────────────────────────────────────────────

export const authController = {
  /**
   * POST /api/v1/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validate(registerSchema, req.body);
      const result = await authService.register(input);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validate(loginSchema, req.body);
      const result = await authService.login(input);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/refresh
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = validate(refreshTokenSchema, req.body);
      const tokens = await authService.refresh(refreshToken);
      res.status(200).json({ success: true, data: tokens });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = validate(refreshTokenSchema, req.body);
      await authService.logout(refreshToken);
      res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validate(forgotPasswordSchema, req.body);
      await authService.forgotPassword(input);
      res.status(200).json({
        success: true,
        data: { message: 'If an account exists with that email, a reset link has been sent.' },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validate(resetPasswordSchema, req.body);
      await authService.resetPassword(input);
      res.status(200).json({
        success: true,
        data: { message: 'Password has been successfully reset.' },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/v1/auth/oauth/google
   */
  async googleOAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = validate(googleOAuthSchema, req.body);
      const result = await authService.googleOAuth(input);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

// ── User Profile Controller ───────────────────────────────────────────────────

export const userController = {
  /**
   * GET /api/v1/user/profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await authService.getProfile(req.userId!);
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/v1/user/profile
   */
  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, avatarUrl } = req.body as { name?: string; avatarUrl?: string };
      const profile = await authService.updateProfile(req.userId!, { name, avatarUrl });
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },
};
