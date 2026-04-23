// src/routes/(member)/creators/[id]/edit/+page.server.ts

import { db } from '$lib/server/db';
import { creators } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Not found');

    const creator = await db.query.creators.findFirst({ where: eq(creators.id, id) });
    if (!creator) throw error(404, 'Not found');
    if (creator.userId !== locals.user.id && !locals.user.isAdmin) throw error(403, 'Not authorized');

    return {
        creator: {
            ...creator,
            contentCategories: (() => { try { return JSON.parse(creator.contentCategories ?? '[]'); } catch { return []; } })()
        }
    };
};

export const actions = {
    default: async ({ request, locals, params }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const id = Number(params.id);
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        if (!data.name) return fail(400, { message: 'Name is required' });

        let contentCategories: string[] = [];
        try { contentCategories = JSON.parse(data.contentCategories as string); } catch { contentCategories = []; }
        if (contentCategories.length === 0) return fail(400, { message: 'Please select at least one content category' });

        const platforms = ['youtube', 'tiktok', 'instagram', 'twitch', 'podcast', 'facebook', 'twitter', 'bluesky', 'website'];
        const hasPlatform = platforms.some(p => data[p]);
        if (!hasPlatform) return fail(400, { message: 'Please add at least one platform link' });

        const creator = await db.query.creators.findFirst({ where: eq(creators.id, id) });
        if (!creator) return fail(404, { message: 'Not found' });
        if (creator.userId !== locals.user.id && !locals.user.isAdmin) return fail(403, { message: 'Not authorized' });

        await db.update(creators).set({
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
            status: 'pending', // reset to pending on resubmit
            updatedAt: new Date(),
        }).where(eq(creators.id, id));

        redirect(303, `/creators/${id}?message=Resubmitted+for+review!`);
    }
};