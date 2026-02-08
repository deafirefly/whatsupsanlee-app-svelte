import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit'; // Added 'fail' here
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export const load = async ({ locals }) => {
    // 1. Security check
    if (!locals.user?.roles.includes('admin') && !locals.user?.roles.includes('super-admin')) {
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
    toggleVip: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));

        const user = await db.query.users.findFirst({
            where: eq(users.id, id)
        });

        if (!user) return { success: false };

        let roles: string[] = typeof user.roles === 'string' 
            ? JSON.parse(user.roles) 
            : user.roles;

        if (roles.includes('vip')) {
            roles = roles.filter(r => r !== 'vip');
        } else {
            roles.push('vip');
        }

        await db.update(users)
            .set({ 
                roles: JSON.stringify(roles) as any 
            })
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
        if (targetRoles.includes('super-admin') && !currentUserRoles.includes('super-admin')) {
            return fail(403, { message: "Only a Super Admin can remove another Super Admin." });
        }

        // Rule C: Admins cannot delete other Admins
        if (targetRoles.includes('admin') && !currentUserRoles.includes('super-admin')) {
            return fail(403, { message: "Admins cannot delete other admins." });
        }

        // If we passed the gauntlet, delete them!
        await db.delete(users).where(eq(users.id, idToDelete));
        return { success: true };
    }
};