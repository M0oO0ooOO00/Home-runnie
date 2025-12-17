import { Role } from '@homerunnie/shared';

export type JwtPayload = {
    memberId: number;
    roles: Role[];
};
