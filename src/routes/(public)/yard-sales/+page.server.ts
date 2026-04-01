// src/routes/(public)/yard-sales/+page.server.ts

import { db } from '$lib/server/db';
import { yardSales, users, profiles } from '$lib/server/db/schema';
import { eq, desc, gte } from 'drizzle-orm';

export const load = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Load all approved yard sales from today forward
    const sales = await db.select({
        id: yardSales.id,
        title: yardSales.title,
        description: yardSales.description,
        contactName: yardSales.contactName,
        phone: yardSales.phone,
        address: yardSales.address,
        locationPin: yardSales.locationPin,
        saleDate: yardSales.saleDate,
        startTime: yardSales.startTime,
        endTime: yardSales.endTime,
        items: yardSales.items,
        isFeatured: yardSales.isFeatured,
        createdAt: yardSales.createdAt,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
    })
    .from(yardSales)
    .innerJoin(users, eq(yardSales.userId, users.id))
    .leftJoin(profiles, eq(yardSales.userId, profiles.userId))
    .where(eq(yardSales.status, 'approved'))
    .orderBy(yardSales.saleDate);

    // Parse items JSON for each sale
    const parsedSales = sales.map(sale => ({
        ...sale,
        items: (() => { try { return JSON.parse(sale.items); } catch { return []; } })()
    }));

    // Split into upcoming and past
    const upcoming = parsedSales.filter(s => s.saleDate >= today);
    const past = parsedSales.filter(s => s.saleDate < today);

    return { upcoming, past };
};