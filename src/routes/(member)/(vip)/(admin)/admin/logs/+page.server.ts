import { db } from '$lib/server/db';
import { logs, systemMeta } from '$lib/server/db/schema'; // Add systemMeta here
import { desc, eq } from 'drizzle-orm'; // Add eq here
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    const rolesJSON = cookies.get('user_roles') || '[]';
    const roles = JSON.parse(rolesJSON);

    const hasAccess = roles.includes('admin') || roles.includes('superadmin');
    if (!hasAccess) {
        throw redirect(302, '/dashboard'); 
    }

    // 1. Fetch Logs
    const allLogs = await db.query.logs.findMany({
        orderBy: [desc(logs.timestamp)],
        limit: 200 
    });

    // 2. Fetch Last Cleared Meta
    const metaRecord = await db.query.systemMeta.findFirst({
        where: eq(systemMeta.key, 'last_logs_cleared')
    });

    return { 
        allLogs,
        lastCleared: metaRecord?.value || null
    };
};

export const actions = {
    clearLogs: async ({ cookies }) => {
        const roles = JSON.parse(cookies.get('user_roles') || '[]');
        if (!roles.includes('superadmin')) {
            return fail(403, { message: 'Unauthorized' });
        }

        try {
            // 1. Wipe the table
            await db.delete(logs);

            // 2. Record the timestamp
            const now = new Date().toISOString();
            
            // This 'upsert' logic handles both first-time creation and future updates
            await db.insert(systemMeta)
                .values({ key: 'last_logs_cleared', value: now })
                .onConflictDoUpdate({ 
                    target: systemMeta.key, 
                    set: { value: now } 
                });

            return { success: true };
        } catch (e) {
            console.error(e);
            return fail(500, { message: 'Failed to clear logs' });
        }
    }
};