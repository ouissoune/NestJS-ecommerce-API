import { ConfigService } from '@nestjs/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { JWTPayloadType } from 'src/utils/types';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   *
   */
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (!(token && type === 'Bearer'))
      throw new UnauthorizedException('access denied, no token provided');
    try {
      const user = this.jwtService.verify<JWTPayloadType>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request['CURRENT_USER'] = user;
    } catch (ex) {
      throw new UnauthorizedException('access denied, invalid token');
    }

    return true;
  }
}
