import { db } from '$lib/server/db';
import { bookings, listings } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const listing = await db.query.listings.findFirst({
        where: eq(listings.userId, locals.user.id)
    });

    if (!listing) throw redirect(302, '/dashboard');

    const allBookings = await db.select()
        .from(bookings)
        .where(eq(bookings.listingId, listing.id))
        .orderBy(desc(bookings.createdAt));

    return { listing, bookings: allBookings };
};

export const actions = {
    confirm: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const vendorNotes = (formData.get('vendorNotes') as string) || null;

        await db.update(bookings)
            .set({ status: 'confirmed', vendorNotes, updatedAt: new Date() })
            .where(eq(bookings.id, id));

        return { success: true };
    },

    decline: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const vendorNotes = (formData.get('vendorNotes') as string) || null;

        await db.update(bookings)
            .set({ status: 'declined', vendorNotes, updatedAt: new Date() })
            .where(eq(bookings.id, id));

        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        await db.delete(bookings).where(eq(bookings.id, id));
        return { success: true };
    }
};