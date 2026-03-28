import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const user = await db.query.users.findFirst({
        where: eq(users.id, locals.user.id)
    });

    return {
        vipExpiresAt: user?.vipExpiresAt ?? null,
    };
};