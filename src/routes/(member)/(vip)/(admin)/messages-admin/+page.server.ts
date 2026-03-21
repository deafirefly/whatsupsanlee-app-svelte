import { db } from '$lib/server/db';
import { contactMessages } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const allMessages = await db.select()
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt));

    return { allMessages };
};

export const actions = {
    markRead: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });

        await db.update(contactMessages)
            .set({ status: 'read' })
            .where(eq(contactMessages.id, id));

        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing ID' });

        await db.delete(contactMessages)
            .where(eq(contactMessages.id, id));

        return { success: true };
    }
};