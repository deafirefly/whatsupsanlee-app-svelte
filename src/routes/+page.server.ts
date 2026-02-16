import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm'; // Import desc

export const load = async () => {
    const approvedListings = await db.select()
        .from(listings)
        .where(eq(listings.status, 'approved'))
        .orderBy(desc(listings.createdAt)); // Newest first!

    return { approvedListings };
};