import { Team } from "../../../enums";

export interface UpdateMyProfileRequest {
    nickname?: string;
    supportTeam?: Team;
}