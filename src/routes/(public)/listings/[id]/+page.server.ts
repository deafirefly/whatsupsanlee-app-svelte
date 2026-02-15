import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    // Get the ID from the URL (/listings/1)
    const listingId = Number(params.id);

    // Fetch the listing from the database
    const listing = await db.query.listings.findFirst({
        where: eq(listings.id, listingId)
    });

    // If it doesn't exist, show a 404
    if (!listing) throw error(404, 'Listing not found');

    return { listing };
};