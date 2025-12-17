import {Team} from "../../enums";

export interface MemberDetailInfo {
    id: number;
    name: string;
    nickname: string | null;
    supportTeam: Team | null;
    supportTeamName: string | null;
    gender: string | null;
    age: number | null;
    phoneNumber: string | null;
    joinedAt: Date;
    accountStatus: string;
}

export interface WarnRecord {
    reason: string;
    postType: string | null;
    postTitle: string | null;
    postId: number | null;
    warnedAt: Date;
}

export interface ReportRecord {
    reportType: string | null;
    postType: string | null;
    postTitle: string | null;
    postId: number | null;
    reportedMemberName: string | null;
    reporterName: string | null;
    reportedAt: Date;
}

export interface MemberStatistics {
    totalWarnCount: number;
    totalReportingCount: number;
    totalReportedCount: number;
}