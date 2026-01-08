import { pgEnum } from 'drizzle-orm/pg-core';
import { AccountStatusEnum } from '@/common/enums';

export const accountStatusPgEnum = pgEnum(
  'account_status',
  Object.values(AccountStatusEnum) as [string, ...string[]],
);
