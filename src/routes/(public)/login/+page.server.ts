import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
//import { createLog } from '$lib/server/logger';
import createLog from '$lib/server/logger';

// src/routes/(public)/login/+page.server.ts

export const actions = {
    default: async ({ request, cookies, getClientAddress }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const ip = getClientAddress();

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
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            sameSite: 'lax' as const,
            secure: false, // false for local dev over http
            maxAge: 60 * 60 * 24 * 7 // 7 days
        };

        cookies.set('user_id', user.id.toString(), cookieOptions);
        cookies.set('user_roles', JSON.stringify(rolesArray), cookieOptions);
        cookies.set('user_email', user.email, cookieOptions);

        console.log("Saving log to DB...");
        // After successful login:
        try { 
            await createLog('AUTH_LOGIN', { 
                user: email, 
                ipAddress: ip,
                details: 'User logged in successfully' 
            });

            await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay for demo

            console.log("Database write confirmed. ");
        } catch (err) {
            console.error("Logger failed, but continuing login:", err);
        }
        console.log("Log saved! Now redirecting...  ");

        // 4. Check for Admin access to decide where to send them
        const isAdmin = rolesArray.includes('admin') || rolesArray.includes('superadmin');
        const target = isAdmin ? '/admin-dashboard' : '/dashboard'; 

        throw redirect(303, target);
    }
};