import { db } from '$lib/server/db';
import { yardSales, users, profiles } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Yard sale not found');

    const result = await db.select({
        id: yardSales.id,
        title: yardSales.title,
        description: yardSales.description,
        contactName: yardSales.contactName,
        phone: yardSales.phone,
        email: yardSales.email,
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
    .where(and(eq(yardSales.id, id), eq(yardSales.status, 'approved')))
    .limit(1);

    if (!result.length) throw error(404, 'Yard sale not found');

    const sale = result[0];

    return {
        sale: {
            ...sale,
            items: (() => { try { return JSON.parse(sale.items); } catch { return []; } })()
        }
    };
};