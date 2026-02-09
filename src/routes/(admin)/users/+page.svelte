<script lang="ts">
    import * as Table from "$lib/components/ui/table";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
    import { Shield, User, Trash2, Lock, Search, Star, StarOff } from 'lucide-svelte'; 
    import { enhance } from '$app/forms';
    import type { PageData, SubmitFunction } from './$types';
    
    let { data }: { data: PageData } = $props();
    let searchTerm = $state(""); 

    let filteredUsers = $derived(
        data.userList.filter(user => 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    let isSuperAdmin = $derived(data.currentUser?.roles.includes('super-admin'));

    const handleDelete: SubmitFunction = ({ cancel }) => {
        if (!confirm("Are you sure you want to delete this user?")) {
            cancel();
        }
        return async ({ result }) => {
            if (result.type === 'success') console.log('User deleted successfully');
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
                                            variant={role === 'super-admin' ? 'default' : 'secondary'}
                                            class="text-[10px] uppercase tracking-wide font-bold"
                                        >
                                            {#if role.includes('admin')}<Shield size={10} class="mr-1" />{/if}
                                            {role}
                                        </Badge>
                                    {/each}
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

                                    {#if user.id !== data.currentUser?.id && !user.roles.includes('super-admin')}
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