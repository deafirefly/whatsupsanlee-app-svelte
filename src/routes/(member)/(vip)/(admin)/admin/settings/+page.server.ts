import { db } from '$lib/server/db';
import { systemMeta } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

async function getSetting(key: string, defaultValue: string = '') {
    const row = await db.query.systemMeta.findFirst({
        where: eq(systemMeta.key, key)
    });
    return row?.value ?? defaultValue;
}

async function setSetting(key: string, value: string) {
    const existing = await db.query.systemMeta.findFirst({
        where: eq(systemMeta.key, key)
    });
    if (existing) {
        await db.update(systemMeta).set({ value }).where(eq(systemMeta.key, key));
    } else {
        await db.insert(systemMeta).values({ key, value });
    }
}

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');
    if (!locals.user.roles?.includes('superadmin') && 
        !(typeof locals.user.roles === 'string' && JSON.parse(locals.user.roles).includes('superadmin'))) {
        throw redirect(302, '/admin-dashboard');
    }

    const settings = {
        siteName: await getSetting('site_name', 'WhatsUp SanLee'),
        siteDescription: await getSetting('site_description', 'Your local community platform for Sanford & Lee County, NC'),
        maintenanceMode: await getSetting('maintenance_mode', 'false'),
        betaMode: await getSetting('beta_mode', 'true'),
        registrationOpen: await getSetting('registration_open', 'true'),
    };

    return { settings };
};

export const actions = {
    saveSettings: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();

        try {
            await setSetting('site_name', (formData.get('siteName') as string)?.trim() || 'WhatsUp SanLee');
            await setSetting('site_description', (formData.get('siteDescription') as string)?.trim() || '');
            await setSetting('maintenance_mode', formData.get('maintenanceMode') === 'on' ? 'true' : 'false');
            await setSetting('beta_mode', formData.get('betaMode') === 'on' ? 'true' : 'false');
            await setSetting('registration_open', formData.get('registrationOpen') === 'on' ? 'true' : 'false');
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Could not save settings.' });
        }

        return { success: true };
    }
};