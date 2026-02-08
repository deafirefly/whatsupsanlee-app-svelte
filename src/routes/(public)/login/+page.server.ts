import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// src/routes/(public)/login/+page.server.ts

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        // 1. Find user in DB
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) {
            return fail(400, { message: 'User not found.' });
        }

        // 2. Parse the roles from the DB (Stored as JSON string like '["admin"]')
        // Drizzle might return it as a string or an object depending on your setup
        const rolesArray = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;
        
        // 3. Set Cookies (Plural!)
        // We stringify the array so 'hooks.server.ts' can parse it later
        cookies.set('user_id', user.id.toString(), { path: '/' });
        cookies.set('user_roles', JSON.stringify(rolesArray), { path: '/', httpOnly: true });
        cookies.set('user_email', user.email, { path: '/', httpOnly: true });

        // 4. Check for Admin access to decide where to send them
        const isAdmin = rolesArray.includes('admin') || rolesArray.includes('super-admin');

        if (isAdmin) {
            throw redirect(303, '/users');
        }
        
        throw redirect(303, '/dashboard');
    }
};