import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(member): TokenResponseDto {
    const payload = { id: member.id, role: member.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwtService.sign(
      { id: payload.id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      },
    );

    return TokenResponseDto.of(accessToken, refreshToken);
  }

  generateSignUpToken(memberId: number): string {
    return this.jwtService.sign(
      { memberId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<number>('JWT_SIGNUP_TOKEN_EXPIRATION_TIME'),
      },
    );
  }

  verifyToken(token: string): { memberId: number; role: string } {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
