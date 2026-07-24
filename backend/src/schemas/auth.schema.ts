import { z } from 'zod';

export const registerInitSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().optional(),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address format'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
  purpose: z.enum(['REGISTRATION', 'PASSWORD_RESET']).default('REGISTRATION'),
});

export const resendOtpSchema = z.object({
  email: z.string().email('Invalid email address format'),
  purpose: z.enum(['REGISTRATION', 'PASSWORD_RESET']).default('REGISTRATION'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RegisterInitInput = z.infer<typeof registerInitSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
