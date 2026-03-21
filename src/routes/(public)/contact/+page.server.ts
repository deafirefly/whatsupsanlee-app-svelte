import { db } from '$lib/server/db';
import { contactMessages } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const name = (formData.get('name') as string)?.trim();
        const email = (formData.get('email') as string)?.trim();
        const message = (formData.get('message') as string)?.trim();

        if (!name) return fail(400, { message: 'Name is required' });
        if (!email) return fail(400, { message: 'Email is required' });
        if (!message) return fail(400, { message: 'Message is required' });

        try {
            await db.insert(contactMessages).values({
                name,
                email,
                message,
                status: 'unread',
                createdAt: new Date()
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Could not send message. Please try again.' });
        }

        return { success: true };
    }
};