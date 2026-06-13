import { create } from 'zustand';
import Cookies from 'js-cookie';
import { apiClient } from '../api/client';
// Let's use @bidsmart/shared types.
import type { AuthTokens, UserProfile } from '@bidsmart/shared';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: !!Cookies.get('accessToken'),
  isLoading: true, // Start true so we can checkAuth on mount
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{ user: UserProfile; tokens: AuthTokens }>('/auth/login', credentials);
      Cookies.set('accessToken', response.tokens.accessToken, { expires: 1/24 }); // 1 hour
      Cookies.set('refreshToken', response.tokens.refreshToken, { expires: 30 }); // 30 days
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{ user: UserProfile; tokens: AuthTokens }>('/auth/register', data);
      Cookies.set('accessToken', response.tokens.accessToken, { expires: 1/24 });
      Cookies.set('refreshToken', response.tokens.refreshToken, { expires: 30 });
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  googleLogin: async (idToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{ user: UserProfile; tokens: AuthTokens }>('/auth/oauth/google', { idToken });
      Cookies.set('accessToken', response.tokens.accessToken, { expires: 1/24 });
      Cookies.set('refreshToken', response.tokens.refreshToken, { expires: 30 });
      set({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (e) {
      // Ignore errors on logout
    } finally {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refresh: async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      throw new Error('No refresh token');
    }
    try {
      const tokens = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken });
      Cookies.set('accessToken', tokens.accessToken, { expires: 1/24 });
      Cookies.set('refreshToken', tokens.refreshToken, { expires: 30 });
    } catch (error: any) {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      set({ isAuthenticated: false, user: null });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (!accessToken && !refreshToken) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    try {
      if (!accessToken && refreshToken) {
        // We have a refresh token but no access token, try to refresh first
        await get().refresh();
      }
      
      const user = await apiClient.get<UserProfile>('/user/profile');
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      // Profile fetch failed (maybe token is still invalid after refresh, or refresh failed)
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },
}));
