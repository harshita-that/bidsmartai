import type { UserTier } from '../types/user.ts';

// ── Lookup Limits per Tier ────────────────────────────────────────────────────
export const TIER_LOOKUP_LIMITS: Record<UserTier, number> = {
  free: 5,
  pro: Infinity,
  dealer: Infinity,
} as const;

// ── Rate Limits (requests per minute) ────────────────────────────────────────
export const TIER_RATE_LIMITS: Record<UserTier, number> = {
  free: 10,
  pro: 60,
  dealer: 200,
} as const;

// ── Supported Platforms ────────────────────────────────────────────────────────
export const PLATFORMS = {
  EBAY: 'ebay',
  HERITAGE: 'heritage',
  LIVEAUCTIONEERS: 'liveauctioneers',
} as const;

// ── Platform URL patterns (for detection) ────────────────────────────────────
export const PLATFORM_URL_PATTERNS: Record<string, RegExp> = {
  ebay: /ebay\.(com|co\.uk|de|fr|it|es|com\.au)/i,
  heritage: /ha\.com/i,
  liveauctioneers: /liveauctioneers\.com/i,
};

// ── API ────────────────────────────────────────────────────────────────────────
export const API_VERSION = 'v1' as const;
export const API_PREFIX = `/api/${API_VERSION}` as const;

// ── Token Expiry ───────────────────────────────────────────────────────────────
export const TOKEN_EXPIRY = {
  ACCESS: '15m',
  REFRESH: '30d',
  PASSWORD_RESET: '1h',
  EMAIL_VERIFICATION: '24h',
} as const;

// ── Subscription Tiers ─────────────────────────────────────────────────────────
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  DEALER: 'dealer',
} as const;

// ── Pagination ─────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

// ── File Uploads ───────────────────────────────────────────────────────────────
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

// ── Redis Key Prefixes ─────────────────────────────────────────────────────────
export const REDIS_KEYS = {
  LOOKUP_CACHE: 'lookup:',
  RATE_LIMIT: 'rl:',
  REFRESH_TOKEN: 'rt:',
  PASSWORD_RESET: 'pr:',
  EMAIL_VERIFY: 'ev:',
} as const;

// ── Error Codes ────────────────────────────────────────────────────────────────
export const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  // Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TIER_REQUIRED: 'TIER_REQUIRED',
  LOOKUP_LIMIT_REACHED: 'LOOKUP_LIMIT_REACHED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_URL: 'INVALID_URL',
  UNSUPPORTED_PLATFORM: 'UNSUPPORTED_PLATFORM',
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;
