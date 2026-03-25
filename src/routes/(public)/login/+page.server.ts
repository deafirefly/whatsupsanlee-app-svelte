import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import createLog from '$lib/server/logger';
import bcrypt from 'bcryptjs';

export const actions = {
    default: async ({ request, cookies, getClientAddress }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const ip = getClientAddress();

        if (!email || !password) {
            return fail(400, { message: 'Email and password are required.' });
        }

        // 1. Find user in DB
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            return fail(400, { message: 'Invalid email or password.' });
        }

        // 2. Check password with bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return fail(400, { message: 'Invalid email or password.' });
        }

        // 3. Parse roles
        const rolesArray = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;

        // 4. Set Cookies
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            sameSite: 'lax' as const,
            secure: true,
            maxAge: 60 * 60 * 24 * 7
        };

        cookies.set('user_id', user.id.toString(), cookieOptions);
        cookies.set('user_roles', JSON.stringify(rolesArray), cookieOptions);
        cookies.set('user_email', user.email, cookieOptions);

        // 5. Log the login
        try {
            await createLog('AUTH_LOGIN', {
                user: email,
                ipAddress: ip,
                details: 'User logged in successfully'
            });
        } catch (err) {
            console.error("Logger failed, but continuing login:", err);
        }

        // 6. Redirect based on role
        const isAdmin = rolesArray.includes('admin') || rolesArray.includes('superadmin');
        throw redirect(303, isAdmin ? '/admin-dashboard' : '/dashboard');
    }
};