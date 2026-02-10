// src/routes/(member)/(vip)/+layout.server.ts
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const user = locals.user;

    // Check if the user has any of the "Elevated" roles
    // Remember: we include admins here because they should see everything a VIP sees!
    const isVip = user?.roles.includes('vip') || 
                  user?.roles.includes('admin') || 
                  user?.roles.includes('superadmin');

    if (!isVip) {
        // This stops the request and shows the error page
        throw error(403, 'This area is reserved for VIP members.');
    }

    // Optional: Return extra VIP-specific data here
    return {
        vipStatus: "Active"
    };
};