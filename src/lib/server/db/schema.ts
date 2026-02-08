import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	password: text('password').notNull(), // In a real app, hash this!
	roles: text('roles').$type<string[]>().notNull().default((['member'])),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});