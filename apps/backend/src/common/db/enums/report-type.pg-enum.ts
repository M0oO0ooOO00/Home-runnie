import { pgEnum } from 'drizzle-orm/pg-core';
import { ReportType } from '@/common/enums/index.js';

export const reportTypePgEnum = pgEnum(
    'report_type',
    Object.values(ReportType) as [string, ...string[]],
);
