// src/routes/(member)/(vip)/(admin)/farmers-admin/+page.server.ts

import { db } from '$lib/server/db';
import { farmerListings, users, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const all = await db.select({
        id: farmerListings.id,
        farmName: farmerListings.farmName,
        contactName: farmerListings.contactName,
        produceCategories: farmerListings.produceCategories,
        farmAddress: farmerListings.farmAddress,
        status: farmerListings.status,
        isFeatured: farmerListings.isFeatured,
        createdAt: farmerListings.createdAt,
        authorEmail: users.email,
        authorName: profiles.displayName,
    })
    .from(farmerListings)
    .innerJoin(users, eq(farmerListings.userId, users.id))
    .leftJoin(profiles, eq(farmerListings.userId, profiles.userId))
    .orderBy(farmerListings.createdAt);

    const parse = (val: string) => { try { return JSON.parse(val); } catch { return []; } };

    return {
        allFarmers: all.map(f => ({
            ...f,
            produceCategories: parse(f.produceCategories),
        }))
    };
};

export const actions = {
    approve: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.update(farmerListings).set({ status: 'approved', updatedAt: new Date() }).where(eq(farmerListings.id, id));
        return { success: true };
    },
    reject: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.update(farmerListings).set({ status: 'rejected', updatedAt: new Date() }).where(eq(farmerListings.id, id));
        return { success: true };
    },
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.delete(farmerListings).where(eq(farmerListings.id, id));
        return { success: true };
    },
    toggleFeatured: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const current = formData.get('isFeatured') === 'true';
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.update(farmerListings).set({ isFeatured: !current, updatedAt: new Date() }).where(eq(farmerListings.id, id));
        return { success: true };
    }
};