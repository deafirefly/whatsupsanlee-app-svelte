import { db } from '$lib/server/db';
import { listings, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    const userId = locals.user.id;

    // Get full user data including createdAt
    const fullUser = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    const userListing = await db.query.listings.findFirst({
        where: eq(listings.userId, userId)
    });

    return { 
        userListing,
        user: {
            ...locals.user,
            createdAt: fullUser?.createdAt ?? null
        }
    };
};