import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit'; // Added 'fail' here
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';
import bcrypt from 'bcryptjs';

export const load = async ({ locals }) => {
    // 1. Security check
    if (!locals.user?.roles.includes('admin') && !locals.user?.roles.includes('superadmin')) {
        throw error(403, 'Unauthorized');
    }

    // 2. Fetch all users
    const allUsers = await db.select().from(users);

    // 3. Return data (including currentUser so the UI can protect your account)
    return {
        currentUser: locals.user, // Important for the UI shield!
        userList: allUsers.map(u => ({
            ...u,
            roles: (() => {
                try {
                    return typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles;
                } catch {
                    return ['member'];
                }
            })()
        }))
    };
};

export const actions: Actions = {
    toggleVip: async ({ request, locals }) => {
        // 1. SECURITY CHECK (Looks good!)
        const isAuthorized = locals.user?.roles.includes('admin') || locals.user?.roles.includes('superadmin');
        if (!isAuthorized) {
            return { success: false, message: "Unauthorized" };
        }

        const formData = await request.formData();
        const id = Number(formData.get('id'));

        // 2. FETCH USER
        const user = await db.query.users.findFirst({
            where: eq(users.id, id)
        });

        if (!user) return { success: false, message: "User not found" };

        // 3. PARSE ROLES SAFELY
        // We handle strings, actual arrays (if Drizzle handles it), or nulls
        let roles: string[] = [];
        try {
            if (Array.isArray(user.roles)) {
                roles = user.roles;
            } else if (typeof user.roles === 'string') {
                roles = JSON.parse(user.roles);
            }
        } catch (e) {
            roles = ['member']; // Fallback if data is corrupted
        }

        // 4. THE TOGGLE (Clean & Simple)
        if (roles.includes('vip')) {
            roles = roles.filter(r => r !== 'vip');
        } else {
            roles = [...roles, 'vip']; // Use spread for a new array reference
        }

        // 5. UPDATE DB
        // Only stringify if your DB column is TEXT/VARCHAR. 
        // If it's a JSON column, Drizzle usually wants the object directly.
        await db.update(users)
            .set({ 
                roles: JSON.stringify(roles)  as any
            })
            .where(eq(users.id, id));

        return { success: true };
    },

    toggleAdmin: async ({ request, locals }) => {
    // Only superadmin can make/revoke admins
    if (!locals.user?.roles.includes('superadmin')) {
        return fail(403, { message: 'Only superadmin can manage admin roles.' });
    }

    const formData = await request.formData();
    const id = Number(formData.get('id'));

    const user = await db.query.users.findFirst({
        where: eq(users.id, id)
    });

    if (!user) return fail(404, { message: 'User not found' });

    let roles: string[] = [];
    try {
        if (Array.isArray(user.roles)) {
            roles = user.roles;
        } else if (typeof user.roles === 'string') {
            roles = JSON.parse(user.roles);
        }
    } catch (e) {
        roles = ['member'];
    }

    // Toggle admin role
    if (roles.includes('admin')) {
        roles = roles.filter(r => r !== 'admin');
    } else {
        roles = [...roles, 'admin'];
    }

    await db.update(users)
        .set({ roles: JSON.stringify(roles) as any })
        .where(eq(users.id, id));

    return { success: true };
},

    deleteUser: async ({ request, locals }) => {
        const formData = await request.formData();
        const idToDelete = Number(formData.get('id'));

        // 1. Identity Check
        if (!locals.user) return fail(401, { message: "Unauthorized" });

        // 2. Fetch the target user to check THEIR roles
        const [targetUser] = await db.select().from(users).where(eq(users.id, idToDelete));

        if (!targetUser) return fail(404, { message: "User not found" });

        const targetRoles: string[] = Array.isArray(targetUser.roles) 
            ? targetUser.roles 
            : JSON.parse(targetUser.roles as unknown as string); 

        const currentUserRoles = locals.user.roles;

        // 3. THE HIERARCHY RULES:
        // Rule A: Nobody deletes themselves
        if (idToDelete === locals.user.id) {
            return fail(400, { message: "You cannot delete yourself!" });
        }

        // Rule B: Admins cannot delete Super Admins
        if (targetRoles.includes('superadmin') && !currentUserRoles.includes('superadmin')) {
            return fail(403, { message: "Only a Super Admin can remove another Super Admin." });
        }

        // Rule C: Admins cannot delete other Admins
        if (targetRoles.includes('admin') && !currentUserRoles.includes('superadmin')) {
            return fail(403, { message: "Admins cannot delete other admins." });
        }

        // If we passed the gauntlet, delete them!
        await db.delete(users).where(eq(users.id, idToDelete));
        return { success: true };
    },

    createUser: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const rolesRaw = formData.get('roles') as string;

        if (!email || !password) {
            return fail(400, { message: 'Email and password are required' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // 1. Get the raw string from the form (e.g., '["member", "admin"]')
            const rolesRaw = formData.get('roles') as string;

            // 2. Drizzle + SQLite quirk: 
            // If your schema mode is 'json', you might actually need to pass the string 
            // OR ensure the object is properly handled. 
            // Let's force it to be a clean string for the 'text' column in SQLite.
            const finalRoles = JSON.stringify(JSON.parse(rolesRaw));

            await db.insert(users).values({
                email,
                password: hashedPassword,
                roles: finalRoles // Sending it as a stringified JSON array
            });

            return { success: true };
        } catch (err) {
            // Log the real error to your terminal so you can see it!
            console.error("DATABASE ERROR:", err); 
            return fail(500, { message: 'Could not create user. Check if email is unique.' });
        }
    },

    setVipExpiry: async ({ request, locals }) => {
    if (!locals.user?.isAdmin) return fail(403, { message: 'Unauthorized' });

    const formData = await request.formData();
    const id = Number(formData.get('id'));
    const expiryDate = formData.get('expiryDate') as string;

    if (!id) return fail(400, { message: 'Missing user ID' });

    const expiresAt = expiryDate ? new Date(expiryDate) : null;

    // Also make sure they have VIP role
    const user = await db.query.users.findFirst({
        where: eq(users.id, id)
    });

    if (!user) return fail(404, { message: 'User not found' });

    let roles: string[] = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;
    if (!roles.includes('vip')) {
        roles = [...roles, 'vip'];
    }

    await db.update(users)
        .set({
            roles: JSON.stringify(roles) as any,
            vipExpiresAt: expiresAt
        })
        .where(eq(users.id, id));

    return { success: true };
},

};