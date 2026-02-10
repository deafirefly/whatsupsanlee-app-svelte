import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // 1. Check if the user is logged in
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // 2. Fix: Check the 'roles' ARRAY (matching your hook)
    const roles = locals.user.roles || [];
    const isVip = roles.includes('vip') || 
                  roles.includes('admin') || 
                  roles.includes('superadmin');

    if (!isVip) {
        throw redirect(303, '/subscribe'); 
    }

    // 3. Success!
    return {
        secretContent: "Welcome to the Golden Circle. Here is your exclusive insight for February 2026."
    };
};