import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const allListings = await db.select()
        .from(listings)
        .orderBy(listings.createdAt);

    return { allListings };
};

export const actions = {
    approve: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing listing ID' });

        await db.update(listings)
            .set({ status: 'approved', updatedAt: new Date() })
            .where(eq(listings.id, id));

        return { success: true };
    },

    reject: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing listing ID' });

        await db.update(listings)
            .set({ status: 'rejected', updatedAt: new Date() })
            .where(eq(listings.id, id));

        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing listing ID' });

        await db.delete(listings)
            .where(eq(listings.id, id));

        return { success: true };
    }
};