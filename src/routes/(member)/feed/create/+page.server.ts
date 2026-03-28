import { db } from '$lib/server/db';
import { posts, areas, communities, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const allAreas = await db.select().from(areas).orderBy(areas.name);
    const allCommunities = await db.select().from(communities).orderBy(communities.name);

    // Check if user is VIP
    const user = await db.query.users.findFirst({
        where: eq(users.id, locals.user.id)
    });

    const roles = typeof user?.roles === 'string' ? JSON.parse(user.roles) : user?.roles ?? [];
    const isVip = roles.includes('vip') || roles.includes('admin') || roles.includes('superadmin');

    // Check VIP expiry
    const isVipActive = isVip && (
        !user?.vipExpiresAt || new Date(user.vipExpiresAt) > new Date()
    );

    return { allAreas, allCommunities, isVip: isVipActive };
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
        const isVipOnly = formData.get('isVipOnly') === 'on';

        if (!content && !imageUrl && !linkUrl) {
            return fail(400, { message: 'Post must have some content, image, or link' });
        }

        // Verify VIP status if trying to post VIP-only
        if (isVipOnly) {
            const user = await db.query.users.findFirst({
                where: eq(users.id, locals.user.id)
            });
            const roles = typeof user?.roles === 'string' ? JSON.parse(user.roles) : user?.roles ?? [];
            const isVip = roles.includes('vip') || roles.includes('admin') || roles.includes('superadmin');
            if (!isVip) {
                return fail(403, { message: 'Only VIP members can post VIP-only content.' });
            }
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
                isVipOnly,
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