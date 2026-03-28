import { db } from '$lib/server/db';
import { listings, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async () => {
    const approvedListings = await db.select()
        .from(listings)
        .where(eq(listings.status, 'approved'))
        .orderBy(desc(listings.createdAt));

    // Get all listing owners to check VIP status
    const allUsers = await db.select().from(users);

    const isVipUser = (userId: number) => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return false;
        const roles = typeof user.roles === 'string' ? JSON.parse(user.roles) : user.roles;
        const vipExpiresAt = user.vipExpiresAt;

        // Check if VIP role exists
        if (!Array.isArray(roles) || !roles.includes('vip')) return false;

        // Check if VIP is expired
        if (vipExpiresAt && new Date(vipExpiresAt) < new Date()) return false;

        return true;
    };

    // Sort: Featured first, then VIP, then regular
    const sorted = approvedListings.sort((a, b) => {
        // Featured always first
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;

        // Then VIP members
        const aIsVip = isVipUser(a.userId);
        const bIsVip = isVipUser(b.userId);
        if (aIsVip && !bIsVip) return -1;
        if (!aIsVip && bIsVip) return 1;

        // Then newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return { 
        approvedListings: sorted.map(listing => ({
            ...listing,
            isVip: isVipUser(listing.userId)
        }))
    };
};