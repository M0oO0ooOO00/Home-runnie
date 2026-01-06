import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from 'src/common';

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

  validate(jwtPayload: { id: number; role: string }) {
    const { id: memberId, role: roles } = jwtPayload;

    if (!memberId) {
      throw new UnauthorizedException('JWT 토큰 파싱 에러 - memberId 파싱 실패');
    }

    return {
      memberId,
      roles,
    };
  }
}
