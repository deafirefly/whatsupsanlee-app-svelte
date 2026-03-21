import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ cookies }) => {
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            sameSite: 'lax' as const,
            secure: false // match what was set in login
        };

        cookies.delete('user_email', cookieOptions);
        cookies.delete('user_roles', cookieOptions);
        cookies.delete('user_id', cookieOptions);

        throw redirect(303, '/login');
    }
};

export const load = () => {
    throw redirect(303, '/login');
};