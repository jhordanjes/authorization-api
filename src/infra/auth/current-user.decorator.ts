import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from './jwt.strategy';

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: TokenPayload }>();

    return request.user;
  },
);
