import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ cookies }) => {
        // Clear the cookies that identify the user
        const options = { path: '/' };
        
        cookies.delete('user_id', options);
        cookies.delete('user_email', options);
        
        // Reset roles to visitor
        cookies.set('user_roles', '["visitor"]', options);

        // Send them back to the login page
        throw redirect(303, '/login');
    }
};