import { pgEnum } from 'drizzle-orm/pg-core';
import { PostStatusEnum } from '@homerunnie/shared';

export const postStatusPgEnum = pgEnum(
    'post_status',
    Object.values(PostStatusEnum) as [string, ...string[]],
);
