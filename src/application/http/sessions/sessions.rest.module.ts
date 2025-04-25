import { AuthService } from '@/domain/auth/services/auth.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SessionsController],
  providers: [AuthService],
})
export class SessionsRestModule {}
