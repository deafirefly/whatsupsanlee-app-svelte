import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// This will create a file named 'local.db' in your project root
const client = createClient({ url: 'file:local.db' });

export const db = drizzle(client, { schema });