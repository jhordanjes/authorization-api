import { CreateAccountBodySchema } from '@/application/http/user/schemas/create-user.schema';
import { UpdateAccountBodySchema } from '@/application/http/user/schemas/update-user.schema';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAccountBodySchema): Promise<User> {
    const { email, name, password, role } = data;
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists',
      );
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      },
    });

    return user;
  }

  async update(data: UpdateAccountBodySchema, userId: string) {
    const { email, name, password, role } = data;
    console.log(data);

    const userExists = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      throw new NotFoundException(`User not found.`);
    }

    const emailExists = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // if (emailExists && emailExists.id !== user_id) {
    //   throw new AppError('Email alredy in use');
    // }
  }
}
