import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        let success = false;  // Track if the DB work finished successfully

        if (!email || !password) {
            return fail(400, { message: 'Missing email or password' });
        }

        try {

            // 1. Insert user into Database
            const [newUser] = await db.insert(users).values({
                email: email,
                password: password,
                // We cast to 'any' here because Drizzle's SQLite driver 
                // sometimes struggles with JSON string mapping in TS
                roles: JSON.stringify(['member']) as any 
            }).returning();


            // 2. Set Cookies so the 'hooks' and 'locals' work immediately
            const cookieOptions = { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 * 7 };
            
            cookies.set('user_id', newUser.id.toString(), cookieOptions);
            cookies.set('user_email', newUser.email, cookieOptions);
            cookies.set('user_roles', JSON.stringify(['member']), cookieOptions);

            success = true; // DB work finished successfully

            // 3. Send them to the dashboard
            throw redirect(303, '/dashboard');

        } catch (err: any) {
            // If SvelteKit is trying to redirect, don't catch it!
            if (err.status === 303 || err.status === 302) throw err;

            if (err.message?.includes('UNIQUE')) {
                return fail(400, { message: 'Email already exists' });
            }
            return fail(500, { message: 'Database error' });
        }

        // Redirect ONLY after the try/catch is finished
        if (success) {
            throw redirect(303, '/dashboard');
        }
    }
};