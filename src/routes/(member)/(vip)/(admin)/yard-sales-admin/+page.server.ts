// src/routes/(member)/(vip)/(admin)/yard-sales-admin/+page.server.ts

import { db } from '$lib/server/db';
import { yardSales, users, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const all = await db.select({
        id: yardSales.id,
        title: yardSales.title,
        contactName: yardSales.contactName,
        address: yardSales.address,
        saleDate: yardSales.saleDate,
        startTime: yardSales.startTime,
        endTime: yardSales.endTime,
        items: yardSales.items,
        status: yardSales.status,
        isFeatured: yardSales.isFeatured,
        createdAt: yardSales.createdAt,
        authorEmail: users.email,
        authorName: profiles.displayName,
    })
    .from(yardSales)
    .innerJoin(users, eq(yardSales.userId, users.id))
    .leftJoin(profiles, eq(yardSales.userId, profiles.userId))
    .orderBy(yardSales.createdAt);

    const parsed = all.map(s => ({
        ...s,
        items: (() => { try { return JSON.parse(s.items); } catch { return []; } })()
    }));

    return { allSales: parsed };
};

export const actions = {
    approve: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.update(yardSales).set({ status: 'approved', updatedAt: new Date() }).where(eq(yardSales.id, id));
        return { success: true };
    },

    reject: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.update(yardSales).set({ status: 'rejected', updatedAt: new Date() }).where(eq(yardSales.id, id));
        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.delete(yardSales).where(eq(yardSales.id, id));
        return { success: true };
    },

    toggleFeatured: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const current = formData.get('isFeatured') === 'true';
        if (!id) return fail(400, { message: 'Missing ID' });
        await db.update(yardSales).set({ isFeatured: !current, updatedAt: new Date() }).where(eq(yardSales.id, id));
        return { success: true };
    }
};