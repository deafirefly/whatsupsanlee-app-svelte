<!-- src/routes/(member)/(vip)/(admin)/open-houses-admin/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { data } = $props();
    let filter = $state<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    let filtered = $derived(
        filter === 'all' ? data.allHouses : data.allHouses.filter(h => h.status === filter)
    );

    let counts = $derived({
        pending: data.allHouses.filter(h => h.status === 'pending').length,
        approved: data.allHouses.filter(h => h.status === 'approved').length,
        rejected: data.allHouses.filter(h => h.status === 'rejected').length,
    });

    function formatDate(d: string) {
        const [y, m, day] = d.split('-').map(Number);
        return new Date(y, m - 1, day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }

    function formatTime(t: string) {
        const [h, m] = t.split(':').map(Number);
        return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
    }

    function formatPrice(p: number | null) {
        if (!p) return 'No price';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);
    }

    const propertyTypeLabel: Record<string, string> = {
        single_family: 'Single Family',
        condo: 'Condo',
        townhouse: 'Townhouse',
        land: 'Land',
        commercial: 'Commercial',
        other: 'Other',
    };
</script>

<div class="max-w-5xl mx-auto p-6 pb-20">
    <div class="mb-8">
        <h1 class="text-3xl font-black text-slate-900">Open Houses Admin 🏠</h1>
        <p class="text-slate-500 mt-1">Review and approve open house submissions.</p>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 mb-6 flex-wrap">
        {#each [['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']] as [val, label]}
            <button onclick={() => filter = val as any}
                class="px-4 py-2 rounded-xl text-sm font-bold transition-all
                {filter === val ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}">
                {label}
                {#if val !== 'all'}
                    <span class="ml-1 opacity-70">({counts[val as keyof typeof counts]})</span>
                {/if}
            </button>
        {/each}
    </div>

    {#if filtered.length === 0}
        <div class="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p class="font-bold text-slate-400">No open houses in this category.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each filtered as house}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <div class="flex items-start justify-between gap-4 flex-wrap">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <h3 class="font-black text-slate-900">{house.title}</h3>
                                <span class="px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-widest
                                    {house.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                     house.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                     'bg-red-100 text-red-600'}">
                                    {house.status}
                                </span>
                                <span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-slate-100 text-slate-600 uppercase">
                                    {propertyTypeLabel[house.propertyType ?? 'single_family']}
                                </span>
                                {#if house.isFeatured}
                                    <span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-100 text-amber-700 uppercase">✨ Featured</span>
                                {/if}
                            </div>
                            <p class="text-sm text-slate-500">by {house.authorName || house.authorEmail} · Agent: {house.agentName}{house.agentCompany ? ` · ${house.agentCompany}` : ''}</p>

                            <div class="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                                <span>📍 {house.address}</span>
                                <span class="font-black text-indigo-600">{formatPrice(house.price)}</span>
                            </div>

                            <div class="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                                {#if house.bedrooms}<span>🛏 {house.bedrooms} beds</span>{/if}
                                {#if house.bathrooms}<span>🚿 {house.bathrooms} baths</span>{/if}
                                {#if house.sqFt}<span>📐 {house.sqFt.toLocaleString()} sq ft</span>{/if}
                            </div>

                            <div class="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                <span>📅 {formatDate(house.openDate)} · {formatTime(house.startTime)} – {formatTime(house.endTime)}</span>
                            </div>

                            {#if house.agentPhone || house.agentEmail}
                                <div class="mt-1 flex gap-3 text-xs text-slate-400">
                                    {#if house.agentPhone}<span>📞 {house.agentPhone}</span>{/if}
                                    {#if house.agentEmail}<span>✉️ {house.agentEmail}</span>{/if}
                                </div>
                            {/if}
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col gap-2 min-w-[120px]">
                            {#if house.status !== 'approved'}
                                <form method="POST" action="?/approve" use:enhance>
                                    <input type="hidden" name="id" value={house.id} />
                                    <button class="w-full px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all">✓ Approve</button>
                                </form>
                            {/if}
                            {#if house.status !== 'rejected'}
                                <form method="POST" action="?/reject" use:enhance>
                                    <input type="hidden" name="id" value={house.id} />
                                    <button class="w-full px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all">✕ Reject</button>
                                </form>
                            {/if}
                            <form method="POST" action="?/toggleFeatured" use:enhance>
                                <input type="hidden" name="id" value={house.id} />
                                <input type="hidden" name="isFeatured" value={String(house.isFeatured)} />
                                <button class="w-full px-4 py-2 {house.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'} rounded-xl text-xs font-black hover:opacity-80 transition-all">
                                    {house.isFeatured ? '★ Unfeature' : '☆ Feature'}
                                </button>
                            </form>
                            <a href="/open-houses/{house.id}"
                                class="w-full text-center px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all">
                                View →
                            </a>
                            <form method="POST" action="?/delete" use:enhance>
                                <input type="hidden" name="id" value={house.id} />
                                <button onclick={(e) => { if (!confirm('Delete this listing permanently?')) e.preventDefault(); }}
                                    class="w-full px-4 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
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