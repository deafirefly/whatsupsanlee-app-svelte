import { db } from '$lib/server/db';
import { systemMeta } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

async function getSetting(key: string, defaultValue: string = '') {
    try {
        const row = await db.query.systemMeta.findFirst({
            where: eq(systemMeta.key, key)
        });
        return row?.value ?? defaultValue;
    } catch {
        return defaultValue;
    }
}

export const load = async ({ locals }) => {
    const [betaMode, registrationOpen] = await Promise.all([
        getSetting('beta_mode', 'true'),
        getSetting('registration_open', 'true'),
    ]);

    return {
        user: locals.user ?? null,
        betaMode: betaMode === 'true',
        registrationOpen: registrationOpen === 'true',
    };
};