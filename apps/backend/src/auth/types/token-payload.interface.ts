import { Role } from '@/common';

export interface JwtPayload {
  memberId: number;
  role: Role;
}

export interface RefreshTokenPayload {
  memberId: number;
}

export interface SignUpTokenPayload {
  memberId: number;
}
