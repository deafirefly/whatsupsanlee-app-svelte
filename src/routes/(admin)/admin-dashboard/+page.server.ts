import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';

export const load = async ({ locals }) => {
    // Security check: only admins/superadmins should see the dashboard
    if (!locals.user) throw error(401, 'Unauthorized');

    try {
        // 1. Get all users, sorted by newest first directly in the query
        const allUsers = await db.select().from(users).orderBy(desc(users.id));

        // 2. Helper to safely check roles regardless of DB format
        const hasRole = (user: any, roleName: string) => {
            const r = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;
            return Array.isArray(r) && r.includes(roleName);
        };

        return {
            stats: {
                total: allUsers.length,
                vips: allUsers.filter(u => hasRole(u, 'vip')).length,
                admins: allUsers.filter(u => hasRole(u, 'admin') || hasRole(u, 'superadmin')).length,
            },
            // 3. Pass the first 5 sorted users
            recentUsers: allUsers.slice(0, 5)
        };
    } catch (err) {  
        console.error("Dashboard Load Error:", err)
        return {
                stats: { total: 0, vips:0, admins:0 },
                recentUsers: []
        };
    }
};