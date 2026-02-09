import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Grab auth data from cookies
    const sessionEmail = event.cookies.get('user_email');
    const rolesJson = event.cookies.get('user_roles') || '[]';
    
    let roles: string[] = [];
    try {
        roles = JSON.parse(rolesJson);
    } catch {
        roles = [];
    }

    // 2. Define the User object
    const user = sessionEmail ? {
        email: sessionEmail,
        roles: roles,
        isAdmin: roles.includes('admin') || roles.includes('super-admin')
    } : null;

    // Attach to locals for use in +layout.server.ts
    event.locals.user = user;

    const { pathname } = event.url;

    // 3. SECURE THE ROUTES
    // Avoid redirecting if we are already on the login page or trying to logout
    const isLoginPath = pathname === '/login';
    const isLogoutPath = pathname === '/logout';
    
    // Protect Admin/Dashboard
    const isProtectedPath = pathname.startsWith('/dashboard') || 
                            pathname.startsWith('/users') || 
                            pathname.startsWith('/admin');

    if (isProtectedPath && !user) {
        throw redirect(303, '/login');
    }

    // Redirect logged-in users away from Login
    if (isLoginPath && user) {
        throw redirect(303, user.isAdmin ? '/users' : '/dashboard');
    }

    return await resolve(event);
};