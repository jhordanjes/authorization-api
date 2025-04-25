import { Roles } from '@/common/decorators/roles.decorator';
import { UserService } from '@/domain/user/services/user.service';
import { JwtAuthGuard } from '@/infra/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import { ZodValidationPipe } from '../pipes/zod-validation-zod';
import { UserPresenter } from './presenters/user-presenter';
import {
  createAccountBodySchema,
  CreateAccountBodySchema,
} from './schemas/create-user.schema';
import { UpdateAccountBodySchema } from './schemas/update-user.schema';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private userService: UserService) {}

  @Post()
  @Roles(UserRole.ANALYST, UserRole.MANAGER)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async createUser(@Body() body: CreateAccountBodySchema) {
    const user = await this.userService.create(body);
    return UserPresenter.toHTTP(user);
  }

  @Patch('/:id')
  @Roles(UserRole.ANALYST, UserRole.MANAGER)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async updateUser(
    @Param('id') userId: string,
    @Body() body: UpdateAccountBodySchema,
  ) {
    const user = await this.userService.update(body, userId);
    // return UserPresenter.toHTTP(user);
  }
}
