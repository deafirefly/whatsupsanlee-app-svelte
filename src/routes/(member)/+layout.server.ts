import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './(vip)/$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // If hooks.server.ts didn't find a user, kick to login
    if (!locals.user) {
        throw redirect(303, '/login');
    }
    // Return user so all children (VIP/Admin) can use it
    return { user: locals.user };
};