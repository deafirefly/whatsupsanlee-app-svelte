// src/routes/(public)/family/parks/submit/+page.server.ts
// Note: (public) route but requires login check manually

import { db } from '$lib/server/db';
import { parksTrails } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'You must be logged in to submit a place.' });

        const formData = await request.formData();

        const name = formData.get('name') as string;
        const type = formData.get('type') as string;

        if (!name) return fail(400, { message: 'Name is required' });
        if (!type) return fail(400, { message: 'Type is required' });

        let features: string[] = [];
        try { features = JSON.parse(formData.get('features') as string); } catch { features = []; }

        try {
            await db.insert(parksTrails).values({
                userId: locals.user.id,
                name,
                type,
                description: (formData.get('description') as string) || null,
                address: (formData.get('address') as string) || null,
                locationPin: (formData.get('locationPin') as string) || null,
                ageRange: (formData.get('ageRange') as string) || 'all',
                features: JSON.stringify(features),
                trailDifficulty: (formData.get('trailDifficulty') as string) || null,
                trailLength: (formData.get('trailLength') as string) || null,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Something went wrong. Please try again.' });
        }

        redirect(303, '/family?message=Place+submitted+for+review!');
    }
};