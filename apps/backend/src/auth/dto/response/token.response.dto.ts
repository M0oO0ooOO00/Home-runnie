import { TokenResponse } from '@homerunnie/shared';

export class TokenResponseDto implements TokenResponse {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static of(accessToken: string, refreshToken: string) {
    return new TokenResponseDto(accessToken, refreshToken);
  }
}
