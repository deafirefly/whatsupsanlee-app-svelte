<!-- src/routes/(member)/(vip)/(admin)/farmers-admin/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    let { data } = $props();

    let filter = $state<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    let filtered = $derived(
        filter === 'all' ? data.allFarmers : data.allFarmers.filter((f: any) => f.status === filter)
    );

    let counts = $derived({
        pending: data.allFarmers.filter((f: any) => f.status === 'pending').length,
        approved: data.allFarmers.filter((f: any) => f.status === 'approved').length,
        rejected: data.allFarmers.filter((f: any) => f.status === 'rejected').length,
    });
</script>

<div class="max-w-5xl mx-auto p-6 pb-20">
    <div class="mb-8">
        <h1 class="text-3xl font-black text-slate-900">Farmers Market Admin 🌾</h1>
        <p class="text-slate-500 mt-1">Review and approve farmer listing submissions.</p>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 mb-6 flex-wrap">
        {#each [['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']] as [val, label]}
            <button onclick={() => filter = val as any}
                class="px-4 py-2 rounded-xl text-sm font-bold transition-all
                {filter === val ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}">
                {label}
                {#if val !== 'all'}
                    <span class="ml-1 opacity-70">({counts[val as keyof typeof counts]})</span>
                {/if}
            </button>
        {/each}
    </div>

    {#if filtered.length === 0}
        <div class="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p class="font-bold text-slate-400">No farmer listings in this category.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each filtered as farmer}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <div class="flex items-start justify-between gap-4 flex-wrap">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <h3 class="font-black text-slate-900">{farmer.farmName}</h3>
                                <span class="px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-widest
                                    {farmer.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                     farmer.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                     'bg-red-100 text-red-600'}">
                                    {farmer.status}
                                </span>
                                {#if farmer.isFeatured}
                                    <span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-100 text-amber-700 uppercase">✨ Featured</span>
                                {/if}
                            </div>
                            <p class="text-sm text-slate-500">by {farmer.authorName || farmer.authorEmail} · {farmer.contactName}</p>
                            {#if farmer.farmAddress}
                                <p class="text-sm text-slate-500 mt-1">📍 {farmer.farmAddress}</p>
                            {/if}
                            {#if farmer.produceCategories?.length > 0}
                                <div class="mt-2 flex flex-wrap gap-1.5">
                                    {#each farmer.produceCategories as cat}
                                        <span class="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-bold">{cat}</span>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col gap-2 min-w-[130px]">
                            <a href="/farmers/{farmer.id}"
                                class="w-full px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all text-center">
                                👁 View
                            </a>
                            {#if farmer.status !== 'approved'}
                                <form method="POST" action="?/approve" use:enhance>
                                    <input type="hidden" name="id" value={farmer.id} />
                                    <button class="w-full px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all">
                                        ✓ Approve
                                    </button>
                                </form>
                            {/if}
                            {#if farmer.status !== 'rejected'}
                                <form method="POST" action="?/reject" use:enhance>
                                    <input type="hidden" name="id" value={farmer.id} />
                                    <button class="w-full px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
                                        ✗ Reject
                                    </button>
                                </form>
                            {/if}
                            <form method="POST" action="?/toggleFeatured" use:enhance>
                                <input type="hidden" name="id" value={farmer.id} />
                                <input type="hidden" name="isFeatured" value={String(farmer.isFeatured)} />
                                <button class="w-full px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-bold text-xs hover:bg-amber-100 transition-all">
                                    {farmer.isFeatured ? '★ Unfeature' : '☆ Feature'}
                                </button>
                            </form>
                            <form method="POST" action="?/delete" use:enhance>
                                <input type="hidden" name="id" value={farmer.id} />
                                <button
                                    onclick={(e) => { if (!confirm('Delete this farm listing?')) e.preventDefault(); }}
                                    class="w-full px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all">
                                    🗑 Delete
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>