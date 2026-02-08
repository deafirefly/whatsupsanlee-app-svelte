import { error, redirect } from '@sveltejs/kit'; // Add redirect here
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
    // 1. If they aren't logged in at all, redirect to login (Better UX)
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // 2. If they ARE logged in but aren't an admin, show the 403 error
    const roles = locals.user.roles || [];
    const isAdmin = roles.includes('admin') || roles.includes('super-admin');

    if (!isAdmin) {
        throw error(403, 'Forbidden: Admins only');
    }

    return {
        user: locals.user
    };
};