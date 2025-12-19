import { pgEnum } from 'drizzle-orm/pg-core';
import { Role } from '@/common/enums/index.js';

export const rolePgEnum = pgEnum(
    'role',
    Object.values(Role) as [string, ...string[]],
);
