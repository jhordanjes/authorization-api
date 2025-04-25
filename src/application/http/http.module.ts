import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { SessionsRestModule } from './sessions/sessions.rest.module';
import { UsersRestModule } from './user/users.rest.module';

@Module({
  imports: [DatabaseModule, SessionsRestModule, UsersRestModule],
})
export class HttpModule {}
