import { pgEnum } from 'drizzle-orm/pg-core';
import { Stadium } from '@homerunnie/shared';

export const stadiumPgEnum = pgEnum(
    'stadium',
    Object.values(Stadium) as [string, ...string[]],
);
