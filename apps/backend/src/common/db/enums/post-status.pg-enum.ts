import { pgEnum } from 'drizzle-orm/pg-core';
import { PostStatusEnum } from '@/common/enums';

export const postStatusPgEnum = pgEnum(
  'post_status',
  Object.values(PostStatusEnum) as [string, ...string[]],
);
