import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseColumns } from '@/common/db/base.entity.js';
import { Profile } from '@/member/domain/profile.entity.js';
import { ReportCount } from '@/report/domain/index.js';
import { Report } from '@/report/domain/index.js';
import { Post } from '@/post/domain/index.js';
import { Participation } from '@/participation/domain/index.js';
import { Scrap } from '@/scrap/domain/index.js';
import { Comment } from '@/comment/domain/index.js';
import { Warn } from '@/admin/domain/index.js';
import {
    rolePgEnum,
    genderPgEnum,
    oauthProviderPgEnum,
    accountStatusPgEnum,
} from '@/common/db/enums/index.js';
import { AccountStatusEnum } from '@/common/index.js';

export { rolePgEnum, genderPgEnum, oauthProviderPgEnum, accountStatusPgEnum };

export const Member = pgTable('member', {
    ...baseColumns,
    name: text('name').notNull(),
    email: text('email').notNull(),
    birthDate: text('birth_date'),
    phoneNumber: text('phone_number'),
    gender: genderPgEnum('gender'),
    role: rolePgEnum('role').notNull(),
    oauthProvider: oauthProviderPgEnum('oauth_provider').notNull(),
    accountStatus: accountStatusPgEnum('account_status')
        .notNull()
        .default(AccountStatusEnum.ACTIVE),
    signUpStatus: boolean('sign-up-status').default(false),
});

export const memberRelations = relations(Member, ({ one, many }) => ({
    profile: one(Profile),
    post: many(Post),
    comment: many(Comment),
    reportCount: one(ReportCount),
    reporter: many(Report, { relationName: 'reporter' }),
    reported: many(Report, { relationName: 'reported' }),
    participation: many(Participation),
    scrap: many(Scrap),
    warn: many(Warn),
}));
