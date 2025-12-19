import { pgEnum } from 'drizzle-orm/pg-core';
import { AccountStatusEnum } from '@/common/enums/index.js';

export const accountStatusPgEnum = pgEnum(
    'account_status',
    Object.values(AccountStatusEnum) as [string, ...string[]],
);
