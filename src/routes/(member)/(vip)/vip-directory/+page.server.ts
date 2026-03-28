import { db } from '$lib/server/db';
import { users, profiles, areas, communities } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const roles = typeof locals.user.roles === 'string' 
        ? JSON.parse(locals.user.roles) 
        : locals.user.roles;
    
    const isVip = roles.includes('vip') || roles.includes('admin') || roles.includes('superadmin');
    if (!isVip) throw redirect(302, '/dashboard');

    // Get all VIP users with their profiles
    const allUsers = await db.select().from(users);
    const allProfiles = await db.select().from(profiles);
    const allAreas = await db.select().from(areas);
    const allCommunities = await db.select().from(communities);

    const vipUsers = allUsers.filter(u => {
        const r = typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles;
        return Array.isArray(r) && (r.includes('vip') || r.includes('admin') || r.includes('superadmin'));
    });

    const vipMembers = vipUsers.map(u => {
        const profile = allProfiles.find(p => p.userId === u.id);
        const area = allAreas.find(a => a.id === profile?.areaId);
        const community = allCommunities.find(c => c.id === profile?.communityId);
        const roles = typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles;
        return {
            id: u.id,
            email: u.email,
            displayName: profile?.displayName || u.email.split('@')[0],
            avatarUrl: profile?.avatarUrl || null,
            bio: profile?.bio || null,
            areaName: area?.name || null,
            communityName: community?.name || null,
            roles,
            visibility: profile?.visibility || 'public',
        };
    }).filter(m => m.visibility !== 'private');

    return { vipMembers };
};