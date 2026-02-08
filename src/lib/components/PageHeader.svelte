<script lang="ts">
  let { title, description, children } = $props();
</script>

<div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <div>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
    {#if description}
      <p class="text-slate-500 text-sm">{description}</p>
    {/if}
  </div>
  <div class="flex items-center gap-3">
    {@render children?.()}
  </div>
</div>