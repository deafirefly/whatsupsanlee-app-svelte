import { db } from '$lib/server/db';
import { availability, listings, specificAvailability } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const listing = await db.query.listings.findFirst({
        where: eq(listings.userId, locals.user.id)
    });

    if (!listing) throw redirect(302, '/dashboard');

    const availabilityData = await db.select()
        .from(availability)
        .where(eq(availability.listingId, listing.id))
        .orderBy(availability.dayOfWeek);

    const specificDates = await db.select()
        .from(specificAvailability)
        .where(eq(specificAvailability.listingId, listing.id))
        .orderBy(specificAvailability.date);

    return { listing, availability: availabilityData, specificDates };
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

        await db.delete(availability).where(eq(availability.listingId, listing.id));

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
    },

    toggleBooking: async ({ locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const listing = await db.query.listings.findFirst({
            where: eq(listings.userId, locals.user.id)
        });

        if (!listing) return fail(404, { message: 'Listing not found' });

        await db.update(listings)
            .set({ bookingEnabled: !listing.bookingEnabled })
            .where(eq(listings.id, listing.id));

        return { success: true };
    },

    setMode: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const listing = await db.query.listings.findFirst({
            where: eq(listings.userId, locals.user.id)
        });

        if (!listing) return fail(404, { message: 'Listing not found' });

        const formData = await request.formData();
        const mode = formData.get('mode') as string;

        await db.update(listings)
            .set({ availabilityMode: mode })
            .where(eq(listings.id, listing.id));

        return { success: true };
    },

    addSpecificDate: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const listing = await db.query.listings.findFirst({
            where: eq(listings.userId, locals.user.id)
        });

        if (!listing) return fail(404, { message: 'Listing not found' });

        const formData = await request.formData();
        const date = formData.get('date') as string;
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;
        const notes = (formData.get('notes') as string) || null;

        if (!date || !startTime || !endTime) {
            return fail(400, { message: 'Date, start time and end time are required' });
        }

        // Check for duplicate date
        const existing = await db.query.specificAvailability.findFirst({
            where: eq(specificAvailability.listingId, listing.id)
        });

        await db.insert(specificAvailability).values({
            listingId: listing.id,
            date,
            startTime,
            endTime,
            notes,
            createdAt: new Date()
        });

        return { success: true };
    },

    deleteSpecificDate: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const id = Number(formData.get('id'));

        await db.delete(specificAvailability)
            .where(eq(specificAvailability.id, id));

        return { success: true };
    }
};