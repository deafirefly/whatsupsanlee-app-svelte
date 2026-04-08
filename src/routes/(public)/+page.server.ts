import { db } from '$lib/server/db';
import { listings, users, yardSales, farmerListings } from '$lib/server/db/schema';
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

    const sortedListings = approvedListings.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        const aIsVip = isVipUser(a.userId);
        const bIsVip = isVipUser(b.userId);
        if (aIsVip && !bIsVip) return -1;
        if (!aIsVip && bIsVip) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Load all approved farmers
    const approvedFarmers = await db.select()
        .from(farmerListings)
        .where(eq(farmerListings.status, 'approved'))
        .orderBy(desc(farmerListings.isFeatured), desc(farmerListings.createdAt));

    // Normalize farmers to match listing card shape
    const normalizedFarmers = approvedFarmers.map(f => ({
        id: f.id,
        type: 'farmer' as const,
        businessName: f.farmName,
        bio: f.bio,
        imageUrl: f.imageUrl,
        address: f.farmAddress,
        isFeatured: f.isFeatured,
        isVip: false,
        category: 'farmer_listing',
        produceCategories: (() => { try { return JSON.parse(f.produceCategories); } catch { return []; } })(),
        currentAvailabilityNote: f.currentAvailabilityNote,
        isOrganic: f.isOrganic,
        isUpick: f.isUpick,
        acceptsSnapEbt: f.acceptsSnapEbt,
        createdAt: f.createdAt,
    }));

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
        approvedListings: sortedListings.map(listing => ({
            ...listing,
            type: 'listing' as const,
            isVip: isVipUser(listing.userId)
        })),
        approvedFarmers: normalizedFarmers,
        upcomingYardSales: parsedYardSales,
    };
};