// src/routes/(member)/(vip)/(admin)/open-houses-admin/+page.server.ts

import { db } from '$lib/server/db';
import { openHouses, users, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const all = await db.select({
        id: openHouses.id,
        title: openHouses.title,
        address: openHouses.address,
        price: openHouses.price,
        bedrooms: openHouses.bedrooms,
        bathrooms: openHouses.bathrooms,
        sqFt: openHouses.sqFt,
        propertyType: openHouses.propertyType,
        agentName: openHouses.agentName,
        agentCompany: openHouses.agentCompany,
        agentPhone: openHouses.agentPhone,
        agentEmail: openHouses.agentEmail,
        openDate: openHouses.openDate,
        startTime: openHouses.startTime,
        endTime: openHouses.endTime,
        status: openHouses.status,
        isFeatured: openHouses.isFeatured,
        createdAt: openHouses.createdAt,
        authorEmail: users.email,
        authorName: profiles.displayName,
    })
    .from(openHouses)
    .leftJoin(users, eq(openHouses.userId, users.id))
    .leftJoin(profiles, eq(openHouses.userId, profiles.userId))
    .orderBy(openHouses.openDate);

    return { allHouses: all };
};

export const actions = {
    approve: async ({ request }) => {
        const id = Number((await request.formData()).get('id'));
        if (!id) return fail(400);
        await db.update(openHouses).set({ status: 'approved', updatedAt: new Date() }).where(eq(openHouses.id, id));
        return { success: true };
    },
    reject: async ({ request }) => {
        const id = Number((await request.formData()).get('id'));
        if (!id) return fail(400);
        await db.update(openHouses).set({ status: 'rejected', updatedAt: new Date() }).where(eq(openHouses.id, id));
        return { success: true };
    },
    delete: async ({ request }) => {
        const id = Number((await request.formData()).get('id'));
        if (!id) return fail(400);
        await db.delete(openHouses).where(eq(openHouses.id, id));
        return { success: true };
    },
    toggleFeatured: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const current = formData.get('isFeatured') === 'true';
        if (!id) return fail(400);
        await db.update(openHouses).set({ isFeatured: !current, updatedAt: new Date() }).where(eq(openHouses.id, id));
        return { success: true };
    }
};