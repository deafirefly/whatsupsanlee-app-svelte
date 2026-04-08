// src/routes/(public)/family/parks/[id]/+page.server.ts

import { db } from '$lib/server/db';
import { parksTrails } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Not found');

    const result = await db.select().from(parksTrails).where(eq(parksTrails.id, id)).limit(1);
    if (!result.length) throw error(404, 'Not found');

    const place = result[0];

    const isOwner = locals.user?.id === place.userId;
    const isAdmin = locals.user?.isAdmin ?? false;
    if (place.status !== 'approved' && !isOwner && !isAdmin) throw error(404, 'Not found');

    const parse = (val: string) => { try { return JSON.parse(val); } catch { return []; } };

    return {
        place: { ...place, features: parse(place.features ?? '[]') },
        currentUserId: locals.user?.id ?? null,
        isAdmin,
    };
};

export const actions = {
    delete: async ({ params, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });
        const id = Number(params.id);
        const place = await db.query.parksTrails.findFirst({ where: eq(parksTrails.id, id) });
        if (!place) return fail(404, { message: 'Not found' });
        if (place.userId !== locals.user.id && !locals.user.isAdmin) return fail(403, { message: 'Not authorized' });
        await db.delete(parksTrails).where(eq(parksTrails.id, id));
        redirect(303, '/family');
    }
};