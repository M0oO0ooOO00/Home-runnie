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
      expiresIn: '1d',
    });

    const refreshToken = this.jwtService.sign(
      { id: payload.id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );

    return TokenResponseDto.of(accessToken, refreshToken);
  }

  generateSignUpToken(memberId: number): string {
    return this.jwtService.sign(
      { memberId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '10m', // 10분 동안 유효
      },
    );
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
