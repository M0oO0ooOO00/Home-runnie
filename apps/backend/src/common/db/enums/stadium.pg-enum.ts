import { pgEnum } from 'drizzle-orm/pg-core';
import { Stadium } from '@/common/enums/stadium.enum.js';

export const stadiumPgEnum = pgEnum(
    'stadium',
    Object.values(Stadium) as [string, ...string[]],
);
