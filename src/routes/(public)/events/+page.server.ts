import { db } from '$lib/server/db';
import { events, areas, communities } from '$lib/server/db/schema';
import { eq, and, lte, gte } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
    // Default to today's date
    const today = new Date().toISOString().split('T')[0];

    // Redirect to today's date URL
    redirect(302, `/events/${today}`);
};