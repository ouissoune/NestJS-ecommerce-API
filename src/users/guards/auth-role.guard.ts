import { ConfigService } from '@nestjs/config';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JWTPayloadType } from 'src/utils/types';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/utils/enums';

@Injectable()
export class AuthRolesGuard implements CanActivate {
  /**
   *
   */
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles: UserType[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return false;
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    let user: JWTPayloadType;
    if (!(token && type === 'Bearer'))
      throw new UnauthorizedException('access denied, no token provided');
    try {
      user = await this.jwtService.verifyAsync<JWTPayloadType>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (ex) {
      throw new UnauthorizedException('access denied, invalid token');
    }
    if (!roles.includes(user.userType)) {
      throw new ForbiddenException('Access denied, insufficient roles');
    }
    request['CURRENT_USER'] = user;

    return true;
  }
}
