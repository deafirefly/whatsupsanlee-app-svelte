import { db } from '$lib/server/db';
import { availability, listings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    // Get their listing
    const listing = await db.query.listings.findFirst({
        where: eq(listings.userId, locals.user.id)
    });

    if (!listing) throw redirect(302, '/dashboard');

    // Get their availability
    const availabilityData = await db.select()
        .from(availability)
        .where(eq(availability.listingId, listing.id))
        .orderBy(availability.dayOfWeek);

    return { listing, availability: availabilityData };
};

export const actions = {
    saveAvailability: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const listing = await db.query.listings.findFirst({
            where: eq(listings.userId, locals.user.id)
        });

        if (!listing) return fail(404, { message: 'Listing not found' });

        const formData = await request.formData();

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

        // Delete existing availability
        await db.delete(availability).where(eq(availability.listingId, listing.id));

        // Insert new availability
        for (const day of days) {
            const isAvailable = formData.get(`${day}_available`) === 'on';
            const startTime = formData.get(`${day}_start`) as string;
            const endTime = formData.get(`${day}_end`) as string;

            if (isAvailable && startTime && endTime) {
                await db.insert(availability).values({
                    listingId: listing.id,
                    dayOfWeek: day,
                    startTime,
                    endTime,
                    isAvailable: true
                });
            }
        }

        return { success: true };
    }
};