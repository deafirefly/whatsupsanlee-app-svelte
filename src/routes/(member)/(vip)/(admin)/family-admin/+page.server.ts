// src/routes/(member)/(vip)/(admin)/family-admin/+page.server.ts

import { db } from '$lib/server/db';
import { parksTrails, users, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const all = await db.select({
        id: parksTrails.id,
        name: parksTrails.name,
        type: parksTrails.type,
        description: parksTrails.description,
        address: parksTrails.address,
        ageRange: parksTrails.ageRange,
        features: parksTrails.features,
        trailDifficulty: parksTrails.trailDifficulty,
        trailLength: parksTrails.trailLength,
        status: parksTrails.status,
        isFeatured: parksTrails.isFeatured,
        createdAt: parksTrails.createdAt,
        authorEmail: users.email,
        authorName: profiles.displayName,
    })
    .from(parksTrails)
    .leftJoin(users, eq(parksTrails.userId, users.id))
    .leftJoin(profiles, eq(parksTrails.userId, profiles.userId))
    .orderBy(parksTrails.createdAt);

    const parsed = all.map(p => ({
        ...p,
        features: (() => { try { return JSON.parse(p.features ?? '[]'); } catch { return []; } })()
    }));

    return { allPlaces: parsed };
};

export const actions = {
    approve: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.update(parksTrails).set({ status: 'approved', updatedAt: new Date() }).where(eq(parksTrails.id, id));
        return { success: true };
    },

    reject: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.update(parksTrails).set({ status: 'rejected', updatedAt: new Date() }).where(eq(parksTrails.id, id));
        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.delete(parksTrails).where(eq(parksTrails.id, id));
        return { success: true };
    },

    toggleFeatured: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const current = formData.get('isFeatured') === 'true';
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.update(parksTrails).set({ isFeatured: !current, updatedAt: new Date() }).where(eq(parksTrails.id, id));
        return { success: true };
    }
};