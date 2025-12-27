import { pgEnum } from 'drizzle-orm/pg-core';
import { Gender } from '@homerunnie/shared';

export const genderPgEnum = pgEnum('gender', Object.values(Gender) as [string, ...string[]]);
