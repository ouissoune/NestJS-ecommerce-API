import {
  createParamDecorator,
  ExecutionContext,
  Request,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) =>
    context.switchToHttp().getRequest()['CURRENT_USER'],
);
