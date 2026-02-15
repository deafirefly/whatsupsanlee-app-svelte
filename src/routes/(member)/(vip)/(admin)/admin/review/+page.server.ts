import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load = async () => {
    const pendingListings = await db.select()
        .from(listings)
        .where(eq(listings.status, 'pending'));

    return { pendingListings };
};

export const actions = {
    approve: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (!id) return fail(400, { message: 'Missing listing ID' });

        try {
            await db.update(listings)
                .set({ 
                    status: 'approved',
                    updatedAt: new Date() 
                })
                .where(eq(listings.id, id));
            
            return { success: true, message: 'Listing approved!' };
        } catch (err) {
            return fail(500, { message: 'Failed to approve listing' });
        }
    },

    reject: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));

        if (!id) return fail(400, { message: 'Missing listing ID' });

        try {
            // We could either delete it or just mark it rejected. 
            // Marking it rejected is better so the member can fix it later.
            await db.update(listings)
                .set({ 
                    status: 'rejected',
                    updatedAt: new Date() 
                })
                .where(eq(listings.id, id));

            return { success: true, message: 'Listing rejected.' };
        } catch (err) {
            return fail(500, { message: 'Failed to reject listing' });
        }
    }
};