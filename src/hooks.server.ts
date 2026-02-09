import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Grab auth data from cookies
    // These names must match exactly what you have in cookies.set()
    const userId = event.cookies.get('user_id');
    const sessionEmail = event.cookies.get('user_email');
    const rolesJson = event.cookies.get('user_roles') || '[]';
    
    let roles: string[] = [];
    try {
        roles = JSON.parse(rolesJson);
    } catch {
        roles = [];
    }

    // 2. Define the User object and attach to locals
    // We check for both email and id to ensure a valid session
    if (sessionEmail && userId) {
        event.locals.user = {
            id: Number(userId), // Convert string cookie back to number for DB queries
            email: sessionEmail,
            roles: roles,
            isAdmin: roles.includes('admin') || roles.includes('superadmin')
        };
    } else {
        event.locals.user = null;
    }

    const { pathname } = event.url;

    // 3. SECURE THE ROUTES
    const user = event.locals.user;
    const isLoginPath = pathname === '/login';
    
    // Define which paths require a logged-in session
    const isProtectedPath = 
        pathname.startsWith('/dashboard') || 
        pathname.startsWith('/users') || 
        pathname.startsWith('/admin') ||
        pathname.startsWith('/account-settings');

    // Redirect to login if trying to access protected area without a session
    if (isProtectedPath && !user) {
        throw redirect(303, '/login');
    }

    // Redirect logged-in users away from Login page
    if (isLoginPath && user) {
        // Send admins to the users list, others to the dashboard
        throw redirect(303, user.isAdmin ? '/users' : '/dashboard');
    }

    // 4. Resolve the request
    const response = await resolve(event);
    return response;
};