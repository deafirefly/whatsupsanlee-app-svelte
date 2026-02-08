<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PageData } from './$types';
  import "../app.css"; // Ensure your Tailwind/Global CSS is here

  let { data, children } : { 
    data: PageData;
    children: Snippet
  } = $props();
</script>

{@render children()}