import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ cookies }) => {
        // Delete all auth cookies
        cookies.delete('user_email', { path: '/' });
        cookies.delete('user_roles', { path: '/' });
        cookies.delete('user_id', { path: '/' });
        
        throw redirect(303, '/login');
    }
};

export const load = () => {
    // If they just visit /logout, send them home or to login
    throw redirect(303, '/login');
};