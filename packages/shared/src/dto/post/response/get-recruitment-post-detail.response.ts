export interface GetRecruitmentPostDetailResponse {
  id: number;
  title: string;
  gameDate: string;
  gameTime: string;
  stadium: string;
  teamHome: string;
  teamAway: string;
  recruitmentLimit: number;
  currentParticipants: number;
  preferGender: string;
  message: string | null;
  ticketingType: string | null;
  supportTeam: string | null;
  createdAt: string;
}
