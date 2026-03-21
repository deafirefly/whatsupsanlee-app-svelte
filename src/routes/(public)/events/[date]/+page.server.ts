import { db } from '$lib/server/db';
import { events, areas, communities, listings, listingSchedule } from '$lib/server/db/schema';
import { eq, and, lte, gte } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
    const { date } = params;

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw error(400, 'Invalid date format');
    }

    // Load approved events for this date
    // (events where startDate <= date <= endDate)
    const dayEvents = await db.select()
        .from(events)
        .where(and(
            eq(events.status, 'approved'),
            lte(events.startDate, date),
            gte(events.endDate, date)
        ))
        .orderBy(events.startTime);

    // Load food truck locations for this date
    const foodTruckLocations = await db.select({
        id: listingSchedule.id,
        listingId: listingSchedule.listingId,
        date: listingSchedule.date,
        locationName: listingSchedule.locationName,
        address: listingSchedule.address,
        latitude: listingSchedule.latitude,
        longitude: listingSchedule.longitude,
        startTime: listingSchedule.startTime,
        endTime: listingSchedule.endTime,
        notes: listingSchedule.notes,
        businessName: listings.businessName,
        imageUrl: listings.imageUrl,
    })
    .from(listingSchedule)
    .innerJoin(listings, eq(listingSchedule.listingId, listings.id))
    .where(and(
        eq(listingSchedule.date, date),
        eq(listings.status, 'approved')
    ));

    // Load area names for events
    const allAreas = await db.select().from(areas);
    const allCommunities = await db.select().from(communities);

    // Format the date for display
    const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    // Calculate prev/next dates
    const dateObj = new Date(date + 'T00:00:00');
    const prevDate = new Date(dateObj);
    prevDate.setDate(prevDate.getDate() - 1);
    const nextDate = new Date(dateObj);
    nextDate.setDate(nextDate.getDate() + 1);

    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;

    return {
        date,
        displayDate,
        isToday,
        dayEvents,
        foodTruckLocations,
        allAreas,
        allCommunities,
        prevDate: prevDate.toISOString().split('T')[0],
        nextDate: nextDate.toISOString().split('T')[0],
        isLoggedIn: !!locals.user
    };
};