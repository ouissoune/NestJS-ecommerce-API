import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserType } from 'src/utils/enums';
import { JWTPayloadType } from 'src/utils/types';
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
