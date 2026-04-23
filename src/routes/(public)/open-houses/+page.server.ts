// src/routes/(public)/open-houses/+page.server.ts

import { db } from '$lib/server/db';
import { openHouses, users, profiles } from '$lib/server/db/schema';
import { eq, and, gte, lt } from 'drizzle-orm';

export const load = async () => {
    const today = new Date().toISOString().split('T')[0];

    const all = await db.select({
        id: openHouses.id,
        title: openHouses.title,
        address: openHouses.address,
        price: openHouses.price,
        bedrooms: openHouses.bedrooms,
        bathrooms: openHouses.bathrooms,
        sqFt: openHouses.sqFt,
        propertyType: openHouses.propertyType,
        imageUrl: openHouses.imageUrl,
        agentName: openHouses.agentName,
        agentCompany: openHouses.agentCompany,
        openDate: openHouses.openDate,
        startTime: openHouses.startTime,
        endTime: openHouses.endTime,
        isFeatured: openHouses.isFeatured,
        status: openHouses.status,
    })
    .from(openHouses)
    .where(eq(openHouses.status, 'approved'))
    .orderBy(openHouses.openDate);

    const upcoming = all.filter(o => o.openDate >= today);
    const past = all.filter(o => o.openDate < today);

    return { upcoming, past, today };
};