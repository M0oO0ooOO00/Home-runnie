import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenResponseDto } from '../dto/response/token.response.dto';
import { ConfigService } from '@nestjs/config';
import { MemberRepository } from 'src/member/repository';
import { MemberType } from 'src/member/domain';
import { Role } from 'src/common';
import { JwtPayload, RefreshTokenPayload, SignUpTokenPayload } from '../types';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly memberRepository: MemberRepository,
  ) {}

  generateToken(member: MemberType): TokenResponseDto {
    const payload: JwtPayload = { memberId: member.id, role: member.role as Role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwtService.sign(
      { memberId: payload.memberId },
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

  verifyAccessToken(accessToken: string): JwtPayload {
    return this.jwtService.verify(accessToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  verifyRefreshToken(refreshToken: string): RefreshTokenPayload {
    return this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  verifySignUpToken(token: string): SignUpTokenPayload {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async reissueToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }

    let payload: RefreshTokenPayload;

    try {
      payload = this.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const memberId = payload.memberId;
    const member = await this.memberRepository.findOneById(memberId);
    if (!member) {
      throw new NotFoundException('회원 정보를 찾을 수 없습니다.');
    }

    const newPayload = { memberId: member.id, role: member.role };
    const accessToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    return accessToken;
  }
}
