import { db } from '$lib/server/db';
import { posts, users, profiles, postLikes, postComments, areas } from '$lib/server/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
    const areaFilter = url.searchParams.get('area');

    // Load all published posts with author info
    const allPosts = await db.select({
    id: posts.id,
    content: posts.content,
    imageUrl: posts.imageUrl,
    linkUrl: posts.linkUrl,
    linkTitle: posts.linkTitle,
    isPinned: posts.isPinned,
    isVipOnly: posts.isVipOnly,
    createdAt: posts.createdAt,
    areaId: posts.areaId,
    userId: posts.userId,
    // Author info
    authorEmail: users.email,
    authorName: profiles.displayName,
    authorAvatar: profiles.avatarUrl,
    authorRoles: users.roles,
})
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id))
    .leftJoin(profiles, eq(posts.userId, profiles.userId))
    .where(
        areaFilter
            ? and(eq(posts.status, 'published'), eq(posts.areaId, Number(areaFilter)))
            : eq(posts.status, 'published')
    )
    .orderBy(desc(posts.isPinned), desc(posts.createdAt));

    // Get like counts and comment counts for each post
    const postsWithCounts = await Promise.all(allPosts.map(async post => {
        const [likeCount] = await db.select({ count: count() })
            .from(postLikes)
            .where(eq(postLikes.postId, post.id));

        const [commentCount] = await db.select({ count: count() })
            .from(postComments)
            .where(eq(postComments.postId, post.id));

        // Check if current user liked this post
        let userLiked = false;
        if (locals.user) {
            const existing = await db.query.postLikes.findFirst({
                where: and(
                    eq(postLikes.postId, post.id),
                    eq(postLikes.userId, locals.user.id)
                )
            });
            userLiked = !!existing;
        }

        return {
            ...post,
            likeCount: likeCount.count,
            commentCount: commentCount.count,
            userLiked
        };
    }));

    // Load areas for filter
    const allAreas = await db.select().from(areas).orderBy(areas.name);

    const currentUserRoles = typeof locals.user?.roles === 'string' 
    ? JSON.parse(locals.user.roles) 
    : locals.user?.roles ?? [];

const isVip = currentUserRoles.includes('vip') || 
              currentUserRoles.includes('admin') || 
              currentUserRoles.includes('superadmin');

return {
    posts: postsWithCounts,
    allAreas,
    areaFilter,
    isLoggedIn: !!locals.user,
    isVip,
    currentUserId: locals.user?.id ?? null
};

};

export const actions = {
    like: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Must be logged in to like posts' });

        const formData = await request.formData();
        const postId = Number(formData.get('postId'));

        const existing = await db.query.postLikes.findFirst({
            where: and(
                eq(postLikes.postId, postId),
                eq(postLikes.userId, locals.user.id)
            )
        });

        if (existing) {
            await db.delete(postLikes)
                .where(and(
                    eq(postLikes.postId, postId),
                    eq(postLikes.userId, locals.user.id)
                ));
        } else {
            await db.insert(postLikes).values({
                postId,
                userId: locals.user.id
            });
        }

        return { success: true };
    },

    comment: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Must be logged in to comment' });

        const formData = await request.formData();
        const postId = Number(formData.get('postId'));
        const content = (formData.get('content') as string)?.trim();

        if (!content) return fail(400, { message: 'Comment cannot be empty' });

        await db.insert(postComments).values({
            postId,
            userId: locals.user.id,
            content
        });

        return { success: true };
    },

    report: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Must be logged in to report' });

        const formData = await request.formData();
        const postId = Number(formData.get('postId'));
        const reason = (formData.get('reason') as string)?.trim();

        if (!reason) return fail(400, { message: 'Please provide a reason' });

        await db.insert(postReports).values({
            postId,
            userId: locals.user.id,
            reason
        });

        return { success: true };
    },

    deletePost: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const postId = Number(formData.get('postId'));

        const post = await db.query.posts.findFirst({
            where: eq(posts.id, postId)
        });

        if (!post) return fail(404, { message: 'Post not found' });

        // Only post owner or admin can delete
        const isAdmin = locals.user.roles?.includes('admin') || locals.user.roles?.includes('superadmin');
        if (post.userId !== locals.user.id && !isAdmin) {
            return fail(403, { message: 'Not authorized to delete this post' });
        }

        await db.delete(posts).where(eq(posts.id, postId));

        return { success: true };
    }
};