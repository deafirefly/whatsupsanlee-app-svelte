import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, error } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const load = async ({ locals }) => {
    if (!locals.user) throw error(401, 'Unauthorized');
    return { user: locals.user };
};

// src/routes/(admin)/account-settings/+page.server.ts

export const actions = {
    updateProfile: async ({ request, locals }) => {
        const formData = await request.formData();
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const userId = locals.user?.id;

        if (!userId) return fail(401, { message: "Session expired." });

        const [user] = await db.select().from(users).where(eq(users.id, userId));

        // TEMP FIX: Check for plain text OR bcrypt match
        // This allows you to log in with your current plain text password
        const isPlainTextMatch = currentPassword === user.password;
        const isBcryptMatch = !isPlainTextMatch && await bcrypt.compare(currentPassword, user.password).catch(() => false);

        if (!isPlainTextMatch && !isBcryptMatch) {
            return fail(400, { message: "Wrong current password." });
        }

        // Prepare the update
        const updateData: any = { email: formData.get('email') };

        // We hash the new password (or re-hash the old one) to secure the account
        if (newPassword && newPassword.length >= 6) {
            updateData.password = await bcrypt.hash(newPassword, 10);
        } else if (isPlainTextMatch) {
            // If they didn't change the password but it's plain text, hash it now!
            updateData.password = await bcrypt.hash(currentPassword, 10);
        }

        await db.update(users).set(updateData).where(eq(users.id, userId));

        return { success: true, message: "Account secured and updated!" };
    }
};