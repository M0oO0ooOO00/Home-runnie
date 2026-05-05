import { pgEnum } from 'drizzle-orm/pg-core';
import { ReactionTargetType } from '@/reaction/domain/reaction-target-type.enum';

export const reactionTargetTypePgEnum = pgEnum(
  'reaction_target_type',
  Object.values(ReactionTargetType) as [string, ...string[]],
);
