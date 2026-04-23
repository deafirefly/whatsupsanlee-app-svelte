// src/routes/(public)/creators/[id]/+page.server.ts

import { db } from '$lib/server/db';
import { creators } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Not found');

    const result = await db.select().from(creators).where(eq(creators.id, id)).limit(1);
    if (!result.length) throw error(404, 'Not found');

    const creator = result[0];

    const isOwner = locals.user?.id === creator.userId;
    const isAdmin = locals.user?.isAdmin ?? false;
    if (creator.status !== 'approved' && !isOwner && !isAdmin) throw error(404, 'Not found');

    const parse = (val: string | null) => {
        try { return JSON.parse(val ?? '[]'); } catch { return []; }
    };

    return {
        creator: {
            ...creator,
            contentCategories: parse(creator.contentCategories),
        },
        currentUserId: locals.user?.id ?? null,
        isAdmin,
    };
};

export const actions = {
    delete: async ({ params, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });
        const id = Number(params.id);
        const creator = await db.query.creators.findFirst({ where: eq(creators.id, id) });
        if (!creator) return fail(404, { message: 'Not found' });
        if (creator.userId !== locals.user.id && !locals.user.isAdmin) return fail(403, { message: 'Not authorized' });
        await db.delete(creators).where(eq(creators.id, id));
        redirect(303, '/creators');
    }
};