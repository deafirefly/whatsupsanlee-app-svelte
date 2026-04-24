// src/routes/(member)/dashboard/schedule/+page.server.ts

import { db } from '$lib/server/db';
import { listings, listingSchedule } from '$lib/server/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const listing = await db.query.listings.findFirst({
        where: eq(listings.userId, locals.user.id)
    });

    if (!listing) throw redirect(302, '/dashboard');
    if (listing.category !== 'food_truck') throw error(403, 'Schedule is only for food trucks');

    const today = new Date().toISOString().split('T')[0];

    // Load all upcoming schedule entries
    const schedule = await db.select()
        .from(listingSchedule)
        .where(and(
            eq(listingSchedule.listingId, listing.id),
            gte(listingSchedule.date, today)
        ))
        .orderBy(listingSchedule.date);

    // Also load past entries (last 30 days) for reference
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const pastDate = thirtyDaysAgo.toISOString().split('T')[0];

    const pastSchedule = await db.select()
        .from(listingSchedule)
        .where(and(
            eq(listingSchedule.listingId, listing.id),
        ))
        .orderBy(listingSchedule.date);

    const upcoming = pastSchedule.filter(s => s.date >= today);
    const past = pastSchedule.filter(s => s.date < today).slice(-10); // last 10 past

    return { listing, upcoming, past, today };
};

export const actions = {
    addEntry: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const listing = await db.query.listings.findFirst({
            where: eq(listings.userId, locals.user.id)
        });
        if (!listing) return fail(404, { message: 'Listing not found' });

        const formData = await request.formData();
        const date = formData.get('date') as string;
        const locationName = formData.get('locationName') as string;
        const address = formData.get('address') as string;
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;
        const notes = (formData.get('notes') as string) || null;

        if (!date || !locationName || !address || !startTime || !endTime) {
            return fail(400, { message: 'Date, location, address and times are required' });
        }

        // Check if entry already exists for this date
        const existing = await db.query.listingSchedule.findFirst({
            where: and(
                eq(listingSchedule.listingId, listing.id),
                eq(listingSchedule.date, date)
            )
        });

        if (existing) {
            // Update existing entry for this date
            await db.update(listingSchedule)
                .set({ locationName, address, startTime, endTime, notes })
                .where(eq(listingSchedule.id, existing.id));
        } else {
            await db.insert(listingSchedule).values({
                listingId: listing.id,
                date,
                locationName,
                address,
                startTime,
                endTime,
                notes,
                createdAt: new Date(),
            });
        }

        return { success: true };
    },

    deleteEntry: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { message: 'Invalid ID' });

        const listing = await db.query.listings.findFirst({
            where: eq(listings.userId, locals.user.id)
        });
        if (!listing) return fail(404, { message: 'Listing not found' });

        // Verify entry belongs to this listing
        const entry = await db.query.listingSchedule.findFirst({
            where: and(
                eq(listingSchedule.id, id),
                eq(listingSchedule.listingId, listing.id)
            )
        });
        if (!entry) return fail(404, { message: 'Entry not found' });

        await db.delete(listingSchedule).where(eq(listingSchedule.id, id));
        return { success: true };
    },

    bulkAdd: async ({ request, locals }) => {
        if (!locals.user) return fail(401, { message: 'Unauthorized' });

        const listing = await db.query.listings.findFirst({
            where: eq(listings.userId, locals.user.id)
        });
        if (!listing) return fail(404, { message: 'Listing not found' });

        const formData = await request.formData();
        const entriesJson = formData.get('entries') as string;

        let entries: Array<{
            date: string;
            locationName: string;
            address: string;
            startTime: string;
            endTime: string;
            notes?: string;
        }> = [];

        try {
            entries = JSON.parse(entriesJson);
        } catch {
            return fail(400, { message: 'Invalid entries data' });
        }

        if (!entries.length) return fail(400, { message: 'No entries provided' });

        for (const entry of entries) {
            if (!entry.date || !entry.locationName || !entry.address || !entry.startTime || !entry.endTime) continue;

            const existing = await db.query.listingSchedule.findFirst({
                where: and(
                    eq(listingSchedule.listingId, listing.id),
                    eq(listingSchedule.date, entry.date)
                )
            });

            if (existing) {
                await db.update(listingSchedule)
                    .set({
                        locationName: entry.locationName,
                        address: entry.address,
                        startTime: entry.startTime,
                        endTime: entry.endTime,
                        notes: entry.notes ?? null,
                    })
                    .where(eq(listingSchedule.id, existing.id));
            } else {
                await db.insert(listingSchedule).values({
                    listingId: listing.id,
                    date: entry.date,
                    locationName: entry.locationName,
                    address: entry.address,
                    startTime: entry.startTime,
                    endTime: entry.endTime,
                    notes: entry.notes ?? null,
                    createdAt: new Date(),
                });
            }
        }

        return { success: true, count: entries.length };
    }
};