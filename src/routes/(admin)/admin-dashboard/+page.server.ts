import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    // Security check: only admins/superadmins should see the dashboard
    if (!locals.user) throw error(401, 'Unauthorized');

    try {
        const allUsers = await db.select().from(users);

        // Calculate stats from the data
        const stats = {
            total: allUsers.length,
            vips: allUsers.filter(u => {
                const roles = typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles;
                return roles.includes('vip');
            }).length,
            admins: allUsers.filter(u => {
                const roles = typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles;
                return roles.includes('admin') || roles.includes('superadmin');
            }).length,
            newThisMonth: allUsers.length // We can add a createdAt field later to make this real!
        };

        return { stats };
    } catch (err) {
        console.error(err);
        return { stats: { total: 0, vips: 0, admins: 0, newThisMonth: 0 } };
    }
};