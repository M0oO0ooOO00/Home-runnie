import { integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/common/index.js';
import { Team } from '@/common/index.js';
import { Member } from '@/member/domain/member.entity.js';
import { relations } from 'drizzle-orm';

export const teamEnum = pgEnum(
    'team',
    Object.values(Team) as [string, ...string[]],
);

export const Profile = pgTable('profile', {
    ...baseColumns,
    nickname: text('nickname').notNull(),
    supportTeam: teamEnum('support_team'),
    memberId: integer('member_id').references(() => Member.id),
});

export const profileRelations = relations(Profile, ({ one }) => ({
    member: one(Member, {
        fields: [Profile.memberId],
        references: [Member.id],
    }),
}));
