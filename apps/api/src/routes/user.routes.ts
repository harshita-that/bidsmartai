import { Router } from 'express';

import { userController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';

export const userRouter = Router();

/**
 * All user routes require authentication.
 */
userRouter.use(authenticate);

/**
 * GET /api/v1/user/profile
 * Returns the authenticated user's profile.
 */
userRouter.get('/profile', (req, res, next) => {
  void userController.getProfile(req, res, next);
});

/**
 * PUT /api/v1/user/profile
 * Body: { name?, avatarUrl? }
 */
userRouter.put('/profile', (req, res, next) => {
  void userController.updateProfile(req, res, next);
});
