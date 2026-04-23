import { db } from '$lib/server/db';
import { users, listings, events, posts, bookings, contactMessages, yardSales, farmerListings, parksTrails, openHouses } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { desc, eq, count } from 'drizzle-orm';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');
    if (!locals.user.isAdmin) throw error(403, 'Forbidden');

    try {
        const allUsers = await db.select().from(users).orderBy(desc(users.id));

        const hasRole = (user: any, roleName: string) => {
            const r = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;
            return Array.isArray(r) && r.includes(roleName);
        };

        // Get counts
        const allListings = await db.select().from(listings);
        const allEvents = await db.select().from(events);
        const allPosts = await db.select().from(posts);
        const allBookings = await db.select().from(bookings);
        const allMessages = await db.select().from(contactMessages);
        const allYardSales = await db.select().from(yardSales);
        const allOpenHouses = await db.select().from(openHouses);
        const allFarmers = await db.select().from(farmerListings);
        const allParksTrails = await db.select().from(parksTrails);


        // Check DB connection
        let dbStatus = 'healthy';
        try {
            await db.select().from(users).limit(1);
        } catch {
            dbStatus = 'error';
        }

        return {
            stats: {
                total: allUsers.length,
                vips: allUsers.filter(u => hasRole(u, 'vip')).length,
                admins: allUsers.filter(u => hasRole(u, 'admin') || hasRole(u, 'superadmin')).length,
            },
            contentStats: {
                totalListings: allListings.length,
                pendingListings: allListings.filter(l => l.status === 'pending').length,
                totalEvents: allEvents.length,
                pendingEvents: allEvents.filter(e => e.status === 'pending').length,
                totalPosts: allPosts.length,
                totalBookings: allBookings.length,
                pendingBookings: allBookings.filter(b => b.status === 'pending').length,
                unreadMessages: allMessages.filter(m => m.status === 'unread').length,
                totalYardSales: allYardSales.length,                                        // ← ADD
                pendingYardSales: allYardSales.filter(y => y.status === 'pending').length,  // ← ADD
                totalOpenHouses: allOpenHouses.length,
                pendingOpenHouses: allOpenHouses.filter(o => o.status === 'pending').length,
                totalFarmers: allFarmers.length,
                pendingFarmers: allFarmers.filter(f => f.status === 'pending').length,
                totalParksTrails: allParksTrails.length,
                pendingParksTrails: allParksTrails.filter(p => p.status === 'pending').length,
            },
            systemStatus: {
                database: dbStatus,
                uptime: 'operational',
                version: '0.3.5'
            },
            recentUsers: allUsers.slice(0, 5)
        };
    } catch (err) {
        console.error("Dashboard Load Error:", err);
        return {
            stats: { total: 0, vips: 0, admins: 0 },
            contentStats: {
                totalListings: 0, pendingListings: 0,
                totalEvents: 0, pendingEvents: 0,
                totalPosts: 0, totalBookings: 0,
                pendingBookings: 0, unreadMessages: 0,
                totalYardSales: 0, pendingYardSales: 0,
                totalFarmers: 0, pendingFarmers: 0,
            },
            systemStatus: { database: 'error', uptime: 'unknown', version: '0.3.5' },
            recentUsers: []
        };
    }
};