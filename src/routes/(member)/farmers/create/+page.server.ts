// src/routes/(member)/farmers/create/+page.server.ts

import { db } from '$lib/server/db';
import { farmerListings } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, locals }) => {
        const userId = locals.user?.id;
        if (!userId) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        // Validation
        if (!data.farmName) return fail(400, { message: 'Farm name is required' });
        if (!data.contactName) return fail(400, { message: 'Contact name is required' });

        // Parse JSON arrays
        let produceCategories: string[] = [];
        let seasonalAvailability: string[] = [];
        let marketsAttended: string[] = [];

        try { produceCategories = JSON.parse(data.produceCategories as string); } catch { produceCategories = []; }
        try { seasonalAvailability = JSON.parse(data.seasonalAvailability as string); } catch { seasonalAvailability = []; }
        try { marketsAttended = JSON.parse(data.marketsAttended as string); } catch { marketsAttended = []; }

        if (produceCategories.length === 0) {
            return fail(400, { message: 'Please select at least one produce category' });
        }

        try {
            await db.insert(farmerListings).values({
                userId,
                farmName: data.farmName as string,
                contactName: data.contactName as string,
                bio: (data.bio as string) || null,
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
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Something went wrong. Please try again.' });
        }

        redirect(303, '/dashboard?message=Farmer+listing+submitted+for+review!');
    }
};