import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    // 1. Safety Guard: If no user, kick them to login
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    // 2. Now TypeScript knows locals.user exists!
    const userId = locals.user.id;

    const userListing = await db.query.listings.findFirst({
        where: eq(listings.userId, userId)
    });

    return { 
        userListing,
        user: locals.user // Pass user data too just in case
    };
};