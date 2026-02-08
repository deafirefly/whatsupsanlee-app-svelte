<script lang="ts">
    import { enhance } from '$app/forms';
    let { children, data } = $props();

    let isAdmin = $derived(
        data.user?.roles?.includes('admin') || data.user?.roles?.includes('super-admin')
    );
</script>

<nav class="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
    <div class="flex items-center gap-6">
        <span class="font-bold text-lg tracking-tight">Member Portal</span>
        <div class="hidden md:flex space-x-4 text-sm font-medium">
            <a href="/dashboard" class="hover:text-indigo-200 transition-colors">Dashboard</a>
            <a href="/profile" class="hover:text-indigo-200 transition-colors">My Profile</a>
            
            {#if isAdmin}
                <a href="/users" class="bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors border border-white/20">
                    ⚙️ Admin Panel
                </a>
            {/if}
        </div>
    </div>

    <div class="flex items-center space-x-4">
        <span class="text-xs text-indigo-100 hidden sm:inline">{data.user?.email}</span>
        
        <form method="POST" action="/logout" use:enhance>
            <button 
                type="submit" 
                class="bg-indigo-700 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 transition-all active:scale-95"
            >
                Sign Out
            </button>
        </form>
    </div>
</nav>

<main class="max-w-7xl mx-auto p-6">
    {@render children()}
</main>