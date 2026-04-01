import { db } from '$lib/server/db';
import { listings, users, yardSales } from '$lib/server/db/schema';
import { eq, desc, and, gte } from 'drizzle-orm';

export const load = async () => {
    const approvedListings = await db.select()
        .from(listings)
        .where(eq(listings.status, 'approved'))
        .orderBy(desc(listings.createdAt));

    const allUsers = await db.select().from(users);

    const isVipUser = (userId: number) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return false;
        const roles = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;
        const vipExpiresAt = user.vipExpiresAt;
        if (!Array.isArray(roles) || !roles.includes('vip')) return false;
        if (vipExpiresAt && new Date(vipExpiresAt) < new Date()) return false;
        return true;
    };

    const sorted = approvedListings.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        const aIsVip = isVipUser(a.userId);
        const bIsVip = isVipUser(b.userId);
        if (aIsVip && !bIsVip) return -1;
        if (!aIsVip && bIsVip) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const today = new Date().toISOString().split('T')[0];
    const upcomingYardSales = await db.select()
        .from(yardSales)
        .where(and(eq(yardSales.status, 'approved'), gte(yardSales.saleDate, today)))
        .orderBy(yardSales.saleDate)
        .limit(3);

    const parsedYardSales = upcomingYardSales.map(s => ({
        ...s,
        items: (() => { try { return JSON.parse(s.items); } catch { return []; } })()
    }));

    return {
        approvedListings: sorted.map(listing => ({
            ...listing,
            isVip: isVipUser(listing.userId)
        })),
        upcomingYardSales: parsedYardSales
    };
};