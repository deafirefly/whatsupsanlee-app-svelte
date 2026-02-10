import { db } from '$lib/server/db';
import { logs } from '$lib/server/db/schema';

export async function createLog(event: string, { 
    user = 'system', 
    level = 'info' as 'info' | 'warn' | 'error', 
    details = '',
    ipAddress = '' 
} = {}) {
    try {
        await db.insert(logs).values({
            event,
            user,
            level,
            details,
            ipAddress,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error("Critical Logger Failure:", err);
    }
}

export default createLog;