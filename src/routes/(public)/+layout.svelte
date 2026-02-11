<script lang="ts">
  import type { Snippet } from 'svelte';

  import type { LayoutProps } from './$types';

  // We define the shape of the global data we expect
  interface ExtendedProps extends LayoutProps {
    data: LayoutProps['data'] & {
      user: { id: number; email: string; roles: string[] } | null;
    };
  }

  let { data, children }: ExtendedProps = $props();

  let menuOpen = $state(false);

  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<nav class="p-4 border-b bg-white flex justify-between items-center relative">
  <div class="font-bold text-xl text-indigo-600 tracking-tight">What's up, SanLee!</div>

  <div class="hidden md:flex gap-6 items-center">
    <a href="/" class="hover:text-indigo-600 transition-colors">Home</a>
    <a href="/about" class="hover:text-indigo-600 transition-colors">About</a>
    <a href="/subscribe" class="hover:text-indigo-600 transition-colors">Pricing</a>
    {#if data.user}
      <a href="/dashboard" class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all">
        Go to Dashboard →
      </a>
    {:else}
      <a href="/login" class="text-indigo-600 font-medium">Login</a>
    {/if}
  </div>

  <button class="md:hidden p-2" onclick={toggleMenu}>
    {menuOpen ? '✕' : '☰'}
  </button>

  {#if menuOpen}
    <div class="absolute top-full left-0 w-full bg-white border-b flex flex-col p-4 md:hidden shadow-xl z-50">
      <a href="/" onclick={toggleMenu} class="py-3 border-b border-slate-50">Home</a>
      <a href="/about" onclick={toggleMenu} class="py-3 border-b border-slate-50">About</a>
      <a href="/subscribe" onclick={toggleMenu} class="py-3">Pricing</a>
    </div>
  {/if}
</nav>

{@render children()}