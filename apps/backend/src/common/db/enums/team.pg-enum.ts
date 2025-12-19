import { pgEnum } from 'drizzle-orm/pg-core';
import { Team } from '@/common/enums/team.enum.js';

export const teamPgEnum = pgEnum(
    'team',
    Object.values(Team) as [string, ...string[]],
);