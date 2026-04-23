// src/routes/(member)/creators/create/+page.server.ts

import { db } from '$lib/server/db';
import { creators } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        if (!data.name) return fail(400, { message: 'Name is required' });

        let contentCategories: string[] = [];
        try { contentCategories = JSON.parse(data.contentCategories as string); } catch { contentCategories = []; }

        if (contentCategories.length === 0) {
            return fail(400, { message: 'Please select at least one content category' });
        }

        // Must have at least one platform
        const platforms = ['youtube', 'tiktok', 'instagram', 'twitch', 'podcast', 'facebook', 'twitter', 'bluesky', 'website'];
        const hasPlatform = platforms.some(p => data[p]);
        if (!hasPlatform) {
            return fail(400, { message: 'Please add at least one platform link' });
        }

        try {
            await db.insert(creators).values({
                userId: locals.user.id,
                name: data.name as string,
                tagline: (data.tagline as string) || null,
                bio: (data.bio as string) || null,
                imageUrl: (data.imageUrl as string) || null,
                area: (data.area as string) || null,
                contentCategories: JSON.stringify(contentCategories),
                youtube: (data.youtube as string) || null,
                tiktok: (data.tiktok as string) || null,
                instagram: (data.instagram as string) || null,
                twitch: (data.twitch as string) || null,
                podcast: (data.podcast as string) || null,
                facebook: (data.facebook as string) || null,
                twitter: (data.twitter as string) || null,
                bluesky: (data.bluesky as string) || null,
                website: (data.website as string) || null,
                youtubeSubs: (data.youtubeSubs as string) || null,
                tiktokFollowers: (data.tiktokFollowers as string) || null,
                instagramFollowers: (data.instagramFollowers as string) || null,
                twitchFollowers: (data.twitchFollowers as string) || null,
                podcastListeners: (data.podcastListeners as string) || null,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Something went wrong. Please try again.' });
        }

        redirect(303, '/dashboard?message=Creator+profile+submitted+for+review!');
    }
};