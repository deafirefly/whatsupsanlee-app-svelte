import { db } from '$lib/server/db';
import { profiles, areas, communities } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';
import { UTApi } from 'uploadthing/server';
import { UPLOADTHING_TOKEN } from '$env/static/private';

const utapi = new UTApi({ token: UPLOADTHING_TOKEN });

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    // Load existing profile if any
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, locals.user.id)
    });

    // Load all areas
    const allAreas = await db.select().from(areas).orderBy(areas.name);

    // Load all communities
    const allCommunities = await db.select().from(communities).orderBy(communities.name);

    return { profile, allAreas, allCommunities, user: locals.user };
};

export const actions = {
    saveProfile: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();

        const data = {
            userId: locals.user.id,
            displayName: (formData.get('displayName') as string) || null,
            bio: (formData.get('bio') as string) || null,
            areaId: formData.get('areaId') ? Number(formData.get('areaId')) : null,
            communityId: formData.get('communityId') ? Number(formData.get('communityId')) : null,
            instagram: (formData.get('instagram') as string) || null,
            facebook: (formData.get('facebook') as string) || null,
            twitter: (formData.get('twitter') as string) || null,
            tiktok: (formData.get('tiktok') as string) || null,
            website: (formData.get('website') as string) || null,
            visibility: (formData.get('visibility') as string) || 'public',
            avatarUrl: (formData.get('avatarUrl') as string) || null,
            updatedAt: new Date()
        };

        try {
            // Upsert — insert if no profile, update if exists
            const existing = await db.query.profiles.findFirst({
                where: eq(profiles.userId, locals.user.id)
            });

            if (existing) {
                await db.update(profiles)
                    .set(data)
                    .where(eq(profiles.userId, locals.user.id));
            } else {
                await db.insert(profiles).values({
                    ...data,
                    createdAt: new Date()
                });
            }
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Could not save profile.' });
        }

        redirect(303, '/profile?message=Profile+saved+successfully!');
    },

    deleteAvatar: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const avatarUrl = formData.get('avatarUrl') as string;

        if (avatarUrl) {
            const fileKey = avatarUrl.split('/').pop();
            if (fileKey) {
                try {
                    await utapi.deleteFiles(fileKey);
                } catch (err) {
                    console.error('Failed to delete avatar from UploadThing:', err);
                }
            }
        }

        try {
            await db.update(profiles)
                .set({ avatarUrl: null, updatedAt: new Date() })
                .where(eq(profiles.userId, locals.user.id));
        } catch (err) {
            return fail(500, { message: 'Failed to remove avatar.' });
        }

        return { success: true };
    }
};