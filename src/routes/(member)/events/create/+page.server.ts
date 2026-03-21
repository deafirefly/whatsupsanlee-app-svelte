import { db } from '$lib/server/db';
import { events, areas, communities } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const allAreas = await db.select().from(areas).orderBy(areas.name);
    const allCommunities = await db.select().from(communities).orderBy(communities.name);

    return { allAreas, allCommunities };
};

export const actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();

        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;

        // Basic validation
        if (!title) return fail(400, { message: 'Event title is required' });
        if (!category) return fail(400, { message: 'Please select a category' });
        if (!startDate) return fail(400, { message: 'Start date is required' });

        try {
            await db.insert(events).values({
                userId: locals.user.id,
                title,
                category,
                description: (formData.get('description') as string) || null,
                imageUrl: (formData.get('imageUrl') as string) || null,

                // Dates
                startDate,
                endDate: (formData.get('endDate') as string) || startDate,
                startTime: (formData.get('startTime') as string) || null,
                endTime: (formData.get('endTime') as string) || null,

                // Location
                locationName: (formData.get('locationName') as string) || null,
                address: (formData.get('address') as string) || null,
                locationPin: (formData.get('locationPin') as string) || null,

                // Area & Community
                areaId: formData.get('areaId') ? Number(formData.get('areaId')) : null,
                communityId: formData.get('communityId') ? Number(formData.get('communityId')) : null,

                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Could not submit event. Please try again.' });
        }

        redirect(303, '/dashboard?message=Event+submitted+for+review!');
    }
};