import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Get user data from cookies
	// We parse the JSON array. If it doesn't exist, they are a ["visitor"]
	const rolesJson = event.cookies.get('user_roles') || '["visitor"]';
	const email = event.cookies.get('user_email') || '';
    // ADD THIS: Get the ID from the cookie
    const id = Number(event.cookies.get('user_id')) || 0;

	let roles: string[];
	
	try {
		roles = JSON.parse(rolesJson);
	} catch {
		roles = ['visitor'];
	}

	// 2. Set the 'locals' object
	event.locals.user = {
		id: id,
		email: email,
		roles: roles
	};

	const { pathname } = event.url;

	// Helper flags for cleaner logic
	const isVisitor = roles.includes('visitor');
	const isAdmin = roles.includes('admin') || roles.includes('super-admin');

	// 3. DEFINE ACCESS RULES

	// Rule A: Protect Admin area
	const adminPaths = ['/users', '/settings'];
	const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

	if (isAdminPath && !isAdmin) {
		throw redirect(303, '/login');
	}

	// Rule B: Protect Member area (Dashboard)
	if (pathname.startsWith('/dashboard') && isVisitor) {
		throw redirect(303, '/login');
	}

	// Rule C: Redirect logged-in users away from Login/Register
	if (pathname === '/login' && !isVisitor) {
		if (isAdmin) {
			throw redirect(303, '/users');
		} else {
			throw redirect(303, '/dashboard');
		}
	}

	// 4. Proceed with the request
	return await resolve(event);
};