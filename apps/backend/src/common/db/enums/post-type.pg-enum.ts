import { pgEnum } from 'drizzle-orm/pg-core';
import { PostType } from '@homerunnie/shared';

export const postTypePgEnum = pgEnum('post_type', Object.values(PostType) as [string, ...string[]]);
