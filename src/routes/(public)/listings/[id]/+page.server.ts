import { db } from '$lib/server/db';
import { listings, listingPhotos, menuItems, listingSchedule } from '$lib/server/db/schema';
import { bookings, availability } from '$lib/server/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const listingId = Number(params.id);

    if (isNaN(listingId)) throw error(404, 'Listing not found');

    const listing = await db.query.listings.findFirst({
        where: and(
            eq(listings.id, listingId),
            eq(listings.status, 'approved')
        )
    });

    if (!listing) throw error(404, 'Listing not found');

    // Load photos ordered by sortOrder
    const photos = await db.select()
        .from(listingPhotos)
        .where(eq(listingPhotos.listingId, listingId))
        .orderBy(listingPhotos.sortOrder);

    // Load available menu items
    const menu = await db.select()
        .from(menuItems)
        .where(and(
            eq(menuItems.listingId, listingId),
            eq(menuItems.isAvailable, true)
        ))
        .orderBy(menuItems.sortOrder);

    // Load upcoming schedule (today and future)
    const today = new Date().toISOString().split('T')[0];
    const schedule = await db.select()
        .from(listingSchedule)
        .where(and(
            eq(listingSchedule.listingId, listingId),
            gte(listingSchedule.date, today)
        ))
        .orderBy(listingSchedule.date);

        // Load availability for booking form
        const vendorAvailability = await db.select()
            .from(availability)
            .where(and(
                eq(availability.listingId, listingId),
                eq(availability.isAvailable, true)
        ));

    return { listing, photos, menu, schedule, vendorAvailability };
};

requestBooking: async ({ request }) => {
    const formData = await request.formData();

    const clientName = (formData.get('clientName') as string)?.trim();
    const clientEmail = (formData.get('clientEmail') as string)?.trim();
    const clientPhone = (formData.get('clientPhone') as string) || null;
    const date = formData.get('date') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = (formData.get('endTime') as string) || null;
    const serviceType = (formData.get('serviceType') as string) || null;
    const notes = (formData.get('notes') as string) || null;
    const listingId = Number(formData.get('listingId'));

    if (!clientName || !clientEmail || !date || !startTime) {
        return fail(400, { bookingMessage: 'Please fill in all required fields.' });
    }

    await db.insert(bookings).values({
        listingId,
        clientName,
        clientEmail,
        clientPhone,
        date,
        startTime,
        endTime,
        serviceType,
        notes,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return { bookingSuccess: true };
}