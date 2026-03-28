<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';

  // To this (Direct Imports):
  import LayoutDashboard from 'lucide-svelte/icons/layout-dashboard';
  import Users from 'lucide-svelte/icons/users';
  import History from 'lucide-svelte/icons/history';
  import Database from 'lucide-svelte/icons/database';
  import Settings from 'lucide-svelte/icons/settings';
  import LogOut from 'lucide-svelte/icons/log-out';
  import ListFilter from 'lucide-svelte/icons/list-filter';
  import MapPin from 'lucide-svelte/icons/map-pin';
  import Home from 'lucide-svelte/icons/home';
  import Calendar from 'lucide-svelte/icons/calendar';
  import MessageSquare from 'lucide-svelte/icons/message-square';

  let { user } = $props();

  // Use a derived rune for the current path
  let currentPath = $derived($page.url.pathname);

  // Helper to highlight the active link
  const isActive = (path: string) => $page.url.pathname === path;

  // Define the menu structure
  const memberLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  const vipLinks = [
    { name: 'VIP Lounge', href: '/vip-lounge', icon: History },
    { name: 'VIP Directory', href: '/vip-directory', icon: Star },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Messages', href: '/messages-admin', icon: MessageSquare },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Listings', href: '/listings-admin', icon: ListFilter },
    { name: 'Posts', href: '/posts-admin', icon: MessageSquare },
    { name: 'Events', href: '/events-admin', icon: Calendar },
    { name: 'Areas', href: '/areas', icon: MapPin },
    { name: 'Communities', href: '/communities', icon: Home },
    { name: 'Settings', href: '/account-settings', icon: Settings },
  ];

  const superAdminLinks = [
    { name: 'System Logs', href: '/admin/logs', icon: History },
    { name: 'Database', href: '/admin/db', icon: Database },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];
</script>

<aside class="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
  <div class="p-6 mb-4">
    <span class="text-white font-bold text-xl tracking-tight flex items-center gap-2">
      <div class="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
        <Database size={18} class="text-white" />
      </div>
      CORE<span class="text-indigo-400">ADMIN</span>
    </span>
  </div>

  <nav class="flex-1 px-4 space-y-1">
    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Main Menu</p>


    {#each memberLinks as link}
      <a href={link.href} class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all {isActive(link.href) ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}">
        <link.icon size={18} />
        {link.name}
      </a>
    {/each}

    {#if user?.roles.includes('vip') || user?.roles.includes('admin') || user?.roles.includes('superadmin')}
      <div class="mt-6">
        <p class="text-[10px] font-bold text-amber-500 uppercase tracking-widest px-3 mb-2">Premium</p>
        {#each vipLinks as link}
          <a href={link.href} class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all {isActive(link.href) ? 'bg-amber-600/10 text-amber-400' : 'hover:bg-slate-800 hover:text-white'}">
            <link.icon size={18} />
            {link.name}
          </a>
        {/each}
      </div>
    {/if}

    {#if user?.roles.includes('admin') || user?.roles.includes('superadmin')}
      <div class="mt-6">
        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">Management</p>
        {#each adminLinks as link}
          <a href={link.href} class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all {isActive(link.href) ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-slate-800 hover:text-white'}">
            <link.icon size={18} />
            {link.name}
          </a>
        {/each}
      </div>
    {/if}

    {#if user?.roles.includes('superadmin')}
      <div class="mt-6">
        <p class="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-3 mb-2">System Control</p>
        {#each superAdminLinks as link}
          <a href={link.href} class="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all {isActive(link.href) ? 'bg-rose-600/10 text-rose-400' : 'hover:bg-slate-800 hover:text-white'}">
            <link.icon size={18} />
            {link.name}
          </a>
        {/each}
      </div>
    {/if}

  </nav>

  <div class="p-4 bg-slate-950/50 mt-auto border-t border-slate-800">
    <div class="flex items-center gap-3 px-2 py-3 mb-2">
      <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
        {user?.email[0].toUpperCase()}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-white truncate">{user?.email.split('@')[0]}</p>
        <p class="text-[10px] text-slate-500 uppercase font-bold">{user?.roles[0]}</p>
      </div>
    </div>
    
    <form method="POST" action="/logout" data-sveltekit-reload>
    <button class="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
        <LogOut size={16} />
        <span>Sign Out</span>
    </button>
</form>
  </div>
</aside>