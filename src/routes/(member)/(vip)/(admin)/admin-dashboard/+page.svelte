<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Users, Star, ShieldCheck, TrendingUp } from "lucide-svelte";
    
    let { data } = $props();
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

        <Card shadow="sm">
    <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle class="text-sm font-medium">Yard Sales</CardTitle>
        <span class="text-lg">🏷️</span>
    </CardHeader>
    <CardContent>
        <div class="text-2xl font-bold">{data.contentStats.totalYardSales}</div>
        {#if data.contentStats.pendingYardSales > 0}
            <p class="text-xs text-amber-500 font-bold">⏳ {data.contentStats.pendingYardSales} pending approval</p>
        {:else}
            <p class="text-xs text-muted-foreground">All approved</p>
        {/if}
    </CardContent>
</Card>
    </div>

    <!-- Content Stats -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">Listings</CardTitle>
                <span class="text-lg">🏪</span>
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.contentStats.totalListings}</div>
                {#if data.contentStats.pendingListings > 0}
                    <p class="text-xs text-amber-500 font-bold">⏳ {data.contentStats.pendingListings} pending approval</p>
                {:else}
                    <p class="text-xs text-muted-foreground">All approved</p>
                {/if}
            </CardContent>
        </Card>

        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">Events</CardTitle>
                <span class="text-lg">📅</span>
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.contentStats.totalEvents}</div>
                {#if data.contentStats.pendingEvents > 0}
                    <p class="text-xs text-amber-500 font-bold">⏳ {data.contentStats.pendingEvents} pending approval</p>
                {:else}
                    <p class="text-xs text-muted-foreground">All approved</p>
                {/if}
            </CardContent>
        </Card>

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
    </div>

    <!-- Pending Approvals Alert -->
    {#if data.contentStats.pendingListings > 0 || data.contentStats.pendingEvents > 0 || data.contentStats.unreadMessages > 0}
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
                    {#if data.contentStats.unreadMessages > 0}
                        <a href="/messages-admin" class="text-xs font-black text-amber-700 underline hover:text-amber-900">
                            {data.contentStats.unreadMessages} unread message{data.contentStats.unreadMessages > 1 ? 's' : ''} →
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    {/if}

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