import { pgEnum } from 'drizzle-orm/pg-core';
import { RecruitmentRoleEnum } from '@homerunnie/shared';

export const recruitmentPgEnum = pgEnum(
    'recruitment_role',
    Object.values(RecruitmentRoleEnum) as [string, ...string[]],
);
