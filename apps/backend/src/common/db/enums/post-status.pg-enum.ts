import { pgEnum } from 'drizzle-orm/pg-core';
import { PostStatusEnum } from '@/common/enums/index.js';

export const postStatusPgEnum = pgEnum(
    'post_status',
    Object.values(PostStatusEnum) as [string, ...string[]],
);
