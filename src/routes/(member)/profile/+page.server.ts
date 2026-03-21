import { db } from '$lib/server/db';
import { profiles, areas, communities, listings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
    if (!locals.user) throw redirect(302, '/login');

    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, locals.user.id)
    });

    // Load area and community names if set
    let areaName = null;
    let communityName = null;

    if (profile?.areaId) {
        const area = await db.query.areas.findFirst({
            where: eq(areas.id, profile.areaId)
        });
        areaName = area?.name ?? null;
    }

    if (profile?.communityId) {
        const community = await db.query.communities.findFirst({
            where: eq(communities.id, profile.communityId)
        });
        communityName = community?.name ?? null;
    }

    // Load their listing if any
    const listing = await db.query.listings.findFirst({
        where: eq(listings.userId, locals.user.id)
    });

    // URL message
    const message = url.searchParams.get('message');

    return {
        profile,
        areaName,
        communityName,
        listing,
        user: locals.user,
        message
    };
};