import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import bcrypt from 'bcryptjs';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!email || !password) {
            return fail(400, { message: 'Email and password are required' });
        }

        if (password.length < 6) {
            return fail(400, { message: 'Password must be at least 6 characters' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const [newUser] = await db.insert(users).values({
                email,
                password: hashedPassword,
                roles: JSON.stringify(['member']) as any
            }).returning();

            // Match cookie options from login
            const cookieOptions = {
                path: '/',
                httpOnly: true,
                sameSite: 'lax' as const,
                secure: false, // TODO: change to true before deploying to production
                maxAge: 60 * 60 * 24 * 7
            };

            cookies.set('user_id', newUser.id.toString(), cookieOptions);
            cookies.set('user_email', newUser.email, cookieOptions);
            cookies.set('user_roles', JSON.stringify(['member']), cookieOptions);

        } catch (err: any) {
            if (err.status === 303 || err.status === 302) throw err;
            if (err.message?.includes('UNIQUE')) {
                return fail(400, { message: 'An account with this email already exists.' });
            }
            return fail(500, { message: 'Something went wrong. Please try again.' });
        }

        redirect(303, '/dashboard?message=Welcome+to+WhatsUp+SanLee!');
    }
};