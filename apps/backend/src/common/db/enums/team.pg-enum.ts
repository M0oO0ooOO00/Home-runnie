import { pgEnum } from 'drizzle-orm/pg-core';
import { Team } from '@homerunnie/shared';

export const teamPgEnum = pgEnum(
    'team',
    Object.values(Team) as [string, ...string[]],
);
