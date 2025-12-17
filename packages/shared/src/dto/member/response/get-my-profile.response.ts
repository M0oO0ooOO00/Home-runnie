export interface GetMyProfileResponse {
    nickname: string;
    supportTeam: string | null;
    oauthProvider: string;
    accountStatus: string;
    warnCount: number;
}