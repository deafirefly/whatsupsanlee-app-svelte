// src/routes/(member)/open-houses/[id]/edit/+page.server.ts

import { db } from '$lib/server/db';
import { openHouses } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Not found');

    const house = await db.query.openHouses.findFirst({ where: eq(openHouses.id, id) });
    if (!house) throw error(404, 'Not found');
    if (house.userId !== locals.user.id && !locals.user.isAdmin) throw error(403, 'Not authorized');

    return { house };
};

export const actions = {
    default: async ({ request, locals, params }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const id = Number(params.id);
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        if (!data.title) return fail(400, { message: 'Title is required' });
        if (!data.address) return fail(400, { message: 'Address is required' });
        if (!data.agentName) return fail(400, { message: 'Agent name is required' });
        if (!data.openDate) return fail(400, { message: 'Date is required' });
        if (!data.startTime) return fail(400, { message: 'Start time is required' });
        if (!data.endTime) return fail(400, { message: 'End time is required' });

        const house = await db.query.openHouses.findFirst({ where: eq(openHouses.id, id) });
        if (!house) return fail(404, { message: 'Not found' });
        if (house.userId !== locals.user.id && !locals.user.isAdmin) return fail(403, { message: 'Not authorized' });

        await db.update(openHouses).set({
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
            status: 'pending', // reset to pending on resubmit
            updatedAt: new Date(),
        }).where(eq(openHouses.id, id));

        redirect(303, `/open-houses/${id}?message=Resubmitted+for+review!`);
    }
};