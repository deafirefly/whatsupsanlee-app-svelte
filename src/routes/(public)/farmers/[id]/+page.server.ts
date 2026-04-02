// src/routes/(public)/farmers/[id]/+page.server.ts

import { db } from '$lib/server/db';
import { farmerListings, users, profiles } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Farm not found');

    const result = await db.select({
        id: farmerListings.id,
        userId: farmerListings.userId,
        farmName: farmerListings.farmName,
        contactName: farmerListings.contactName,
        bio: farmerListings.bio,
        imageUrl: farmerListings.imageUrl,
        produceCategories: farmerListings.produceCategories,
        seasonalAvailability: farmerListings.seasonalAvailability,
        currentAvailabilityNote: farmerListings.currentAvailabilityNote,
        farmAddress: farmerListings.farmAddress,
        locationPin: farmerListings.locationPin,
        marketsAttended: farmerListings.marketsAttended,
        marketSchedule: farmerListings.marketSchedule,
        businessHours: farmerListings.businessHours,
        isUpick: farmerListings.isUpick,
        acceptsSnapEbt: farmerListings.acceptsSnapEbt,
        offersDelivery: farmerListings.offersDelivery,
        isOrganic: farmerListings.isOrganic,
        acceptsPreorders: farmerListings.acceptsPreorders,
        phone: farmerListings.phone,
        email: farmerListings.email,
        website: farmerListings.website,
        instagram: farmerListings.instagram,
        facebook: farmerListings.facebook,
        isFeatured: farmerListings.isFeatured,
        createdAt: farmerListings.createdAt,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
    })
    .from(farmerListings)
    .innerJoin(users, eq(farmerListings.userId, users.id))
    .leftJoin(profiles, eq(farmerListings.userId, profiles.userId))
    .where(and(eq(farmerListings.id, id), eq(farmerListings.status, 'approved')))
    .limit(1);

    if (!result.length) throw error(404, 'Farm not found');

    const parse = (val: string) => { try { return JSON.parse(val); } catch { return []; } };
    const f = result[0];

    return {
        farmer: {
            ...f,
            produceCategories: parse(f.produceCategories),
            seasonalAvailability: parse(f.seasonalAvailability),
            marketsAttended: parse(f.marketsAttended),
        },
        currentUserId: locals.user?.id ?? null,
        isAdmin: locals.user?.isAdmin ?? false,
    };
};

export const actions = {
    delete: async ({ params, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const id = Number(params.id);
        if (isNaN(id)) return fail(400, { message: 'Invalid ID' });

        const farmer = await db.query.farmerListings.findFirst({
            where: eq(farmerListings.id, id)
        });

        if (!farmer) return fail(404, { message: 'Farm not found' });

        if (farmer.userId !== locals.user.id && !locals.user.isAdmin) {
            return fail(403, { message: 'Not authorized' });
        }

        await db.delete(farmerListings).where(eq(farmerListings.id, id));
        redirect(303, '/farmers');
    }
};