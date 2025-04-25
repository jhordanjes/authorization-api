import { AuthService } from '@/domain/auth/services/auth.service';
import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-zod';
import {
  AuthenticateBodySchema,
  authenticateBodySchema,
} from './schemas/create-session.schema';

@Controller('sessions')
export class SessionsController {
  constructor(private authService: AuthService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async createSession(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    return this.authService.createSession(email, password);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
