// src/routes/(public)/family/+page.server.ts

import { db } from '$lib/server/db';
import { events, parksTrails } from '$lib/server/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export const load = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Upcoming family-friendly events
    const familyEvents = await db.select()
        .from(events)
        .where(and(
            eq(events.status, 'approved'),
            eq(events.isFamilyFriendly, true),
            gte(events.endDate, today)
        ))
        .orderBy(events.startDate)
        .limit(10);

    // All approved parks & trails
    const allPlaces = await db.select()
        .from(parksTrails)
        .where(eq(parksTrails.status, 'approved'))
        .orderBy(parksTrails.isFeatured, parksTrails.name);

    const parse = (val: string) => { try { return JSON.parse(val); } catch { return []; } };

    const parks = allPlaces
        .filter(p => p.type === 'park' || p.type === 'playground' || p.type === 'picnic' || p.type === 'sports_field' || p.type === 'swimming')
        .map(p => ({ ...p, features: parse(p.features ?? '[]') }));

    const trails = allPlaces
        .filter(p => p.type === 'trail')
        .map(p => ({ ...p, features: parse(p.features ?? '[]') }));

    return { familyEvents, parks, trails, today };
};