import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenResponse } from '../dto/response/token.response';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(member): TokenResponse {
    const payload = { id: member.id, role: member.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(
      { id: payload.id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );

    return TokenResponse.of(accessToken, refreshToken);
  }
}
