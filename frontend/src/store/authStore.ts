import { create } from 'zustand';
import { User } from '../types';
import { authService, LoginPayload, RegisterInitPayload, VerifyOtpPayload } from '../services/authService';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  registerInit: (payload: RegisterInitPayload) => Promise<void>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('wadigo_access_token'),
  isAuthenticated: !!localStorage.getItem('wadigo_access_token'),
  isLoading: false,
  pendingEmail: null,

  login: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(payload);
      const { user, tokens } = response.data;
      localStorage.setItem('wadigo_access_token', tokens.accessToken);
      localStorage.setItem('wadigo_refresh_token', tokens.refreshToken);
      set({
        user,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  registerInit: async (payload) => {
    set({ isLoading: true });
    try {
      await authService.registerInit(payload);
      set({ pendingEmail: payload.email, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  verifyOtp: async (payload) => {
    set({ isLoading: true });
    try {
      const response = await authService.verifyOtp(payload);
      const { user, tokens } = response.data;
      localStorage.setItem('wadigo_access_token', tokens.accessToken);
      localStorage.setItem('wadigo_refresh_token', tokens.refreshToken);
      set({
        user,
        accessToken: tokens.accessToken,
        isAuthenticated: true,
        pendingEmail: null,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  resendOtp: async (email) => {
    set({ isLoading: true });
    try {
      await authService.resendOtp(email);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('wadigo_refresh_token') || undefined;
    try {
      await authService.logout(refreshToken);
    } catch (_) {
      // Ignore cleanup error
    } finally {
      localStorage.removeItem('wadigo_access_token');
      localStorage.removeItem('wadigo_refresh_token');
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        pendingEmail: null,
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('wadigo_access_token');
    if (!token) {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await authService.getCurrentUser();
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (_) {
      await get().logout();
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
