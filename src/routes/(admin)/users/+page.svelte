<script lang="ts">
    import { Shield, User, Trash2, Pencil, Lock, Search } from 'lucide-svelte'; // Added Search icon
    import { enhance } from '$app/forms';
    import type { PageData, SubmitFunction } from './$types';
    
    let { data }: { data: PageData } = $props();
    let searchTerm = $state(""); 

    // This automatically filters whenever searchTerm changes
    let filteredUsers = $derived(
        data.userList.filter(user => 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    let isSuperAdmin = $derived(data.currentUser?.roles.includes('super-admin'));

    const handleDelete: SubmitFunction = ({ cancel }) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
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
            <h1 class="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
            <p class="text-sm text-slate-500">Manage permissions and account status for all users.</p>
        </div>
        <div class="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <User size={16} />
            Total Users: {data.userList.length}
        </div>
    </div>

    <div class="glass-card shadow-sm border border-slate-200 bg-white rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-slate-100 bg-slate-50/30">
            <div class="relative max-w-md">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    bind:value={searchTerm}
                    placeholder="Search by email..."
                    class="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="bg-slate-50/50 border-b border-slate-200">
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User Details</th>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Access Levels</th>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    {#each filteredUsers as user}
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div class="text-sm font-semibold text-slate-900">{user.email}</div>
                                        <div class="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">ID: {user.id}</div>
                                    </div>
                                </div>
                            </td>
                            
                            <td class="px-6 py-4">
                                <div class="flex flex-wrap gap-1.5">
                                    {#each user.roles as role}
                                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                            {role === 'super-admin' ? 'bg-purple-100 text-purple-700' : 
                                             role === 'admin' ? 'bg-red-100 text-red-700' : 
                                             role === 'vip' ? 'bg-amber-100 text-amber-700' : 
                                             'bg-blue-100 text-blue-700'}">
                                            {#if role.includes('admin')}<Shield size={10} />{/if}
                                            {role}
                                        </span>
                                    {/each}
                                </div>
                            </td>

                            <td class="px-6 py-4">
                                <div class="flex justify-end items-center gap-2">
                                    <form method="POST" action="?/toggleVip" use:enhance>
                                        <input type="hidden" name="id" value={user.id} />
                                        <button
                                            type="submit"
                                            class="px-3 py-1.5 text-xs font-bold rounded-lg border transition-all
                                            {user.roles.includes('vip') 
                                                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}"
                                        >
                                            {user.roles.includes('vip') ? 'Revoke VIP' : 'Make VIP'}
                                        </button>
                                    </form>

                                    {#if user.id !== data.currentUser?.id && 
                                        !user.roles.includes('super-admin') &&
                                        !(user.roles.includes('admin') && !isSuperAdmin)}
                                        <form method="POST" action="?/deleteUser" use:enhance={handleDelete}>
                                            <input type="hidden" name="id" value={user.id} />
                                            <button type="submit" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </form>
                                    {:else}
                                        <div class="p-2 text-slate-300" title="Account Protected">
                                            <Lock size={18} />
                                        </div>
                                    {/if}
                                </div>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="3" class="px-6 py-12 text-center text-slate-400 text-sm">
                                No users found matching "{searchTerm}"
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>