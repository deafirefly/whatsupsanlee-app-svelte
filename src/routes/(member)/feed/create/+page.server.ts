import { db } from '$lib/server/db';
import { posts, areas, communities } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const allAreas = await db.select().from(areas).orderBy(areas.name);
    const allCommunities = await db.select().from(communities).orderBy(communities.name);

    return { allAreas, allCommunities };
};

export const actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const content = (formData.get('content') as string)?.trim();
        const imageUrl = (formData.get('imageUrl') as string) || null;
        const linkUrl = (formData.get('linkUrl') as string) || null;
        const linkTitle = (formData.get('linkTitle') as string) || null;
        const areaId = formData.get('areaId') ? Number(formData.get('areaId')) : null;
        const communityId = formData.get('communityId') ? Number(formData.get('communityId')) : null;

        if (!content && !imageUrl && !linkUrl) {
            return fail(400, { message: 'Post must have some content, image, or link' });
        }

        try {
            await db.insert(posts).values({
                userId: locals.user.id,
                content: content || null,
                imageUrl,
                linkUrl,
                linkTitle,
                areaId,
                communityId,
                status: 'published',
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Could not create post. Please try again.' });
        }

        redirect(303, '/feed');
    }
};