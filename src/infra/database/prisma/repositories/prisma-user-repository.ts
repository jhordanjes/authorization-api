import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
