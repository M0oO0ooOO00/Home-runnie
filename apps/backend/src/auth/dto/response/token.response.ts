export class TokenResponse {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static of(accessToken: string, refreshToken: string) {
    return new TokenResponse(accessToken, refreshToken);
  }
}
