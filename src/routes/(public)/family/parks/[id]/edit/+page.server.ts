// src/routes/(public)/family/parks/[id]/edit/+page.server.ts
// Note: using (public) route but manual auth check

import { db } from '$lib/server/db';
import { parksTrails } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Not found');

    const place = await db.query.parksTrails.findFirst({ where: eq(parksTrails.id, id) });
    if (!place) throw error(404, 'Not found');
    if (place.userId !== locals.user.id && !locals.user.isAdmin) throw error(403, 'Not authorized');

    const parse = (val: string | null) => { try { return JSON.parse(val ?? '[]'); } catch { return []; } };

    return {
        place: { ...place, features: parse(place.features) }
    };
};

export const actions = {
    default: async ({ request, locals, params }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const id = Number(params.id);
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        if (!data.name) return fail(400, { message: 'Name is required' });
        if (!data.type) return fail(400, { message: 'Type is required' });

        let features: string[] = [];
        try { features = JSON.parse(data.features as string); } catch { features = []; }

        const place = await db.query.parksTrails.findFirst({ where: eq(parksTrails.id, id) });
        if (!place) return fail(404, { message: 'Not found' });
        if (place.userId !== locals.user.id && !locals.user.isAdmin) return fail(403, { message: 'Not authorized' });

        await db.update(parksTrails).set({
            name: data.name as string,
            type: data.type as string,
            description: (data.description as string) || null,
            address: (data.address as string) || null,
            locationPin: (data.locationPin as string) || null,
            ageRange: (data.ageRange as string) || 'all',
            features: JSON.stringify(features),
            trailDifficulty: (data.trailDifficulty as string) || null,
            trailLength: (data.trailLength as string) || null,
            status: 'pending', // reset to pending on resubmit
            updatedAt: new Date(),
        }).where(eq(parksTrails.id, id));

        redirect(303, `/family/parks/${id}?message=Resubmitted+for+review!`);
    }
};