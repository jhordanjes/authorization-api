import { UserService } from '@/domain/user/services/user.service';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UserService],
})
export class UsersRestModule {}
