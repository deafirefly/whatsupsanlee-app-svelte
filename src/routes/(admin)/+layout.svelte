<script lang="ts">
    import Sidebar from '$lib/components/Sidebar.svelte';
    import TopBar from '$lib/components/TopBar.svelte';
    import { enhance } from '$app/forms';
    let { children, data } = $props();
</script>

<div class="flex min-h-screen bg-slate-50">
  <Sidebar user={data.user} />

  <div class="flex-1 flex flex-col min-w-0">
    <TopBar user={data.user} />
    
    <main class="p-8">
      <div class="max-w-7xl mx-auto">
        {@render children()}
      </div>
    </main>
  </div>
</div>
