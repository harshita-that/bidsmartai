import jwt from 'jsonwebtoken';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AccessTokenPayload {
  sub: string;      // user ID
  email: string;
  tier: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;      // user ID
  jti: string;      // token ID (for rotation/revocation)
  type: 'refresh';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSecret(key: string): string {
  const secret = process.env[key];
  if (!secret) throw new Error(`Missing env var: ${key}`);
  return secret;
}

// ── Token Generation ──────────────────────────────────────────────────────────

export function signAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    getSecret('JWT_SECRET'),
    { expiresIn: (process.env['JWT_ACCESS_EXPIRY'] ?? '15m') as jwt.SignOptions['expiresIn'] },
  );
}

export function signRefreshToken(userId: string, jti: string): string {
  return jwt.sign(
    { sub: userId, jti, type: 'refresh' },
    getSecret('JWT_REFRESH_SECRET'),
    { expiresIn: (process.env['JWT_REFRESH_EXPIRY'] ?? '30d') as jwt.SignOptions['expiresIn'] },
  );
}

// ── Token Verification ────────────────────────────────────────────────────────

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, getSecret('JWT_SECRET')) as AccessTokenPayload;
  if (payload.type !== 'access') throw new Error('Invalid token type');
  return payload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, getSecret('JWT_REFRESH_SECRET')) as RefreshTokenPayload;
  if (payload.type !== 'refresh') throw new Error('Invalid token type');
  return payload;
}
