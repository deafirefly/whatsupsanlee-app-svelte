<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Users, Star, ShieldCheck, TrendingUp } from "lucide-svelte";
    
    let { data } = $props();
</script>

<div class="space-y-6">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p class="text-muted-foreground">Welcome back. Here is what's happening with your users.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">Total Users</CardTitle>
                <Users size={16} class="text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.stats.total}</div>
                <p class="text-xs text-muted-foreground">+0% from last month</p>
            </CardContent>
        </Card>

        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">VIP Members</CardTitle>
                <Star size={16} class="text-amber-500 fill-amber-500" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.stats.vips}</div>
                <p class="text-xs text-muted-foreground">Active subscriptions</p>
            </CardContent>
        </Card>

        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">Management</CardTitle>
                <ShieldCheck size={16} class="text-indigo-600" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold">{data.stats.admins}</div>
                <p class="text-xs text-muted-foreground">Admins & Super Admins</p>
            </CardContent>
        </Card>

        <Card shadow="sm">
            <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle class="text-sm font-medium">System Status</CardTitle>
                <TrendingUp size={16} class="text-emerald-500" />
            </CardHeader>
            <CardContent>
                <div class="text-2xl font-bold text-emerald-600">Healthy</div>
                <p class="text-xs text-muted-foreground">All systems operational</p>
            </CardContent>
        </Card>
    </div>
</div>