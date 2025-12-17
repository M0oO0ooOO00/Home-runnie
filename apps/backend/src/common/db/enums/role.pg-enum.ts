import { pgEnum } from 'drizzle-orm/pg-core';
import { Role } from '@homerunnie/shared';

export const rolePgEnum = pgEnum(
    'role',
    Object.values(Role) as [string, ...string[]],
);
