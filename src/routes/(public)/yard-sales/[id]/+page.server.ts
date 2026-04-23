// src/routes/(public)/yard-sales/[id]/+page.server.ts

import { db } from '$lib/server/db';
import { yardSales, users, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Yard sale not found');

    const result = await db.select({
        id: yardSales.id,
        userId: yardSales.userId,
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
        status: yardSales.status,
        isFeatured: yardSales.isFeatured,
        createdAt: yardSales.createdAt,
        authorName: profiles.displayName,
        authorAvatar: profiles.avatarUrl,
    })
    .from(yardSales)
    .innerJoin(users, eq(yardSales.userId, users.id))
    .leftJoin(profiles, eq(yardSales.userId, profiles.userId))
    .where(eq(yardSales.id, id))
    .limit(1);

    if (!result.length) throw error(404, 'Yard sale not found');

    const sale = result[0];

    // Only owner or admin can see non-approved listings
    const isOwner = locals.user?.id === sale.userId;
    const isAdmin = locals.user?.isAdmin ?? false;
    if (sale.status !== 'approved' && !isOwner && !isAdmin) {
        throw error(404, 'Yard sale not found');
    }

    return {
        sale: {
            ...sale,
            items: (() => { try { return JSON.parse(sale.items); } catch { return []; } })()
        },
        currentUserId: locals.user?.id ?? null,
        isAdmin,
    };
};

export const actions = {
    delete: async ({ params, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const id = Number(params.id);
        if (isNaN(id)) return fail(400, { message: 'Invalid ID' });

        const sale = await db.query.yardSales.findFirst({
            where: eq(yardSales.id, id)
        });

        if (!sale) return fail(404, { message: 'Yard sale not found' });

        const isAdmin = locals.user.isAdmin;
        if (sale.userId !== locals.user.id && !isAdmin) {
            return fail(403, { message: 'Not authorized to delete this yard sale' });
        }

        await db.delete(yardSales).where(eq(yardSales.id, id));
        redirect(303, '/yard-sales');
    }
};