<script lang="ts">
    import Sidebar from '$lib/components/Sidebar.svelte';
    import { enhance } from '$app/forms';
    let { children, data } = $props();

    // Use $derived to keep the admin status reactive
    let isSuperAdmin = $derived(data.user?.roles?.includes('super-admin'));
    let userEmail = $derived(data.user?.email ?? 'Admin');
</script>




<nav class="bg-gray-900 text-white p-4 flex justify-between items-center shadow-2xl border-b border-gray-800">
    <div class="flex items-center gap-4">
        <div class="bg-red-600 px-2 py-1 rounded text-xs font-black uppercase tracking-widest">
            Admin Area
        </div>
        <div class="hidden md:flex space-x-4 text-sm font-medium">
            <a href="/users" class="hover:text-red-400 transition-colors">Manage Users</a>
            <a href="/dashboard" class="text-gray-400 hover:text-white transition-colors">← Back to Member Portal</a>
        </div>
    </div>

    <div class="flex items-center space-x-4">
        <div class="flex flex-col items-end mr-2">
            <span class="text-xs font-bold text-gray-300">{userEmail}</span>
            {#if isSuperAdmin}
                <span class="text-[10px] text-red-500 uppercase font-bold">Super Admin</span>
            {/if}
        </div>

        <form method="POST" action="/logout" use:enhance>
            <button 
                type="submit" 
                class="bg-gray-800 border border-gray-700 px-3 py-1 rounded hover:bg-red-700 hover:border-red-600 transition-all text-sm"
            >
                Sign Out
            </button>
        </form>
    </div>
</nav>

<div class="flex min-h-screen">
  <Sidebar user={data.user} />

  <main class="flex-1 bg-slate-50 p-8 overflow-y-auto">
    <div class="max-w-6xl mx-auto">
      {@render children()}
    </div>
  </main>
</div>