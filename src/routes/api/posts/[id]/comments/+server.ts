import { db } from '$lib/server/db';
import { postComments, users, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
    const postId = Number(params.id);

    const comments = await db.select({
        id: postComments.id,
        content: postComments.content,
        createdAt: postComments.createdAt,
        authorEmail: users.email,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
    })
    .from(postComments)
    .innerJoin(users, eq(postComments.userId, users.id))
    .leftJoin(profiles, eq(postComments.userId, profiles.userId))
    .where(eq(postComments.postId, postId))
    .orderBy(postComments.createdAt);

    return json(comments);
};