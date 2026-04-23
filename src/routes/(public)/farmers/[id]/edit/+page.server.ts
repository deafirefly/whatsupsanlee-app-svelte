// src/routes/(member)/farmers/[id]/edit/+page.server.ts

import { db } from '$lib/server/db';
import { farmerListings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Not found');

    const farmer = await db.query.farmerListings.findFirst({
        where: eq(farmerListings.id, id)
    });

    if (!farmer) throw error(404, 'Not found');
    if (farmer.userId !== locals.user.id && !locals.user.isAdmin) throw error(403, 'Not authorized');

    const parse = (val: string) => { try { return JSON.parse(val); } catch { return []; } };

    return {
        farmer: {
            ...farmer,
            produceCategories: parse(farmer.produceCategories),
            seasonalAvailability: parse(farmer.seasonalAvailability),
            marketsAttended: parse(farmer.marketsAttended),
        }
    };
};

export const actions = {
    default: async ({ request, locals, params }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const id = Number(params.id);
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        if (!data.farmName) return fail(400, { message: 'Farm name is required' });
        if (!data.contactName) return fail(400, { message: 'Contact name is required' });

        let produceCategories: string[] = [];
        let seasonalAvailability: string[] = [];
        let marketsAttended: string[] = [];
        try { produceCategories = JSON.parse(data.produceCategories as string); } catch { produceCategories = []; }
        try { seasonalAvailability = JSON.parse(data.seasonalAvailability as string); } catch { seasonalAvailability = []; }
        try { marketsAttended = JSON.parse(data.marketsAttended as string); } catch { marketsAttended = []; }

        if (produceCategories.length === 0) return fail(400, { message: 'Please select at least one produce category' });

        const farmer = await db.query.farmerListings.findFirst({ where: eq(farmerListings.id, id) });
        if (!farmer) return fail(404, { message: 'Not found' });
        if (farmer.userId !== locals.user.id && !locals.user.isAdmin) return fail(403, { message: 'Not authorized' });

        await db.update(farmerListings).set({
            farmName: data.farmName as string,
            contactName: data.contactName as string,
            bio: (data.bio as string) || null,
            imageUrl: (data.imageUrl as string) || null,
            farmAddress: (data.farmAddress as string) || null,
            locationPin: (data.locationPin as string) || null,
            produceCategories: JSON.stringify(produceCategories),
            seasonalAvailability: JSON.stringify(seasonalAvailability),
            currentAvailabilityNote: (data.currentAvailabilityNote as string) || null,
            marketsAttended: JSON.stringify(marketsAttended),
            marketSchedule: (data.marketSchedule as string) || null,
            businessHours: (data.businessHours as string) || null,
            isUpick: data.isUpick === 'true',
            acceptsSnapEbt: data.acceptsSnapEbt === 'true',
            offersDelivery: data.offersDelivery === 'true',
            isOrganic: data.isOrganic === 'true',
            acceptsPreorders: data.acceptsPreorders === 'true',
            phone: (data.phone as string) || null,
            email: (data.email as string) || null,
            website: (data.website as string) || null,
            instagram: (data.instagram as string) || null,
            facebook: (data.facebook as string) || null,
            status: 'pending', // reset to pending on resubmit
            updatedAt: new Date(),
        }).where(eq(farmerListings.id, id));

        redirect(303, `/farmers/${id}?message=Resubmitted+for+review!`);
    }
};