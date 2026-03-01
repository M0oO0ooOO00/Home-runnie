import { Stadium } from '../../../entities/team/stadium';
import { Team } from '../../../entities/team/team';

export interface CreateRecruitmentPostRequest {
  title: string;
  gameDate: string; // ISO 8601 string
  stadium: Stadium;
  teamA: Team;
  teamB: Team;
  headcount: string;
  ticketStatus: 'have' | 'need';
  favTeam?: Team;
  gender?: 'F' | 'M';
  prefGender: 'F' | 'M' | 'ANY';
  picked?: string[];
  note?: string;
}
