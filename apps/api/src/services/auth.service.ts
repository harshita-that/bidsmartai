import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import type { UserTier } from '@bidsmart/shared';

import { db } from '../db/client.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import {
  AuthError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../utils/errors.js';
import { emailService } from './email.service.js';
import { OAuth2Client } from 'google-auth-library';
import type { RegisterInput, LoginInput, GoogleOAuthInput, ForgotPasswordInput, ResetPasswordInput } from '../validators/auth.validators.js';

const googleClient = new OAuth2Client(process.env['GOOGLE_CLIENT_ID']);

const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_TTL_DAYS = 30;

// ── Helpers ───────────────────────────────────────────────────────────────────

function refreshTokenExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_TOKEN_TTL_DAYS);
  return d;
}

async function issueTokenPair(userId: string, email: string, tier: string) {
  const jti = uuidv4();
  const accessToken = signAccessToken({ sub: userId, email, tier });
  const refreshToken = signRefreshToken(userId, jti);

  // Store hashed refresh token in DB
  const tokenHash = await bcrypt.hash(refreshToken, 8);
  await db.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: refreshTokenExpiresAt(),
    },
  });

  return { accessToken, refreshToken, expiresIn: 15 * 60 }; // 15 min in seconds
}

// ── Auth Service ──────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Register a new user with email + password.
   * Returns JWT token pair on success.
   */
  async register(input: RegisterInput) {
    // Check for duplicate email
    const existing = await db.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ConflictError('An account with this email already exists', 'EMAIL_ALREADY_EXISTS');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    // Create user
    const user = await db.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        tier: 'free',
        status: 'active', // skip email verification for MVP
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        avatarUrl: true,
        lookupsUsed: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    const tokens = await issueTokenPair(user.id, user.email, user.tier);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier as UserTier,
        avatarUrl: user.avatarUrl ?? undefined,
        lookupsUsed: user.lookupsUsed,
        lookupsRemaining: 5,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
      },
      tokens,
    };
  },

  /**
   * Login with email + password.
   * Returns JWT token pair on success.
   */
  async login(input: LoginInput) {
    const user = await db.user.findUnique({ where: { email: input.email } });

    if (!user || !user.passwordHash) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const validPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!validPassword) {
      throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (user.status === 'suspended') {
      throw new AuthError('Your account has been suspended. Please contact support.', 'ACCOUNT_SUSPENDED');
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await issueTokenPair(user.id, user.email, user.tier);

    const lookupsRemaining = user.tier === 'free' ? Math.max(0, 5 - user.lookupsUsed) : Infinity;

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier as UserTier,
        avatarUrl: user.avatarUrl ?? undefined,
        lookupsUsed: user.lookupsUsed,
        lookupsRemaining,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
      },
      tokens,
    };
  },

  /**
   * Google OAuth flow
   */
  async googleOAuth(input: GoogleOAuthInput) {
    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: process.env['GOOGLE_CLIENT_ID'],
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new AuthError('Invalid Google token');
    }

    const { email, name, sub: googleId, picture: avatarUrl } = payload;

    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      // Create user if they don't exist
      user = await db.user.create({
        data: {
          email,
          name: name ?? 'Google User',
          googleId,
          avatarUrl,
          tier: 'free',
          status: 'active',
          emailVerified: true,
        },
      });
    } else if (!user.googleId) {
      // Link Google account if user exists but doesn't have it linked
      user = await db.user.update({
        where: { id: user.id },
        data: { googleId, emailVerified: true },
      });
    }

    if (user.status === 'suspended') {
      throw new AuthError('Your account has been suspended. Please contact support.', 'ACCOUNT_SUSPENDED');
    }

    // Update last login
    await db.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await issueTokenPair(user.id, user.email, user.tier);
    const lookupsRemaining = user.tier === 'free' ? Math.max(0, 5 - user.lookupsUsed) : Infinity;

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier as UserTier,
        avatarUrl: user.avatarUrl ?? undefined,
        lookupsUsed: user.lookupsUsed,
        lookupsRemaining,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString(),
      },
      tokens,
    };
  },

  /**
   * Rotate a refresh token — revoke old, issue new pair.
   */
  async refresh(rawRefreshToken: string) {
    // Verify JWT structure first
    let payload: ReturnType<typeof verifyRefreshToken>;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new AuthError('Refresh token is invalid or expired', 'INVALID_TOKEN');
    }

    // Find all active refresh tokens for this user
    const storedTokens = await db.refreshToken.findMany({
      where: {
        userId: payload.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    // Validate token hash against stored tokens
    let matchedToken = null;
    for (const stored of storedTokens) {
      const matches = await bcrypt.compare(rawRefreshToken, stored.tokenHash);
      if (matches) {
        matchedToken = stored;
        break;
      }
    }

    if (!matchedToken) {
      // Possible token reuse — revoke ALL tokens for this user (security measure)
      await db.refreshToken.updateMany({
        where: { userId: payload.sub },
        data: { revokedAt: new Date() },
      });
      throw new AuthError('Refresh token reuse detected. Please log in again.', 'TOKEN_REUSED');
    }

    // Revoke the used token
    await db.refreshToken.update({
      where: { id: matchedToken.id },
      data: { revokedAt: new Date() },
    });

    // Fetch user
    const user = await db.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new NotFoundError('User');

    const tokens = await issueTokenPair(user.id, user.email, user.tier);
    return tokens;
  },

  /**
   * Revoke a specific refresh token (logout).
   */
  async logout(rawRefreshToken: string) {
    let payload: ReturnType<typeof verifyRefreshToken>;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      return; // Token already invalid — treat as success
    }

    // Find and revoke the matching token
    const storedTokens = await db.refreshToken.findMany({
      where: { userId: payload.sub, revokedAt: null },
    });

    for (const stored of storedTokens) {
      const matches = await bcrypt.compare(rawRefreshToken, stored.tokenHash);
      if (matches) {
        await db.refreshToken.update({
          where: { id: stored.id },
          data: { revokedAt: new Date() },
        });
        break;
      }
    }
  },

  /**
   * Request password reset email
   */
  async forgotPassword(input: ForgotPasswordInput) {
    const user = await db.user.findUnique({ where: { email: input.email } });
    if (!user) return; // Silent success to prevent enumeration

    // Create reset token (1 hour expiry)
    const rawToken = uuidv4();
    const tokenHash = await bcrypt.hash(rawToken, 8);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Send email via Resend
    await emailService.sendPasswordResetEmail(user.email, rawToken);
  },

  /**
   * Reset password with token
   */
  async resetPassword(input: ResetPasswordInput) {
    const { token, password } = input;

    // Find valid tokens (not expired, not used)
    const validTokens = await db.passwordResetToken.findMany({
      where: {
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    let matchedToken = null;
    for (const stored of validTokens) {
      const matches = await bcrypt.compare(token, stored.tokenHash);
      if (matches) {
        matchedToken = stored;
        break;
      }
    }

    if (!matchedToken) {
      throw new AuthError('Reset token is invalid or expired', 'INVALID_TOKEN');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Update user password and mark token as used
    await db.$transaction([
      db.user.update({
        where: { id: matchedToken.userId },
        data: { passwordHash },
      }),
      db.passwordResetToken.update({
        where: { id: matchedToken.id },
        data: { usedAt: new Date() },
      }),
    ]);
  },

  /**
   * Get the current authenticated user's profile.
   */
  async getProfile(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        avatarUrl: true,
        lookupsUsed: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundError('User');

    const lookupsRemaining = user.tier === 'free' ? Math.max(0, 5 - user.lookupsUsed) : Infinity;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier as UserTier,
      avatarUrl: user.avatarUrl ?? undefined,
      lookupsUsed: user.lookupsUsed,
      lookupsRemaining,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
    };
  },

  /**
   * Update user profile fields.
   */
  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    if (!data.name && !data.avatarUrl) {
      throw new ValidationError('No fields provided to update');
    }

    const user = await db.user.update({
      where: { id: userId },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
      },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        avatarUrl: true,
        lookupsUsed: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    const lookupsRemaining = user.tier === 'free' ? Math.max(0, 5 - user.lookupsUsed) : Infinity;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier as UserTier,
      avatarUrl: user.avatarUrl ?? undefined,
      lookupsUsed: user.lookupsUsed,
      lookupsRemaining,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt.toISOString(),
    };
  },
};
