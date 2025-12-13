import { pgEnum } from 'drizzle-orm/pg-core';
import { AccountStatusEnumDescription } from '@homerunnie/shared';

export const accountStatusPgEnum = pgEnum(
    'account_status',
    Object.values(AccountStatusEnumDescription) as [string, ...string[]],
);
