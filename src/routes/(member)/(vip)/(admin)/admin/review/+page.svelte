<script lang="ts">
    import { enhance } from '$app/forms';
    let { data, form } = $props();
</script>

{#if form?.success}
    <div class="mb-4 p-3 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg animate-in fade-in">
        {form.message}
    </div>
{/if}

<div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-2 text-slate-900">Approval Queue</h1>
    <p class="text-muted-foreground mb-8">Review and approve new community listings.</p>

    {#if data.pendingListings.length === 0}
        <div class="p-12 border-2 border-dashed rounded-2xl text-center text-slate-400">
            No pending listings to review. Great job!
        </div>
    {:else}
        <div class="grid gap-6">
            {#each data.pendingListings as item}
                <div class="bg-white border rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6">
                    <div class="space-y-2">
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded uppercase">
                                {item.category.replace('_', ' ')}
                            </span>
                            <h2 class="text-xl font-bold">{item.businessName}</h2>
                        </div>
                        <p class="text-sm text-slate-600 line-clamp-2">{item.bio}</p>
                        <p class="text-xs font-mono text-slate-400">📍 {item.address}</p>
                    </div>

                    <div class="flex items-center gap-3">
                        <form method="POST" action="?/approve" use:enhance>
                            <input type="hidden" name="id" value={item.id} />
                            <button class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700">
                                Approve
                            </button>
                        </form>
                        <form method="POST" action="?/reject" use:enhance>
                            <input type="hidden" name="id" value={item.id} />
                            <button class="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50">
                                Reject
                            </button>
                        </form>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>