import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.accessToken;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET') ?? 'SECRET',
    });
  }

  validate(jwtPayload: any) {
    const memberId = jwtPayload.id ?? jwtPayload.memberId;
    const roles = jwtPayload.role ?? jwtPayload.roles;

    if (!memberId) {
      throw new UnauthorizedException();
    }

    return {
      memberId,
      roles,
    };
  }
}
