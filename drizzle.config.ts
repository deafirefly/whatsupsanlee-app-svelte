import { defineConfig } from 'drizzle-kit';

const isProduction = process.env.TURSO_URL?.startsWith('libsql://');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: isProduction ? 'turso' : 'sqlite',
	dbCredentials: isProduction ? {
		url: process.env.TURSO_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!,
	} : {
		url: 'file:local.db',
	},
});