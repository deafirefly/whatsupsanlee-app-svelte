import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        const userId = locals.user?.id;
        if (!userId) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.businessName) return fail(400, { message: 'Business name is required' });
        if (!data.contactPerson) return fail(400, { message: 'Contact person is required' });
        if (!data.address) return fail(400, { message: 'Address is required' });

        try {
            await db.insert(listings).values({
                userId,
                businessName: data.businessName as string,
                category: data.category as string,
                contactPerson: data.contactPerson as string,

                bookingEnabled: ['photographer', 'artist'].includes(data.category as string),

                // Communication
                phone: (data.phone as string) || null,
                email: (data.email as string) || null,
                website: (data.website as string) || null,

                // Location
                address: data.address as string,
                locationPin: (data.locationPin as string) || null,

                // Content
                bio: (data.bio as string) || null,

                // Social
                instagram: (data.instagram as string) || null,
                facebook: (data.facebook as string) || null,
                twitter: (data.twitter as string) || null,
                tiktok: (data.tiktok as string) || null,

                // Schedule
                scheduleSummary: (data.scheduleSummary as string) || null,
                specificDates: (data.specificDates as string) || null,

                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Something went wrong. Please try again.' });
        }

        redirect(303, '/dashboard?message=Listing+submitted+for+review!');
    }
};