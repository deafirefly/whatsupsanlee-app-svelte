import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    // 1. Check if the user is logged in
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    // 2. Check if they have the VIP (or Admin) role
    const isVip = locals.user.role === 'vip' || locals.user.role === 'admin' || locals.user.role === 'super-admin';

    if (!isVip) {
        // We throw a 403 Forbidden or redirect to a "Upgrade" page
        throw redirect(303, '/subscribe'); 
    }

    // 3. If they are VIP, return the "Secret" data
    return {
        secretContent: "Welcome to the Golden Circle. Here is your exclusive insight for February 2026."
    };
};