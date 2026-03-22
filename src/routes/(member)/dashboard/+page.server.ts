import { db } from '$lib/server/db';
import { listings, users, profiles, posts, events } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const userId = locals.user.id;

    // Get full user data including createdAt
    const fullUser = await db.query.users.findFirst({
        where: eq(users.id, userId)
    });

    const userListing = await db.query.listings.findFirst({
        where: eq(listings.userId, userId)
    });

    // Get or create profile
    let profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, userId)
    });

    // Check onboarding steps
    const hasSetupProfile = !!(profile?.displayName || profile?.bio || profile?.communityId);
    const hasMadePost = !!(await db.query.posts.findFirst({
        where: eq(posts.userId, userId)
    }));
    const hasPostedEvent = !!(await db.query.events.findFirst({
        where: eq(events.userId, userId)
    }));
    const hasCreatedListing = !!userListing;

    const onboardingSteps = [
    { key: 'account', label: 'Create your account', done: true, href: '' },
    { key: 'profile', label: 'Set up your profile', done: hasSetupProfile, href: '/profile/edit' },
    { key: 'community', label: 'Choose your community', done: !!(profile?.communityId), href: '/profile/edit' },
    { key: 'post', label: 'Make your first post', done: hasMadePost, href: '/feed/create' },
    { key: 'event', label: 'Post a community event', done: hasPostedEvent, href: '/events/create' },
    { key: 'listing', label: 'Create a business listing', done: hasCreatedListing, href: '/listings/create' },
];

const completedCount = onboardingSteps.filter(s => s.done).length;
const onboardingComplete = completedCount === onboardingSteps.length;

return {
    userListing,
    user: {
        ...locals.user,
        createdAt: fullUser?.createdAt ?? null
    },
    onboardingSteps,
    onboardingComplete,
    onboardingProgress: completedCount,
    totalSteps: onboardingSteps.length
};

};