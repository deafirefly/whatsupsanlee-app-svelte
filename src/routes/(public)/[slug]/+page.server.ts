import { db } from '$lib/server/db';
import { listings, listingPhotos, menuItems, listingSchedule, availability } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const { slug } = params;

    // Skip if it looks like a known route
    const knownRoutes = ['login', 'register', 'about', 'contact', 'feed', 
                         'events', 'listings', 'dashboard', 'profile', 
                         'subscribe', 'support', 'beta', 'privacy', 'terms',
                         'maintenance', 'admin', 'vip-lounge', 'vip-directory'];
    
    if (knownRoutes.includes(slug)) {
        throw error(404, 'Page not found');
    }

    // Find listing by slug
    const listing = await db.query.listings.findFirst({
        where: and(
            eq(listings.slug, slug),
            eq(listings.status, 'approved')
        )
    });

    if (!listing) throw error(404, 'Listing not found');

    // Redirect to the full listing page
    throw redirect(301, `/listings/${listing.id}`);
};