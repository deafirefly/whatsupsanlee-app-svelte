// src/routes/(member)/open-houses/create/+page.server.ts

import { db } from '$lib/server/db';
import { openHouses } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        if (!data.title) return fail(400, { message: 'Title is required' });
        if (!data.address) return fail(400, { message: 'Address is required' });
        if (!data.agentName) return fail(400, { message: 'Agent name is required' });
        if (!data.openDate) return fail(400, { message: 'Open house date is required' });
        if (!data.startTime) return fail(400, { message: 'Start time is required' });
        if (!data.endTime) return fail(400, { message: 'End time is required' });

        try {
            await db.insert(openHouses).values({
                userId: locals.user.id,
                title: data.title as string,
                description: (data.description as string) || null,
                imageUrl: (data.imageUrl as string) || null,
                address: data.address as string,
                locationPin: (data.locationPin as string) || null,
                price: data.price ? parseInt(data.price as string) : null,
                bedrooms: data.bedrooms ? parseInt(data.bedrooms as string) : null,
                bathrooms: data.bathrooms ? parseFloat(data.bathrooms as string) : null,
                sqFt: data.sqFt ? parseInt(data.sqFt as string) : null,
                lotSize: (data.lotSize as string) || null,
                yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt as string) : null,
                propertyType: (data.propertyType as string) || 'single_family',
                agentName: data.agentName as string,
                agentPhone: (data.agentPhone as string) || null,
                agentEmail: (data.agentEmail as string) || null,
                agentCompany: (data.agentCompany as string) || null,
                openDate: data.openDate as string,
                startTime: data.startTime as string,
                endTime: data.endTime as string,
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Something went wrong. Please try again.' });
        }

        redirect(303, '/dashboard?message=Open+house+submitted+for+review!');
    }
};