<script lang="ts">
    import * as Table from "$lib/components/ui/table";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Label } from "$lib/components/ui/label";
    import { Shield, User, Trash2, Lock, Search, Star, StarOff, UserPlus } from 'lucide-svelte'; 
    import { enhance } from '$app/forms';
    import type { PageData, SubmitFunction } from './$types';
    
    let { data }: { data: PageData } = $props();
    let searchTerm = $state(""); 
    let isCreateModalOpen = $state(false);

    // 1. Create a local 'working copy' of the user list
    let allUsers = $state(data.userList ?? []);

    // 2. Keep local state in sync if the server data refreshes (e.g. on page load)
    $effect(() => {
        allUsers = data.userList ?? [];
    });

    // 1. Point directly to userList. No need to map/parse again!
    // We use $derived to keep it reactive to the searchTerm.
    let filteredUsers = $derived(
        allUsers.filter(user => 
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // 2. Security Check for UI
    // Ensure data.currentUser exists and parse roles if it's still a string
    let userRoles = $derived(
        typeof data.currentUser?.roles === 'string' 
            ? JSON.parse(data.currentUser.roles) 
            : (data.currentUser?.roles ?? [])
    );

    let isSuperAdmin = $derived(userRoles.includes('superadmin'));

    const handleDelete: SubmitFunction = ({ cancel, formData }) => {
        // 1. Grab the ID from the formData
        const id = formData.get('id');
    
        // 2. Browser Popup (with explicit window reference)
        if (!window.confirm("Are you sure you want to delete this user? This action is permanent.")) {
            cancel();
            return;
        }

        // 3. Optimistic UI: Remove it from local state immediately
        // Make sure your each loop is using 'allUsers' or 'filteredUsers' based on 'allUsers'
        allUsers = allUsers.filter(u => u.id !== Number(id));

        return async ({ result, update }) => {
            // If the server fails, update() will refresh the list from the DB
            await update();
        
            if (result.type === 'error' || result.type === 'failure') {
                alert("Could not delete user. They might have been restored.");
            }
        };
    };


    const handleCreateUser: SubmitFunction = () => {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                isCreateModalOpen = false; // Close only on success
                await update();
            } else if (result.type === 'failure') {
                // You can use a toast library here!
                alert(result.data?.message ?? "Failed to create user");
            }
        };
    };
</script>

<div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">User Management</h1>
            <p class="text-muted-foreground">Manage permissions and account status for all users.</p>
        </div>
        <Badge variant="outline" class="px-4 py-2 text-sm gap-2 bg-background shadow-sm">
            <User size={14} class="text-primary" />
            Total Users: {data.userList.length}
        </Badge>
    </div>


    <Dialog.Root bind:open={isCreateModalOpen}>
        <Dialog.Trigger>
            <Button class="gap-2">
                <UserPlus size={18} /> Add User
            </Button>
        </Dialog.Trigger>

        <Dialog.Content class="sm:max-w-[425px] bg-white p-6 border rounded-lg shadow-lg">
    <Dialog.Header>
        <Dialog.Title class="text-xl font-bold">Create New User</Dialog.Title>
        <Dialog.Description>
            Enter details for the new account.
        </Dialog.Description>
    </Dialog.Header>

    <form method="POST" action="?/createUser" use:enhance={handleCreateUser} class="flex flex-col gap-4 py-4">
        
        <div class="flex flex-col gap-2">
            <Label for="email" class="text-sm font-medium">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required class="border p-2" />
        </div>

        <div class="flex flex-col gap-2">
            <Label for="password" class="text-sm font-medium">Initial Password</Label>
            <Input id="password" name="password" type="password" required class="border p-2" />
        </div>

        <div class="flex flex-col gap-2">
            <Label for="roles" class="text-sm font-medium">Primary Role</Label>
            <select name="roles" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring">
                <option value='["member"]'>Member</option>
                <option value='["member", "vip"]'>VIP Member</option>
                <option value='["member", "admin"]'>Admin</option>
            </select>
        </div>

        <Dialog.Footer class="pt-4">
            <Button type="submit" class="w-full bg-blue-600 text-white hover:bg-blue-700">
                Create Account
            </Button>
        </Dialog.Footer>
    </form>
</Dialog.Content>

    </Dialog.Root>

    <Card class="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader class="bg-slate-50/50 border-b space-y-4">
            <div class="relative max-w-sm">
                <Search size={18} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    bind:value={searchTerm}
                    placeholder="Search by email..."
                    class="pl-10 bg-background"
                />
            </div>
        </CardHeader>
        
        <CardContent class="p-0">
            <Table.Root>
                <Table.Header class="bg-slate-50/50">
                    <Table.Row>
                        <Table.Head class="w-[300px]">User Details</Table.Head>
                        <Table.Head>Access Levels</Table.Head>
                        <Table.Head class="text-right">Actions</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each filteredUsers as user}
                        <Table.Row class="hover:bg-slate-50/30">
                            <Table.Cell>
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground border border-slate-200">
                                        <User size={18} />
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="font-semibold text-slate-900">{user.email}</span>
                                        <span class="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">ID: {user.id}</span>
                                    </div>
                                </div>
                            </Table.Cell>
                            
                            <Table.Cell>
                                <div class="flex flex-wrap gap-1.5">
                                    {#each user.roles as role}
                                        <Badge 
                                            variant={role === 'vip' ? 'outline' : (role === 'superadmin' ? 'default' : 'secondary')}
                                            class="text-[10px] uppercase tracking-wide font-bold {role === 'vip' ? 'border-amber-200 bg-amber-50 text-amber-700' : ''}"
                                        >
                                            {#if role === 'vip'}<Star size={10} class="mr-1 fill-amber-500 text-amber-500" />{/if}
                                            {#if role.includes('admin')}<Shield size={10} class="mr-1" />{/if}
                                            {role}
                                        </Badge>
                                    {/each}

                                    {#if user.vipExpiresAt}
    {@const expiry = new Date(user.vipExpiresAt)}
    {@const isExpired = expiry < new Date()}
    <Badge variant="outline" class="text-[10px] {isExpired ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-200 text-slate-500'}">
        {isExpired ? '⚠ Expired' : `Expires ${expiry.toLocaleDateString()}`}
    </Badge>
{:else if user.roles.includes('vip')}
    <Badge variant="outline" class="text-[10px] border-emerald-200 bg-emerald-50 text-emerald-600">
        ♾️ Lifetime
    </Badge>
{/if}
                                </div>
                            </Table.Cell>

                            <Table.Cell>
                                <div class="flex justify-end items-center gap-2">
    <form method="POST" action="?/toggleVip" use:enhance>
        <input type="hidden" name="id" value={user.id} />
        <Button 
            type="submit" 
            variant={user.roles.includes('vip') ? 'secondary' : 'outline'} 
            size="sm"
            class="h-8 gap-1"
        >
            {#if user.roles.includes('vip')}
                <StarOff size={14} class="text-amber-600" /> Revoke VIP
            {:else}
                <Star size={14} class="text-amber-500" /> Make VIP
            {/if}
        </Button>
    </form>

    <!-- VIP Expiry -->
{#if user.roles.includes('vip')}
    <form method="POST" action="?/setVipExpiry" use:enhance class="flex items-center gap-1">
        <input type="hidden" name="id" value={user.id} />
        <input
            type="date"
            name="expiryDate"
            class="h-8 px-2 text-xs border border-slate-200 rounded-lg focus:border-amber-400 outline-none"
            title="Set VIP expiry date (leave blank for lifetime)"
        />
        <Button type="submit" variant="outline" size="sm" class="h-8 text-xs">
            Set Expiry
        </Button>
    </form>
{/if}

    <!-- Only superadmin can toggle admin role, and not on themselves or other superadmins -->
    {#if isSuperAdmin && user.id !== data.currentUser?.id && !user.roles.includes('superadmin')}
        <form method="POST" action="?/toggleAdmin" use:enhance>
            <input type="hidden" name="id" value={user.id} />
            <Button
                type="submit"
                variant={user.roles.includes('admin') ? 'secondary' : 'outline'}
                size="sm"
                class="h-8 gap-1"
            >
                {#if user.roles.includes('admin')}
                    <Shield size={14} class="text-red-500" /> Revoke Admin
                {:else}
                    <Shield size={14} class="text-indigo-500" /> Make Admin
                {/if}
            </Button>
        </form>
    {/if}

                                    {#if user.id !== data.currentUser?.id && !user.roles.includes('superadmin')}
                                        <form method="POST" action="?/deleteUser" use:enhance={handleDelete}>
                                            <input type="hidden" name="id" value={user.id} />
                                            <Button variant="ghost" size="icon" type="submit" class="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 size={16} />
                                            </Button>
                                        </form>
                                    {:else}
                                        <div class="p-2 text-slate-300" title="Account Protected">
                                            <Lock size={18} />
                                        </div>
                                    {/if}
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    {:else}
                        <Table.Row>
                            <Table.Cell colspan={3} class="h-24 text-center text-muted-foreground">
                                No users found matching "{searchTerm}"
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </CardContent>
    </Card>
</div>