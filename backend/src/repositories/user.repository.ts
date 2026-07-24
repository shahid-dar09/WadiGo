import { prisma } from '../config/prisma.js';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  static async createUserWithRole(data: {
    name: string;
    email: string;
    phone?: string;
    passwordHash: string;
    roleName?: 'CUSTOMER' | 'MERCHANT' | 'DELIVERY_PARTNER' | 'ADMIN';
  }) {
    const roleName = data.roleName || 'CUSTOMER';

    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new Error(`Role ${roleName} not found in database.`);
    }

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash: data.passwordHash,
        roles: {
          create: {
            roleId: role.id,
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  // OTP Verification Operations
  static async saveOtp(email: string, otp: string, expiresAt: Date, payloadJson?: string, purpose: string = 'REGISTRATION') {
    // Delete existing pending OTP for this email and purpose
    await (prisma as any).otpVerification.deleteMany({
      where: { email, purpose },
    });

    return (prisma as any).otpVerification.create({
      data: {
        email,
        otp,
        purpose,
        payloadJson,
        expiresAt,
      },
    });
  }

  static async findOtp(email: string, purpose: string = 'REGISTRATION') {
    return (prisma as any).otpVerification.findFirst({
      where: { email, purpose },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async deleteOtp(id: string) {
    return (prisma as any).otpVerification.delete({
      where: { id },
    });
  }

  // Refresh Token Operations
  static async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  static async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  static async deleteRefreshToken(token: string) {
    return prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  static async deleteUserRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
