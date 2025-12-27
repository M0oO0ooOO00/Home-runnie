import { Gender } from '../../../entities/gender/gender';
import { Team } from '../../../entities/team/team';

export interface SignupCompleteRequest {
  memberId: number;
  nickName: string;
  birthDate: string;
  phoneNumber: string;
  gender: Gender;
  supportTeam: Team;
}
