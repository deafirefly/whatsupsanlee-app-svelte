<script lang="ts">
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { enhance } from '$app/forms';
    import { User, Lock, Save } from 'lucide-svelte';

    let { data, form } = $props();
</script>

<div class="max-w-2xl mx-auto space-y-6">
    <div>
        <h1 class="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p class="text-muted-foreground">Manage your personal account details and security.</p>
    </div>

    <form method="POST" action="?/updateProfile" use:enhance>
        <Card shadow="sm">
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <User size={18} class="text-primary" /> General Information
                </CardTitle>
                <CardDescription>Update your login email address.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label for="email">Email Address</Label>
                    <Input id="email" name="email" type="email" value={data.user?.email} required />
                </div>
            </CardContent>
        </Card>

        <Card shadow="sm" class="mt-6">
            <CardHeader>
                <CardTitle class="flex items-center gap-2">
                    <Lock size={18} class="text-primary" /> Security
                </CardTitle>
                <CardDescription>Change your password. Leave new password blank to keep current one.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label for="currentPassword">Current Password</Label>
                    <Input id="currentPassword" name="currentPassword" type="password" required />
                </div>
                <div class="space-y-2">
                    <Label for="newPassword">New Password (Optional)</Label>
                    <Input id="newPassword" name="newPassword" type="password" placeholder="Min. 6 characters" />
                </div>
            </CardContent>
        </Card>

        <div class="flex justify-end mt-6">
            <Button type="submit" class="gap-2">
                <Save size={18} /> Save Changes
            </Button>
        </div>

        {#if form?.message}
            <p class="mt-4 text-sm font-medium {form?.success ? 'text-emerald-600' : 'text-destructive'}">
                {form.message}
            </p>
        {/if}
    </form>
</div>