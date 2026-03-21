import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const allEvents = await db.select()
        .from(events)
        .orderBy(desc(events.createdAt));

    return { allEvents };
};

export const actions = {
    approve: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing event ID' });

        await db.update(events)
            .set({ status: 'approved', updatedAt: new Date() })
            .where(eq(events.id, id));

        return { success: true };
    },

    reject: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing event ID' });

        await db.update(events)
            .set({ status: 'rejected', updatedAt: new Date() })
            .where(eq(events.id, id));

        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Missing event ID' });

        await db.delete(events).where(eq(events.id, id));

        return { success: true };
    }
};