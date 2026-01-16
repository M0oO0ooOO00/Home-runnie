import { Gender } from '../../../entities/gender/gender';
import { Team } from '../../../entities/team/team';

export interface SignupCompleteRequest {
  nickName: string;
  birthDate: string;
  phoneNumber: string;
  gender: Gender;
  supportTeam: Team;
}
