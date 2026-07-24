import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { UserRepository } from '../repositories/user.repository.js';
import { EmailService } from './email.service.js';
import { ApiError } from '../utils/api-error.js';
import { RegisterInitInput, VerifyOtpInput, LoginInput } from '../schemas/auth.schema.js';

export class AuthService {
  // Step 1 of Registration: Validate details, generate 6-digit OTP, send email, store pending payload
  static async initiateRegistration(input: RegisterInitInput) {
    const existingUser = await UserRepository.findByEmail(input.email);
    if (existingUser) {
      throw ApiError.badRequest('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const payloadJson = JSON.stringify({
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
    });

    await UserRepository.saveOtp(input.email, otp, expiresAt, payloadJson, 'REGISTRATION');
    await EmailService.sendRegistrationOtp(input.email, otp, input.name);

    return {
      email: input.email,
      message: 'Verification OTP sent to email. Code expires in 10 minutes.',
      expiresInSeconds: 600,
    };
  }

  // Step 2 of Registration: Verify OTP code & complete user creation
  static async verifyOtpAndCompleteRegister(input: VerifyOtpInput) {
    const otpRecord = await UserRepository.findOtp(input.email, input.purpose);

    if (!otpRecord) {
      throw ApiError.badRequest('No pending verification found for this email address');
    }

    if (new Date() > otpRecord.expiresAt) {
      await UserRepository.deleteOtp(otpRecord.id);
      throw ApiError.badRequest('Verification code has expired. Please request a new OTP.');
    }

    if (otpRecord.otp !== input.otp) {
      throw ApiError.badRequest('Invalid verification OTP code');
    }

    if (!otpRecord.payloadJson) {
      throw ApiError.badRequest('Invalid verification state');
    }

    const payload = JSON.parse(otpRecord.payloadJson);

    // Create user in DB
    const user = await UserRepository.createUserWithRole({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      passwordHash: payload.passwordHash,
      roleName: 'CUSTOMER',
    });

    // Cleanup OTP record
    await UserRepository.deleteOtp(otpRecord.id);

    // Issue tokens
    const tokens = await this.generateTokens(user.id, user.email, user.roles.map((r) => r.role.name));

    return {
      user: this.formatUserResponse(user),
      tokens,
    };
  }

  // Resend OTP Code
  static async resendOtp(email: string, purpose: string = 'REGISTRATION') {
    const otpRecord = await UserRepository.findOtp(email, purpose);

    if (!otpRecord || !otpRecord.payloadJson) {
      throw ApiError.badRequest('No pending registration found for this email address');
    }

    const payload = JSON.parse(otpRecord.payloadJson);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await UserRepository.saveOtp(email, newOtp, expiresAt, otpRecord.payloadJson, purpose);
    await EmailService.sendRegistrationOtp(email, newOtp, payload.name || 'User');

    return {
      email,
      message: 'New verification OTP sent successfully.',
      expiresInSeconds: 600,
    };
  }

  // Login User
  static async loginUser(input: LoginInput) {
    const user = await UserRepository.findByEmail(input.email);
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    const roleNames = user.roles.map((r) => r.role.name);
    const tokens = await this.generateTokens(user.id, user.email, roleNames);

    return {
      user: this.formatUserResponse(user),
      tokens,
    };
  }

  // Refresh Access Token
  static async refreshAccessToken(token: string) {
    const existingToken = await UserRepository.findRefreshToken(token);
    if (!existingToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    if (new Date() > existingToken.expiresAt) {
      await UserRepository.deleteRefreshToken(token);
      throw ApiError.unauthorized('Refresh token has expired');
    }

    const user = await UserRepository.findById(existingToken.userId);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    const roleNames = user.roles.map((r) => r.role.name);
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, roles: roleNames },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken };
  }

  // Logout User
  static async logoutUser(token?: string, userId?: string) {
    if (token) {
      await UserRepository.deleteRefreshToken(token);
    }
    if (userId) {
      await UserRepository.deleteUserRefreshTokens(userId);
    }
    return { message: 'Logged out successfully' };
  }

  // Get User Profile
  static async getCurrentUser(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return this.formatUserResponse(user);
  }

  // Helper: Token Generation
  private static async generateTokens(userId: string, email: string, roles: string[]) {
    const accessToken = jwt.sign(
      { sub: userId, email, roles },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { sub: userId },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await UserRepository.createRefreshToken(userId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  // Helper: Format User (Exclude passwordHash)
  private static formatUserResponse(user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      roles: user.roles.map((r: any) => r.role.name),
      createdAt: user.createdAt,
    };
  }
}
