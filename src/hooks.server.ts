import { redirect, type Handle } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { systemMeta, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
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
        // Check VIP expiration
        if (roles.includes('vip')) {
            try {
                const user = await db.query.users.findFirst({
                    where: eq(users.id, Number(userId))
                });

                if (user?.vipExpiresAt) {
                    const now = new Date();
                    const expiresAt = new Date(user.vipExpiresAt);

                    if (expiresAt < now) {
                        // VIP expired — remove VIP role
                        roles = roles.filter(r => r !== 'vip');

                        // Update DB
                        await db.update(users)
                            .set({ roles: JSON.stringify(roles) as any })
                            .where(eq(users.id, Number(userId)));

                        // Update cookie
                        event.cookies.set('user_roles', JSON.stringify(roles), {
                            path: '/',
                            httpOnly: true,
                            sameSite: 'lax',
                            secure: true,
                            maxAge: 60 * 60 * 24 * 7
                        });

                        console.log(`VIP expired for user ${userId} — downgraded to member`);
                    }
                }
            } catch (err) {
                console.error('VIP expiry check failed:', err);
            }
        }

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

    // Maintenance mode check
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
            if (err?.status === 303) throw err;
        }
    }

    if (pathname === '/logout') {
        return await resolve(event);
    }

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