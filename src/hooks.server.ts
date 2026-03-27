import { redirect, type Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { systemMeta } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
    // 1. Grab auth data from cookies
    const userId = event.cookies.get('user_id');
    const sessionEmail = event.cookies.get('user_email');
    const rolesJson = event.cookies.get('user_roles') || '[]';
    
    let roles: string[] = [];
    try {
        roles = JSON.parse(rolesJson);
    } catch {
        roles = [];
    }

    if (sessionEmail && userId) {
        event.locals.user = {
            id: Number(userId),
            email: sessionEmail,
            roles: roles,
            isAdmin: roles.includes('admin') || roles.includes('superadmin')
        };
    } else {
        event.locals.user = null;
    }

    const { pathname } = event.url;

    // 2. Check maintenance mode (skip for admins, login, and maintenance page itself)
    const isAdmin = roles.includes('admin') || roles.includes('superadmin');
    const isMaintenancePage = pathname === '/maintenance';
    const isLoginPage = pathname === '/login';
    const isLogoutPage = pathname === '/logout';

    if (!isAdmin && !isMaintenancePage && !isLoginPage && !isLogoutPage) {
        try {
            const maintenanceSetting = await db.query.systemMeta.findFirst({
                where: eq(systemMeta.key, 'maintenance_mode')
            });
            if (maintenanceSetting?.value === 'true') {
                throw redirect(303, '/maintenance');
            }
        } catch (err: any) {
            // If it's a redirect let it through
            if (err?.status === 303) throw err;
            // Otherwise ignore DB errors so site doesn't break
        }
    }

    if (pathname === '/logout') {
        return await resolve(event);
    }

    // 3. SECURE THE ROUTES
    const user = event.locals.user;
    const isProtectedPath = 
        pathname.startsWith('/dashboard') || 
        pathname.startsWith('/users') || 
        pathname.startsWith('/admin') ||
        pathname.startsWith('/account-settings');

    if (isProtectedPath && !user) {
        throw redirect(303, '/login');
    }

    if (isLoginPage && user) {
        throw redirect(303, user.isAdmin ? '/admin-dashboard' : '/dashboard');
    }

    const response = await resolve(event);
    return response;
};