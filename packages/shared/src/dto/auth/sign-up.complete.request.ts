import { Gender, Team } from "../../enums";

export interface SignUpCompleteRequest {
    memberId: number;
    nickName: string;
    birthDate: string;
    phoneNumber: string;
    gender: Gender;
    supportTeam: Team;
}