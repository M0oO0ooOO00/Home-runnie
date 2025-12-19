import { pgEnum } from 'drizzle-orm/pg-core';
import { OAuthProvider } from '@/common/enums/index.js';

export const oauthProviderPgEnum = pgEnum(
    'oauth_provider',
    Object.values(OAuthProvider) as [string, ...string[]],
);
