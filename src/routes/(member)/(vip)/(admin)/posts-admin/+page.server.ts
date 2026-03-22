import { db } from '$lib/server/db';
import { posts, users, profiles, postReports } from '$lib/server/db/schema';
import { eq, desc, count } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    // Load all posts with author info
    const allPosts = await db.select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        linkUrl: posts.linkUrl,
        linkTitle: posts.linkTitle,
        status: posts.status,
        isPinned: posts.isPinned,
        createdAt: posts.createdAt,
        userId: posts.userId,
        authorEmail: users.email,
        authorName: profiles.displayName,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(profiles, eq(posts.userId, profiles.userId))
    .orderBy(desc(posts.createdAt));

    // Get report counts per post
    const postsWithReports = await Promise.all(allPosts.map(async post => {
        const [reportCount] = await db.select({ count: count() })
            .from(postReports)
            .where(eq(postReports.postId, post.id));

        return {
            ...post,
            reportCount: reportCount.count
        };
    }));

    return { posts: postsWithReports };
};

export const actions = {
    removePost: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing post ID' });

        await db.update(posts)
            .set({ status: 'removed' })
            .where(eq(posts.id, id));

        return { success: true };
    },

    restorePost: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing post ID' });

        await db.update(posts)
            .set({ status: 'published' })
            .where(eq(posts.id, id));

        return { success: true };
    },

    deletePost: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing post ID' });

        await db.delete(posts).where(eq(posts.id, id));

        return { success: true };
    },

    pinPost: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const isPinned = formData.get('isPinned') === 'true';
        if (!id) return fail(400, { message: 'Missing post ID' });

        await db.update(posts)
            .set({ isPinned: !isPinned })
            .where(eq(posts.id, id));

        return { success: true };
    }
};