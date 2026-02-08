<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PageData } from './$types';

  let { data, children } : { 
    data: PageData & { user?: { id: number; email: string; roles: string[] } | null };
    children: Snippet
  } = $props();

  let menuOpen = $state(false); // Using a Rune for UI state

  function toggleMenu() {
    menuOpen = !menuOpen;
  }
</script>

<nav class="p-4 border-b bg-white flex justify-between items-center relative">
  <div class="font-bold text-xl">MyProject</div>

  <div class="hidden md:flex gap-6">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/subscribe">Pricing</a>
    {#if data.user}
      <a href="/dashboard" class="text-indigo-600 font-medium hover:text-indigo-800">
        Back to Dashboard →
      </a>
    {:else}
      <a href="/login">Login</a>
    {/if}
  </div>

  <button class="md:hidden" onclick={toggleMenu}>
    {menuOpen ? '✕' : '☰'}
  </button>

  {#if menuOpen}
    <div class="absolute top-full left-0 w-full bg-white border-b flex flex-col p-4 md:hidden shadow-lg z-50">
      <a href="/" onclick={toggleMenu} class="py-2">Home</a>
      <a href="/about" onclick={toggleMenu} class="py-2">About</a>
      <a href="/subscribe" onclick={toggleMenu} class="py-2">Pricing</a>
    </div>
  {/if}


</nav>

{@render children()}