// src/routes/(public)/open-houses/[id]/+page.server.ts

import { db } from '$lib/server/db';
import { openHouses } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Not found');

    const result = await db.select().from(openHouses).where(eq(openHouses.id, id)).limit(1);
    if (!result.length) throw error(404, 'Not found');

    const house = result[0];

    const isOwner = locals.user?.id === house.userId;
    const isAdmin = locals.user?.isAdmin ?? false;
    if (house.status !== 'approved' && !isOwner && !isAdmin) throw error(404, 'Not found');

    const today = new Date().toISOString().split('T')[0];

    return {
        house,
        currentUserId: locals.user?.id ?? null,
        isAdmin,
        today,
    };
};

export const actions = {
    delete: async ({ params, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });
        const id = Number(params.id);
        const house = await db.query.openHouses.findFirst({ where: eq(openHouses.id, id) });
        if (!house) return fail(404, { message: 'Not found' });
        if (house.userId !== locals.user.id && !locals.user.isAdmin) return fail(403, { message: 'Not authorized' });
        await db.delete(openHouses).where(eq(openHouses.id, id));
        redirect(303, '/open-houses');
    }
};