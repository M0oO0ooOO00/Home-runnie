export interface GetMemberListResponse {
    id: number;
    nickname: string;
    warningCount: number;
    reportingCount: number;
    reportedCount: number
    joinedAt: Date;
    accountStatus: string;
}
