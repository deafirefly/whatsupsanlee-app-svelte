<script lang="ts">
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    import LayoutDashboard from 'lucide-svelte/icons/layout-dashboard';
    import User from 'lucide-svelte/icons/user';
    import Settings from 'lucide-svelte/icons/settings';
    import LogOut from 'lucide-svelte/icons/log-out';

    let { user } = $props();

    const isActive = (path: string) => $page.url.pathname === path;
</script>

<aside class="w-56 h-screen bg-white text-slate-700 flex flex-col border-r border-slate-200">
    <!-- Logo -->
    <div class="p-6 mb-2 border-b border-slate-100">
        <a href="/" class="flex flex-col gap-0.5">
    <span class="text-indigo-600 font-black text-lg tracking-tight">What's Up SanLee!</span>
    <span class="text-[10px] font-black text-amber-500 uppercase tracking-widest">Beta</span>
</a>
    </div>

    <nav class="flex-1 px-4 py-4 space-y-1">
    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Main Menu</p>

    <a href="/dashboard"
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
        {isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
        <LayoutDashboard size={18} />
        Dashboard
    </a>

    {#if user?.roles?.includes('vip') || user?.roles?.includes('admin') || user?.roles?.includes('superadmin')}
        <a href="/vip-lounge"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
            {isActive('/vip-lounge') ? 'bg-amber-50 text-amber-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
            ⭐ VIP Lounge
        </a>
        <a href="/vip-directory"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
            {isActive('/vip-directory') ? 'bg-amber-50 text-amber-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
            👥 VIP Directory
        </a>
    {/if}

    <a href="/profile"
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
        {isActive('/profile') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
        <User size={18} />
        My Profile
    </a>
    <a href="/account-settings"
        class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
        {isActive('/account-settings') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
        <Settings size={18} />
        Settings
    </a>

    <!-- Community Section -->
    <div class="pt-4">
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Community</p>
        <a href="/yard-sales"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
            {isActive('/yard-sales') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
            🏷️ Yard Sales
        </a>
        <a href="/yard-sales/create"
            class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
            {isActive('/yard-sales/create') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
            + Post Yard Sale
        </a>
        <a href="/open-houses"
    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
    {isActive('/open-houses') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
    🏠 Open Houses
</a>
<a href="/open-houses/create"
    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
    {isActive('/open-houses/create') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
    + Post Open House
</a>

<a href="/creators"
    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
    {isActive('/creators') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
    📱 Creators
</a>
<a href="/creators/create"
    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
    {isActive('/creators/create') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
    + Submit Profile
</a>

        <a href="/farmers"
    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
    {isActive('/farmers') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
    🌾 Farmers Market
</a>
<a href="/farmers/create"
    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
    {isActive('/farmers/create') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
    + List Your Farm
</a>

<a href="/family"
    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
    {isActive('/family') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
    👨‍👩‍👧‍👦 Family Hub
</a>
<a href="/family/parks/submit"
    class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all
    {isActive('/family/parks/submit') ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}">
    + Submit a Place
</a>

    </div>
</nav>

    <!-- User Info & Sign Out -->
    <div class="p-4 bg-slate-50 mt-auto border-t border-slate-100">
        <div class="flex items-center gap-3 px-2 py-3 mb-2">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow text-sm">
                {user?.email[0].toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-900 truncate">{user?.email.split('@')[0]}</p>
                <p class="text-[10px] text-slate-400 uppercase font-bold">
                    {typeof user?.roles === 'string' ? JSON.parse(user.roles)[0] : user?.roles?.[0] ?? 'member'}
                </p>
            </div>
        </div>

        <form method="POST" action="/logout" data-sveltekit-reload>
            <button class="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <LogOut size={16} />
                <span>Sign Out</span>
            </button>
        </form>
    </div>
</aside>