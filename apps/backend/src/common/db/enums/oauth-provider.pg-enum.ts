import { pgEnum } from 'drizzle-orm/pg-core';
import { OAuthProvider } from '@homerunnie/shared';

export const oauthProviderPgEnum = pgEnum(
    'oauth_provider',
    Object.values(OAuthProvider) as [string, ...string[]],
);
