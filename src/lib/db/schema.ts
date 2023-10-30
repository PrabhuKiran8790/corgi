import { timestamp, pgTable, text, primaryKey, integer } from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';

export const users = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image'),
	createdAt: timestamp('createdAt').defaultNow(),
	creditsUsed: integer('creditsUsed').notNull().default(0)
});

export const accounts = pgTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => ({
		compoundKey: primaryKey(account.provider, account.providerAccountId)
	})
);

export const sessions = pgTable('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const verificationTokens = pgTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(vt) => ({
		compoundKey: primaryKey(vt.identifier, vt.token)
	})
);

export const userSubscription = pgTable('userSubscription', {
	id: text('id').notNull().primaryKey(),
	email: text('email').notNull().unique(),
	stripeCustomerId: text('stripeCustomerId').notNull(),
	stripeSubscriptionId: text('stripeSubscriptionId').notNull(),
	stripePriceId: text('stripePriceId'),
	stripeCurrentPeriodEnd: timestamp('stripeCurrentPeriodEnd', {
		mode: 'date'
	}).notNull(),
	imageGenerationCreditsUsed: integer('imageGenerationCreditsUsed').notNull().default(0),
	audioGenerationCreditsUsed: integer('audioGenerationCreditsUsed').notNull().default(0),
	imageRestorationCreditsUsed: integer('imageRestorationCreditsUsed').notNull().default(0)
});
