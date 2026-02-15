import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
    const approvedListings = await db.select()
        .from(listings)
        .where(eq(listings.status, 'approved'));

    return { approvedListings };
};