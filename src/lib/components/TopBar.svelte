<script lang="ts">
  import { page } from '$app/stores';
  import { User, Bell, ChevronRight } from 'lucide-svelte';
  
  let { user } = $props();

  // Get the current path segments for breadcrumbs
  // e.g., /dashboard/users -> ['dashboard', 'users']
  let pathSegments = $derived($page.url.pathname.split('/').filter(Boolean));
</script>

<header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
  <nav class="flex items-center gap-2 text-sm">
    <span class="text-slate-400 hover:text-slate-600 transition-colors cursor-default">Admin</span>
    {#each pathSegments as segment}
      <ChevronRight size={14} class="text-slate-300" />
      <span class="font-medium text-slate-700 capitalize">{segment.replace(/-/g, ' ')}</span>
    {/each}
  </nav>

  <div class="flex items-center gap-6">
    <button class="text-slate-400 hover:text-indigo-600 transition-colors relative">
      <Bell size={20} />
      <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
    </button>

    <div class="h-8 w-px bg-slate-200"></div>

    <div class="flex items-center gap-3">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-semibold text-slate-900 leading-none">{user?.email.split('@')[0]}</p>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{user?.roles[0]}</p>
      </div>
      <div class="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
        <User size={20} />
      </div>
    </div>
  </div>
</header>