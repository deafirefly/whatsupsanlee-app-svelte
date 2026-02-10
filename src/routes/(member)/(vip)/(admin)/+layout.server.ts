import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // We don't need to check for 'vip' here because the folder 
    // above this one already did! We only care about Admin/Super.
    const roles = locals.user?.roles || [];
    const isAdmin = roles.includes('admin') || roles.includes('superadmin');

    if (!isAdmin) {
        throw error(403, "This area requires Administrative clearance.");
    }

    return {};
};