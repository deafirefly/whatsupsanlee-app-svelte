import { db } from '$lib/server/db';
import { listings, listingPhotos, menuItems, listingSchedule } from '$lib/server/db/schema';
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

    return { listing, photos, menu, schedule };
};