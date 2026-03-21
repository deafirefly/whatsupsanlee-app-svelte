import { db } from '$lib/server/db';
import { areas, communities } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const allAreas = await db.select().from(areas).orderBy(areas.name);
    const allCommunities = await db.select().from(communities).orderBy(communities.name);

    // Group communities by area
    const communitiesByArea = allAreas.map(area => ({
        ...area,
        communities: allCommunities.filter(c => c.areaId === area.id)
    }));

    return { communitiesByArea, allAreas };
};

export const actions = {
    addCommunity: async ({ request }) => {
        const formData = await request.formData();
        const name = (formData.get('name') as string)?.trim();
        const areaId = Number(formData.get('areaId'));

        if (!name) return fail(400, { message: 'Community name is required' });
        if (!areaId) return fail(400, { message: 'Please select an area' });

        try {
            await db.insert(communities).values({ name, areaId });
        } catch (err) {
            return fail(500, { message: 'Could not add community.' });
        }

        return { success: true };
    },

    deleteCommunity: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        if (!id) return fail(400, { message: 'Missing community ID' });

        try {
            await db.delete(communities).where(eq(communities.id, id));
        } catch (err) {
            return fail(500, { message: 'Could not delete community.' });
        }

        return { success: true };
    },

    editCommunity: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const name = (formData.get('name') as string)?.trim();

        if (!id || !name) return fail(400, { message: 'Missing ID or name' });

        try {
            await db.update(communities).set({ name }).where(eq(communities.id, id));
        } catch (err) {
            return fail(500, { message: 'Could not update community.' });
        }

        return { success: true };
    }
};
