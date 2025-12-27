import { Team } from '../../../entities/team/team';

export interface UpdateMyProfileRequest {
  nickname?: string;
  supportTeam?: Team;
}
