import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, error, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const load = async ({ locals }) => {
    if (!locals.user) throw error(401, 'Unauthorized');
    return { user: locals.user };
};

export const actions = {
    updateProfile: async ({ request, locals }) => {
        const formData = await request.formData();
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const email = formData.get('email') as string;
        const userId = locals.user?.id;

        if (!userId) return fail(401, { message: 'Session expired.' });

        const [user] = await db.select().from(users).where(eq(users.id, userId));

        if (!user) return fail(404, { message: 'User not found.' });

        const isPlainTextMatch = currentPassword === user.password;
        const isBcryptMatch = !isPlainTextMatch && await bcrypt.compare(currentPassword, user.password).catch(() => false);

        if (!isPlainTextMatch && !isBcryptMatch) {
            return fail(400, { action: 'updateProfile', message: 'Wrong current password.' });
        }

        const updateData: any = { email };

        if (newPassword && newPassword.length >= 6) {
            updateData.password = await bcrypt.hash(newPassword, 10);
        } else if (isPlainTextMatch) {
            updateData.password = await bcrypt.hash(currentPassword, 10);
        }

        await db.update(users).set(updateData).where(eq(users.id, userId));

        return { success: true, action: 'updateProfile', message: 'Account updated successfully!' };
    },

    deleteAccount: async ({ request, locals, cookies }) => {
        const formData = await request.formData();
        const confirmation = formData.get('confirmation') as string;
        const userId = locals.user?.id;

        if (!userId) return fail(401, { message: 'Session expired.' });

        if (locals.user?.roles?.includes('superadmin')) {
            return fail(403, { action: 'deleteAccount', message: 'Superadmin account cannot be deleted.' });
        }

        if (confirmation !== 'DELETE') {
            return fail(400, { action: 'deleteAccount', message: 'Please type DELETE to confirm.' });
        }

        try {
            await db.delete(users).where(eq(users.id, userId));

            const cookieOptions = {
                path: '/',
                httpOnly: true,
                sameSite: 'lax' as const,
                secure: false // TODO: change to true before deploying to production
            };
            cookies.delete('user_id', cookieOptions);
            cookies.delete('user_email', cookieOptions);
            cookies.delete('user_roles', cookieOptions);
        } catch (err) {
            return fail(500, { action: 'deleteAccount', message: 'Could not delete account.' });
        }

        redirect(303, '/?message=Account+deleted+successfully');
    }
};