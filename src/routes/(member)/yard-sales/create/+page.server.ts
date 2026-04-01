import { db } from '$lib/server/db';
import { yardSales } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        const userId = locals.user?.id;
        if (!userId) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        // Validation
        if (!data.title) return fail(400, { message: 'Title is required' });
        if (!data.contactName) return fail(400, { message: 'Contact name is required' });
        if (!data.address) return fail(400, { message: 'Address is required' });
        if (!data.saleDate) return fail(400, { message: 'Sale date is required' });
        if (!data.startTime) return fail(400, { message: 'Start time is required' });
        if (!data.endTime) return fail(400, { message: 'End time is required' });

        // Parse items — sent as a JSON string from the form
        let items: string[] = [];
        try {
            items = JSON.parse(data.items as string);
        } catch {
            items = [];
        }

        if (items.length === 0) {
            return fail(400, { message: 'Please add at least one item category' });
        }

        try {
            await db.insert(yardSales).values({
                userId,
                title: data.title as string,
                description: (data.description as string) || null,
                contactName: data.contactName as string,
                phone: (data.phone as string) || null,
                email: (data.email as string) || null,
                address: data.address as string,
                locationPin: (data.locationPin as string) || null,
                saleDate: data.saleDate as string,
                startTime: data.startTime as string,
                endTime: data.endTime as string,
                items: JSON.stringify(items),
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Something went wrong. Please try again.' });
        }

        redirect(303, '/dashboard?message=Yard+sale+submitted+for+review!');
    }
};