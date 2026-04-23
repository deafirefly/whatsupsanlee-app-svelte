<!-- src/routes/(member)/(vip)/(admin)/yard-sales-admin/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { data } = $props();

    let filter = $state<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    let filtered = $derived(
        filter === 'all' ? data.allSales : data.allSales.filter(s => s.status === filter)
    );

    let counts = $derived({
        pending: data.allSales.filter(s => s.status === 'pending').length,
        approved: data.allSales.filter(s => s.status === 'approved').length,
        rejected: data.allSales.filter(s => s.status === 'rejected').length,
    });

    function formatDate(d: string) {
        const [y, m, day] = d.split('-').map(Number);
        return new Date(y, m - 1, day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }

    function formatTime(t: string) {
        const [h, min] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${h % 12 || 12}:${min.toString().padStart(2, '0')} ${ampm}`;
    }
</script>

<div class="max-w-5xl mx-auto p-6 pb-20">
    <div class="mb-8">
        <h1 class="text-3xl font-black text-slate-900">Yard Sales Admin 🏷️</h1>
        <p class="text-slate-500 mt-1">Review and approve yard sale submissions.</p>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 mb-6 flex-wrap">
        {#each [['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']] as [val, label]}
            <button
                onclick={() => filter = val as any}
                class="px-4 py-2 rounded-xl text-sm font-bold transition-all
                {filter === val ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}"
            >
                {label}
                {#if val !== 'all'}
                    <span class="ml-1 opacity-70">({counts[val as keyof typeof counts]})</span>
                {/if}
            </button>
        {/each}
    </div>

    <!-- Table -->
    {#if filtered.length === 0}
        <div class="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p class="font-bold text-slate-400">No yard sales in this category.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each filtered as sale}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <div class="flex items-start justify-between gap-4 flex-wrap">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap">
                                <h3 class="font-black text-slate-900">{sale.title}</h3>
                                <span class="px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-widest
                                    {sale.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                     sale.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                     'bg-red-100 text-red-600'}">
                                    {sale.status}
                                </span>
                                {#if sale.isFeatured}
                                    <span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-100 text-amber-700 uppercase tracking-widest">✨ Featured</span>
                                {/if}
                            </div>
                            <p class="text-sm text-slate-500 mt-1">by {sale.authorName || sale.authorEmail} · {sale.contactName}</p>

                            <div class="mt-2 space-y-1 text-sm text-slate-600">
                                <div class="flex items-center gap-2">
                                    <span>📅</span> {formatDate(sale.saleDate)} · {formatTime(sale.startTime)}–{formatTime(sale.endTime)}
                                </div>
                                <div class="flex items-center gap-2">
                                    <span>📍</span> {sale.address}
                                </div>
                            </div>

                            {#if sale.items?.length > 0}
                                <div class="mt-2 flex flex-wrap gap-1.5">
                                    {#each sale.items as item}
                                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{item}</span>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col gap-2 min-w-[130px]">
                            <a href="/yard-sales/{sale.id}"
                                class="w-full text-center px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all block">
                                View →
                            </a>
                            {#if sale.status !== 'approved'}
                                <form method="POST" action="?/approve" use:enhance>
                                    <input type="hidden" name="id" value={sale.id} />
                                    <button class="w-full px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all">
                                        ✓ Approve
                                    </button>
                                </form>
                            {/if}
                            {#if sale.status !== 'rejected'}
                                <form method="POST" action="?/reject" use:enhance>
                                    <input type="hidden" name="id" value={sale.id} />
                                    <button class="w-full px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
                                        ✗ Reject
                                    </button>
                                </form>
                            {/if}
                            <form method="POST" action="?/toggleFeatured" use:enhance>
                                <input type="hidden" name="id" value={sale.id} />
                                <input type="hidden" name="isFeatured" value={String(sale.isFeatured)} />
                                <button class="w-full px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-bold text-xs hover:bg-amber-100 transition-all">
                                    {sale.isFeatured ? '★ Unfeature' : '☆ Feature'}
                                </button>
                            </form>
                            <form method="POST" action="?/delete" use:enhance>
                                <input type="hidden" name="id" value={sale.id} />
                                <button
                                    onclick={(e) => { if (!confirm('Delete this yard sale?')) e.preventDefault(); }}
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