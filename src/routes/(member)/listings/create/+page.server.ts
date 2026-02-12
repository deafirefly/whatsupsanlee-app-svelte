import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        // 1. Check if user is logged in
        // (You likely have this in locals or can get it from your session cookie)
        const userId = locals.user?.id; 
        if (!userId) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        try {
            await db.insert(listings).values({
                userId: userId,
                businessName: data.businessName as string,
                category: data.category as string,
                contactPerson: data.contactPerson as string,
                address: data.address as string,
                locationPin: data.locationPin as string,
                instagram: data.instagram as string,
                facebook: data.facebook as string,
                scheduleSummary: data.scheduleSummary as string,
                status: 'pending', // Always start as pending for Admin review
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Database error' });
        }

        throw redirect(303, '/dashboard?message=Listing submitted for review!');
    }
};