// ── User Types ────────────────────────────────────────────────────────────────

export enum UserTier {
  FREE = 'free',
  PRO = 'pro',
  DEALER = 'dealer',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  tier: UserTier;
  status: UserStatus;
  emailVerified: boolean;
  lookupsUsed: number;
  lookupsResetAt: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  tier: UserTier;
  lookupsUsed: number;
  lookupsRemaining: number;
  emailVerified: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatarUrl?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  emailAlerts: boolean;
  endingSoonAlerts: boolean;
  newListingAlerts: boolean;
  weeklyDigest: boolean;
  quietHoursStart?: string; // "HH:mm"
  quietHoursEnd?: string;   // "HH:mm"
}
