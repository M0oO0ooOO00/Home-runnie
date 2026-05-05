import { integer, pgTable, unique } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/common';
import { Member } from '@/member/domain';
import { reactionTargetTypePgEnum } from '@/common';
import { relations } from 'drizzle-orm';

export { reactionTargetTypePgEnum };

export const Like = pgTable(
  'like',
  {
    ...baseColumns,
    memberId: integer('member_id')
      .notNull()
      .references(() => Member.id),
    targetType: reactionTargetTypePgEnum('target_type').notNull(),
    targetId: integer('target_id').notNull(),
  },
  (table) => ({
    uniqueMemberTarget: unique('like_member_target_unique').on(
      table.memberId,
      table.targetType,
      table.targetId,
    ),
  }),
);

export const likeRelations = relations(Like, ({ one }) => ({
  member: one(Member, {
    fields: [Like.memberId],
    references: [Member.id],
  }),
}));
