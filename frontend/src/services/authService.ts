import api from './api';
import { User, ApiResponse } from '../types';

export interface RegisterInitPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'CUSTOMER' | 'MERCHANT' | 'DELIVERY_PARTNER' | 'ADMIN';
  businessName?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  purpose?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  requiredRole?: 'CUSTOMER' | 'MERCHANT' | 'DELIVERY_PARTNER' | 'ADMIN';
}

export interface AuthResponseData {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  async registerInit(payload: RegisterInitPayload): Promise<ApiResponse> {
    return api.post('/auth/register', payload);
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<AuthResponseData>> {
    return api.post('/auth/verify-otp', payload);
  },

  async resendOtp(email: string, purpose: string = 'REGISTRATION'): Promise<ApiResponse> {
    return api.post('/auth/resend-otp', { email, purpose });
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    return api.post('/auth/login', payload);
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return api.get('/auth/me');
  },

  async logout(refreshToken?: string): Promise<ApiResponse> {
    return api.post('/auth/logout', { refreshToken });
  },
};
