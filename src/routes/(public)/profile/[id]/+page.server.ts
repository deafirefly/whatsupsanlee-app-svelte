import { db } from '$lib/server/db';
import { profiles, areas, communities, listings, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const userId = Number(params.id);

    if (isNaN(userId)) throw error(404, 'Profile not found');

    // Load the user
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    if (!user) throw error(404, 'Profile not found');

    // Load their profile
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userId)
    });

    if (!profile) throw error(404, 'Profile not found');

    // Check privacy settings
    const isOwnProfile = locals.user?.id === userId;
    const isLoggedIn = !!locals.user;

    if (!isOwnProfile) {
        if (profile.visibility === 'private') {
            throw error(403, 'This profile is private');
        }
        if (profile.visibility === 'members' && !isLoggedIn) {
            throw error(403, 'This profile is visible to members only');
        }
    }

    // Load area and community
    let areaName = null;
    let communityName = null;

    if (profile.areaId) {
        const area = await db.query.areas.findFirst({
            where: eq(areas.id, profile.areaId)
        });
        areaName = area?.name ?? null;
    }

    if (profile.communityId) {
        const community = await db.query.communities.findFirst({
            where: eq(communities.id, profile.communityId)
        });
        communityName = community?.name ?? null;
    }

    // Load their approved listing if any
    const listing = await db.query.listings.findFirst({
        where: eq(listings.userId, userId)
    });

    const approvedListing = listing?.status === 'approved' ? listing : null;

    return {
        profile,
        user,
        areaName,
        communityName,
        listing: approvedListing,
        isOwnProfile,
        isLoggedIn
    };
};