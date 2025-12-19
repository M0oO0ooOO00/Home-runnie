import { pgEnum } from 'drizzle-orm/pg-core';
import { Gender } from '@/common/enums/index.js';

export const genderPgEnum = pgEnum(
    'gender',
    Object.values(Gender) as [string, ...string[]],
);
