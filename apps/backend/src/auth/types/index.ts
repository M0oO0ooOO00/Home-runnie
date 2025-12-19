import { Role } from '@/common/index.js';

export type JwtPayload = {
    memberId: number;
    roles: Role[];
};
