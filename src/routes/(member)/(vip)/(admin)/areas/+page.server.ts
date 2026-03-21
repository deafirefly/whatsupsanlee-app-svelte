import { db } from '$lib/server/db';
import { areas, communities } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const allAreas = await db.select().from(areas).orderBy(areas.name);

    // Get community count per area
    const allCommunities = await db.select().from(communities);

    const areasWithCount = allAreas.map(area => ({
        ...area,
        communityCount: allCommunities.filter(c => c.areaId === area.id).length
    }));

    return { areas: areasWithCount };
};

export const actions = {
    addArea: async ({ request }) => {
        const formData = await request.formData();
        const name = (formData.get('name') as string)?.trim();

        if (!name) return fail(400, { message: 'Area name is required' });

        try {
            await db.insert(areas).values({ name });
        } catch (err) {
            return fail(500, { message: 'Area already exists or database error.' });
        }

        return { success: true };
    },

    deleteArea: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) return fail(400, { message: 'Missing area ID' });

        try {
            await db.delete(areas).where(eq(areas.id, id));
        } catch (err) {
            return fail(500, { message: 'Could not delete area.' });
        }

        return { success: true };
    },

    editArea: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const name = (formData.get('name') as string)?.trim();

        if (!id || !name) return fail(400, { message: 'Missing area ID or name' });

        try {
            await db.update(areas).set({ name }).where(eq(areas.id, id));
        } catch (err) {
            return fail(500, { message: 'Could not update area.' });
        }

        return { success: true };
    }
};