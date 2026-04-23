<!-- src/routes/(member)/(vip)/(admin)/admin-dashboard/+page.svelte -->
<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Users, Star, ShieldCheck, TrendingUp } from "lucide-svelte";
    
    let { data } = $props();

    const listingTypes = [
        {
            emoji: '🏪',
            label: 'Listings',
            total: data.contentStats.totalListings,
            pending: data.contentStats.pendingListings,
            approved: data.contentStats.totalListings - data.contentStats.pendingListings - (data.contentStats.totalListings - data.contentStats.pendingListings - (data.contentStats.totalListings - data.contentStats.pendingListings)),
            href: '/listings-admin',
        },
        {
            emoji: '🌾',
            label: 'Farmers Market',
            total: data.contentStats.totalFarmers,
            pending: data.contentStats.pendingFarmers,
            href: '/farmers-admin',
        },
        {
            emoji: '🏷️',
            label: 'Yard Sales',
            total: data.contentStats.totalYardSales,
            pending: data.contentStats.pendingYardSales,
            href: '/yard-sales-admin',
        },
        {
    emoji: '🏠',
    label: 'Open Houses',
    total: data.contentStats.totalOpenHouses,
    pending: data.contentStats.pendingOpenHouses,
    href: '/open-houses-admin',
},
        {
            emoji: '📅',
            label: 'Events',
            total: data.contentStats.totalEvents,
            pending: data.contentStats.pendingEvents,
            href: '/events-admin',
        },
        {
    emoji: '👨‍👩‍👧‍👦',
    label: 'Family Hub',
    total: data.contentStats.totalParksTrails,
    pending: data.contentStats.pendingParksTrails,
    href: '/family-admin',
},

{
            emoji: '📱',
            label: 'Creators',
            total: data.contentStats.totalCreators,
            pending: data.contentStats.pendingCreators,
            href: '/creators-admin',
        },

    ];
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p class="text-muted-foreground">Welcome back. Here's what's happening on WhatsUp SanLee.</p>
    </div>

    <!-- User Stats -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">Total Users</CardTitle>
                <Users size={16} class="text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.stats.total}</div>
                <p class="text-xs text-muted-foreground">Registered members</p>
            </CardContent>
        </Card>

        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">VIP Members</CardTitle>
                <Star size={16} class="text-amber-500 fill-amber-500" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.stats.vips}</div>
                <p class="text-xs text-muted-foreground">Active VIP subscriptions</p>
            </CardContent>
        </Card>

        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">Management</CardTitle>
                <ShieldCheck size={16} class="text-indigo-600" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.stats.admins}</div>
                <p class="text-xs text-muted-foreground">Admins & Superadmins</p>
            </CardContent>
        </Card>

        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">System Status</CardTitle>
                <TrendingUp size={16} class="{data.systemStatus.database === 'healthy' ? 'text-emerald-500' : 'text-red-500'}" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold {data.systemStatus.database === 'healthy' ? 'text-emerald-600' : 'text-red-600'}">
                    {data.systemStatus.database === 'healthy' ? 'Healthy' : 'Error'}
                </div>
                <p class="text-xs text-muted-foreground">v{data.systemStatus.version} · DB {data.systemStatus.database}</p>
            </CardContent>
        </Card>
    </div>

    <!-- Quick Stats Row: Posts & Messages -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">Posts</CardTitle>
                <span class="text-lg">📣</span>
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.contentStats.totalPosts}</div>
                <p class="text-xs text-muted-foreground">Community feed posts</p>
            </CardContent>
        </Card>

        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">Messages</CardTitle>
                <span class="text-lg">✉️</span>
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.contentStats.unreadMessages}</div>
                {#if data.contentStats.unreadMessages > 0}
                    <p class="text-xs text-red-500 font-bold">🔴 Unread messages!</p>
                {:else}
                    <p class="text-xs text-muted-foreground">No unread messages</p>
                {/if}
            </CardContent>
        </Card>

        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">Bookings</CardTitle>
                <span class="text-lg">📋</span>
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.contentStats.totalBookings}</div>
                {#if data.contentStats.pendingBookings > 0}
                    <p class="text-xs text-amber-500 font-bold">⏳ {data.contentStats.pendingBookings} pending</p>
                {:else}
                    <p class="text-xs text-muted-foreground">All handled</p>
                {/if}
            </CardContent>
        </Card>
    </div>

    <!-- Pending Approvals Alert -->
    {#if data.contentStats.pendingListings > 0 || data.contentStats.pendingEvents > 0 || data.contentStats.pendingYardSales > 0 || data.contentStats.pendingFarmers > 0 || data.contentStats.pendingCreators > 0 || data.contentStats.pendingOpenHouses > 0 || data.contentStats.pendingParksTrails > 0 || data.contentStats.unreadMessages > 0}
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <span class="text-xl">⚠️</span>
            <div>
                <p class="font-black text-amber-900 text-sm">Action Required!</p>
                <div class="flex flex-wrap gap-3 mt-2">
                    {#if data.contentStats.pendingListings > 0}
                        <a href="/listings-admin" class="text-xs font-black text-amber-700 underline hover:text-amber-900">
                            {data.contentStats.pendingListings} listing{data.contentStats.pendingListings > 1 ? 's' : ''} pending →
                        </a>
                    {/if}
                    {#if data.contentStats.pendingEvents > 0}
                        <a href="/events-admin" class="text-xs font-black text-amber-700 underline hover:text-amber-900">
                            {data.contentStats.pendingEvents} event{data.contentStats.pendingEvents > 1 ? 's' : ''} pending →
                        </a>
                    {/if}
                    {#if data.contentStats.pendingYardSales > 0}
                        <a href="/yard-sales-admin" class="text-xs font-black text-amber-700 underline hover:text-amber-900">
                            {data.contentStats.pendingYardSales} yard sale{data.contentStats.pendingYardSales > 1 ? 's' : ''} pending →
                        </a>
                    {/if}
                    {#if data.contentStats.pendingFarmers > 0}
                        <a href="/farmers-admin" class="text-xs font-black text-amber-700 underline hover:text-amber-900">
                            {data.contentStats.pendingFarmers} farmer listing{data.contentStats.pendingFarmers > 1 ? 's' : ''} pending →
                        </a>
                    {/if}
                    {#if data.contentStats.pendingOpenHouses > 0}
                        <a href="/open-houses-admin" class="text-xs font-black text-amber-700 underline hover:text-amber-900">
                            {data.contentStats.pendingOpenHouses} open house{data.contentStats.pendingOpenHouses > 1 ? 's' : ''} pending →
                        </a>
                    {/if}
                    {#if data.contentStats.pendingParksTrails > 0}
                        <a href="/family-admin" class="text-xs font-black text-amber-700 underline hover:text-amber-900">
                            {data.contentStats.pendingParksTrails} park/trail{data.contentStats.pendingParksTrails > 1 ? 's' : ''} pending →
                        </a>
                    {/if}
                    {#if data.contentStats.pendingCreators > 0}
                        <a href="/creators-admin" class="text-xs font-black text-amber-700 underline hover:text-amber-900">
                            {data.contentStats.pendingCreators} creator{data.contentStats.pendingCreators > 1 ? 's' : ''} pending →
                        </a>
                    {/if}
                    {#if data.contentStats.unreadMessages > 0}
                        <a href="/messages-admin" class="text-xs font-black text-amber-700 underline hover:text-amber-900">
                            {data.contentStats.unreadMessages} unread message{data.contentStats.unreadMessages > 1 ? 's' : ''} →
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    {/if}

    <!-- Community Listings Table -->
    <Card class="w-full">
        <CardHeader>
            <CardTitle>Community Listings</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="w-full">
                <!-- Table Header -->
                <div class="grid grid-cols-5 gap-4 px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <div class="col-span-2">Type</div>
                    <div class="text-center">Total</div>
                    <div class="text-center">Pending</div>
                    <div class="text-right">Action</div>
                </div>

                <!-- Table Rows -->
                {#each listingTypes as type}
                    <div class="grid grid-cols-5 gap-4 px-4 py-4 items-center border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-xl">
                        
                        <!-- Type -->
                        <div class="col-span-2 flex items-center gap-3">
                            <span class="text-xl">{type.emoji}</span>
                            <span class="font-bold text-slate-900 text-sm">{type.label}</span>
                        </div>

                        <!-- Total -->
                        <div class="text-center">
                            <span class="text-lg font-black text-slate-900">{type.total}</span>
                        </div>

                        <!-- Pending / Needs Attention -->
                        <div class="text-center">
                            {#if type.pending > 0}
                                <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black">
                                    ⏳ {type.pending}
                                </span>
                            {:else}
                                <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-black">
                                    ✓ Clear
                                </span>
                            {/if}
                        </div>

                        <!-- Action -->
                        <div class="text-right">
                            <a href={type.href}
                                class="text-xs font-black text-indigo-600 hover:text-indigo-800 hover:underline transition-colors">
                                Review →
                            </a>
                        </div>

                    </div>
                {/each}
            </div>
        </CardContent>
    </Card>

    <!-- Recent Users -->
    <Card class="w-full">
        <CardHeader>
            <CardTitle>Recent New Users</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="space-y-2">
                {#each data.recentUsers ?? [] as user}
                    <div class="flex items-center justify-between gap-4 border-b pb-3 last:border-0">
                        <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                {user.email ? user.email[0].toUpperCase() : '?'}
                            </div>
                            <div>
                                <p class="text-sm font-medium leading-none">{user.email}</p>
                                <p class="text-xs text-muted-foreground">ID: {user.id}</p>
                            </div>
                        </div>
                        <a href="/users" class="text-xs text-indigo-600 hover:underline font-bold">View →</a>
                    </div>
                {:else}
                    <p class="text-sm text-muted-foreground text-center py-4">No users yet.</p>
                {/each}
            </div>
        </CardContent>
    </Card>
</div>