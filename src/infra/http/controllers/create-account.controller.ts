import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/infra/auth/guards/roles.guard';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-zod';
import {
  Body,
  ConflictException,
  Controller,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { UserRole } from 'generated/prisma';
import { z } from 'zod';

const createAccountBodySchema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string().email(),
});

type CreateAccountBosySchema = z.infer<typeof createAccountBodySchema>;

@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBosySchema) {
    const { name, email, password } = body;

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

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
