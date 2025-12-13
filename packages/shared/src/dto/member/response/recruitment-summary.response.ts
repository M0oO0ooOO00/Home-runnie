export interface RecruitmentSummaryResponse {
    number: number;
    title: string;
    gameDate: string;
    gameTeams: string;
    author: string;
    recruitmentStatus: 'RECRUITING' | 'COMPLETED';
    createdAt: Date;
}
