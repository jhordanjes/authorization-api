import authConfig from '@/config/auth';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { add } from 'date-fns';
import { User } from 'generated/prisma';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async generateTokens(user: User) {
    const payload = { sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: authConfig.jwt.expiresIn,
    });
    const refreshToken = randomUUID();
    const expiresAt = add(new Date(), { days: 7 });

    await this.prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt,
        userId: user.id,
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    const existingToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!existingToken || existingToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: existingToken.userId },
    });

    if (user) {
      return this.generateTokens(user);
    }
  }

  async createSession(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User credentials do not match');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match');
    }
    return this.generateTokens(user);
  }
}
