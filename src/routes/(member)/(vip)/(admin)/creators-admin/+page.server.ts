// src/routes/(member)/(vip)/(admin)/creators-admin/+page.server.ts

import { db } from '$lib/server/db';
import { creators, users, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const all = await db.select({
        id: creators.id,
        name: creators.name,
        tagline: creators.tagline,
        area: creators.area,
        contentCategories: creators.contentCategories,
        youtube: creators.youtube,
        tiktok: creators.tiktok,
        instagram: creators.instagram,
        twitch: creators.twitch,
        podcast: creators.podcast,
        status: creators.status,
        isFeatured: creators.isFeatured,
        createdAt: creators.createdAt,
        authorEmail: users.email,
        authorName: profiles.displayName,
    })
    .from(creators)
    .leftJoin(users, eq(creators.userId, users.id))
    .leftJoin(profiles, eq(creators.userId, profiles.userId))
    .orderBy(creators.createdAt);

    const parse = (val: string | null) => {
        try { return JSON.parse(val ?? '[]'); } catch { return []; }
    };

    return {
        allCreators: all.map(c => ({
            ...c,
            contentCategories: parse(c.contentCategories),
        }))
    };
};

export const actions = {
    approve: async ({ request }) => {
        const id = Number((await request.formData()).get('id'));
        if (!id) return fail(400);
        await db.update(creators).set({ status: 'approved', updatedAt: new Date() }).where(eq(creators.id, id));
        return { success: true };
    },
    reject: async ({ request }) => {
        const id = Number((await request.formData()).get('id'));
        if (!id) return fail(400);
        await db.update(creators).set({ status: 'rejected', updatedAt: new Date() }).where(eq(creators.id, id));
        return { success: true };
    },
    delete: async ({ request }) => {
        const id = Number((await request.formData()).get('id'));
        if (!id) return fail(400);
        await db.delete(creators).where(eq(creators.id, id));
        return { success: true };
    },
    toggleFeatured: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const current = formData.get('isFeatured') === 'true';
        if (!id) return fail(400);
        await db.update(creators).set({ isFeatured: !current, updatedAt: new Date() }).where(eq(creators.id, id));
        return { success: true };
    }
};