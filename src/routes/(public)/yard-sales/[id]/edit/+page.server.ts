// src/routes/(member)/yard-sales/[id]/edit/+page.server.ts

import { db } from '$lib/server/db';
import { yardSales } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const id = Number(params.id);
    if (isNaN(id)) throw error(404, 'Not found');

    const sale = await db.query.yardSales.findFirst({
        where: eq(yardSales.id, id)
    });

    if (!sale) throw error(404, 'Not found');
    if (sale.userId !== locals.user.id && !locals.user.isAdmin) throw error(403, 'Not authorized');

    return {
        sale: {
            ...sale,
            items: (() => { try { return JSON.parse(sale.items); } catch { return []; } })()
        }
    };
};

export const actions = {
    default: async ({ request, locals, params }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const id = Number(params.id);
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        if (!data.title) return fail(400, { message: 'Title is required' });
        if (!data.address) return fail(400, { message: 'Address is required' });
        if (!data.saleDate) return fail(400, { message: 'Date is required' });
        if (!data.startTime) return fail(400, { message: 'Start time is required' });
        if (!data.endTime) return fail(400, { message: 'End time is required' });

        let items: string[] = [];
        try { items = JSON.parse(data.items as string); } catch { items = []; }
        if (items.length === 0) return fail(400, { message: 'Please add at least one item category' });

        const sale = await db.query.yardSales.findFirst({ where: eq(yardSales.id, id) });
        if (!sale) return fail(404, { message: 'Not found' });
        if (sale.userId !== locals.user.id && !locals.user.isAdmin) return fail(403, { message: 'Not authorized' });

        await db.update(yardSales).set({
            title: data.title as string,
            description: (data.description as string) || null,
            contactName: data.contactName as string,
            phone: (data.phone as string) || null,
            email: (data.email as string) || null,
            address: data.address as string,
            locationPin: (data.locationPin as string) || null,
            saleDate: data.saleDate as string,
            startTime: data.startTime as string,
            endTime: data.endTime as string,
            items: JSON.stringify(items),
            status: 'pending', // reset to pending on resubmit
            updatedAt: new Date(),
        }).where(eq(yardSales.id, id));

        redirect(303, `/yard-sales/${id}?message=Resubmitted+for+review!`);
    }
};