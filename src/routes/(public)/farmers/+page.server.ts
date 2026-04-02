// src/routes/(public)/farmers/+page.server.ts

import { db } from '$lib/server/db';
import { farmerListings, users, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async () => {
    const farmers = await db.select({
        id: farmerListings.id,
        farmName: farmerListings.farmName,
        contactName: farmerListings.contactName,
        bio: farmerListings.bio,
        imageUrl: farmerListings.imageUrl,
        produceCategories: farmerListings.produceCategories,
        seasonalAvailability: farmerListings.seasonalAvailability,
        currentAvailabilityNote: farmerListings.currentAvailabilityNote,
        farmAddress: farmerListings.farmAddress,
        marketsAttended: farmerListings.marketsAttended,
        marketSchedule: farmerListings.marketSchedule,
        businessHours: farmerListings.businessHours,
        isUpick: farmerListings.isUpick,
        acceptsSnapEbt: farmerListings.acceptsSnapEbt,
        offersDelivery: farmerListings.offersDelivery,
        isOrganic: farmerListings.isOrganic,
        acceptsPreorders: farmerListings.acceptsPreorders,
        isFeatured: farmerListings.isFeatured,
        createdAt: farmerListings.createdAt,
        authorName: profiles.displayName,
    })
    .from(farmerListings)
    .innerJoin(users, eq(farmerListings.userId, users.id))
    .leftJoin(profiles, eq(farmerListings.userId, profiles.userId))
    .where(eq(farmerListings.status, 'approved'))
    .orderBy(desc(farmerListings.isFeatured), desc(farmerListings.createdAt));

    const parse = (val: string) => { try { return JSON.parse(val); } catch { return []; } };

    return {
        farmers: farmers.map(f => ({
            ...f,
            produceCategories: parse(f.produceCategories),
            seasonalAvailability: parse(f.seasonalAvailability),
            marketsAttended: parse(f.marketsAttended),
        }))
    };
};