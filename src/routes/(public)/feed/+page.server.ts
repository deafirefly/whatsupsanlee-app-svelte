import { db } from '$lib/server/db';
import { posts, users, profiles, postLikes, postComments, postReports, areas, yardSales } from '$lib/server/db/schema';
import { eq, desc, and, count, gte } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
    const areaFilter = url.searchParams.get('area');

    // Load yard sales ONCE outside the loop
    const today = new Date().toISOString().split('T')[0];
    const feedYardSales = await db.select()
        .from(yardSales)
        .where(and(eq(yardSales.status, 'approved'), gte(yardSales.saleDate, today)))
        .orderBy(yardSales.createdAt)
        .limit(5);

    const parsedYardSales = feedYardSales.map(s => ({
        ...s,
        items: (() => { try { return JSON.parse(s.items); } catch { return []; } })()
    }));

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

    const postsWithCounts = await Promise.all(allPosts.map(async post => {
        const [likeCount] = await db.select({ count: count() })
            .from(postLikes)
            .where(eq(postLikes.postId, post.id));

        const [commentCount] = await db.select({ count: count() })
            .from(postComments)
            .where(eq(postComments.postId, post.id));

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
        currentUserId: locals.user?.id ?? null,
        yardSales: parsedYardSales  // ← top level, not per-post
    };
};

// ... actions stay exactly the same