import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	password: text('password').notNull(), // In a real app, hash this!
	roles: text('roles').$type<string[]>().notNull().default((['member'])),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const logs = sqliteTable('logs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    timestamp: text('timestamp').default(new Date().toISOString()),
    level: text('level'), // 'info', 'warn', 'error'
    event: text('event'), // 'LOGIN_SUCCESS', 'USER_DELETED', 'PASSWORD_CHANGE'
    user: text('user'),  // Email or ID of the person who did it
    details: text('details'), // JSON string or text for more info
    ipAddress: text('ip_address'), // Store the IP address of the user
});

export const systemMeta = sqliteTable('system_meta', {
    key: text('key').primaryKey(), // We'll use 'last_logs_cleared'
    value: text('value').notNull(),
});