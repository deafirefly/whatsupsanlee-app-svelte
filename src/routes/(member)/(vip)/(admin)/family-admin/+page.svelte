<!-- src/routes/(member)/(vip)/(admin)/family-admin/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { data } = $props();

    let filter = $state<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    let filtered = $derived(
        filter === 'all' ? data.allPlaces : data.allPlaces.filter(p => p.status === filter)
    );

    let counts = $derived({
        pending: data.allPlaces.filter(p => p.status === 'pending').length,
        approved: data.allPlaces.filter(p => p.status === 'approved').length,
        rejected: data.allPlaces.filter(p => p.status === 'rejected').length,
    });

    const typeConfig: Record<string, { emoji: string; label: string }> = {
        park:         { emoji: '🌳', label: 'Park' },
        playground:   { emoji: '🛝', label: 'Playground' },
        trail:        { emoji: '🥾', label: 'Trail' },
        sports_field: { emoji: '⚽', label: 'Sports Field' },
        swimming:     { emoji: '🏊', label: 'Swimming' },
        picnic:       { emoji: '🧺', label: 'Picnic Area' },
    };
</script>

<div class="max-w-5xl mx-auto p-6 pb-20">
    <div class="mb-8">
        <h1 class="text-3xl font-black text-slate-900">Family Hub Admin 👨‍👩‍👧‍👦</h1>
        <p class="text-slate-500 mt-1">Review and approve parks, trails, and family spots.</p>
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
            <p class="font-bold text-slate-400">No places in this category.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each filtered as place}
                {@const typeInfo = typeConfig[place.type] ?? { emoji: '📍', label: place.type }}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <div class="flex items-start justify-between gap-4 flex-wrap">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <span class="text-lg">{typeInfo.emoji}</span>
                                <h3 class="font-black text-slate-900">{place.name}</h3>
                                <span class="px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-widest
                                    {place.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                     place.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                     'bg-red-100 text-red-600'}">
                                    {place.status}
                                </span>
                                <span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-slate-100 text-slate-600 uppercase tracking-widest">
                                    {typeInfo.label}
                                </span>
                                {#if place.isFeatured}
                                    <span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-100 text-amber-700 uppercase">✨ Featured</span>
                                {/if}
                            </div>
                            <p class="text-sm text-slate-500">
                                Submitted by {place.authorName || place.authorEmail || 'Unknown'}
                            </p>

                            {#if place.description}
                                <p class="text-sm text-slate-600 mt-2 line-clamp-2">{place.description}</p>
                            {/if}

                            <div class="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                                {#if place.address}
                                    <span>📍 {place.address}</span>
                                {/if}
                                {#if place.ageRange}
                                    <span>👶 {place.ageRange}</span>
                                {/if}
                                {#if place.type === 'trail' && place.trailLength}
                                    <span>📏 {place.trailLength}</span>
                                {/if}
                                {#if place.type === 'trail' && place.trailDifficulty}
                                    <span class="capitalize">⛰ {place.trailDifficulty}</span>
                                {/if}
                            </div>

                            {#if place.features?.length > 0}
                                <div class="mt-2 flex flex-wrap gap-1">
                                    {#each place.features.slice(0, 5) as feature}
                                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">{feature}</span>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col gap-2 min-w-[120px]">
                            {#if place.status !== 'approved'}
                                <form method="POST" action="?/approve" use:enhance>
                                    <input type="hidden" name="id" value={place.id} />
                                    <button class="w-full px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all">
                                        ✓ Approve
                                    </button>
                                </form>
                            {/if}
                            {#if place.status !== 'rejected'}
                                <form method="POST" action="?/reject" use:enhance>
                                    <input type="hidden" name="id" value={place.id} />
                                    <button class="w-full px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all">
                                        ✕ Reject
                                    </button>
                                </form>
                            {/if}
                            <form method="POST" action="?/toggleFeatured" use:enhance>
                                <input type="hidden" name="id" value={place.id} />
                                <input type="hidden" name="isFeatured" value={String(place.isFeatured)} />
                                <button class="w-full px-4 py-2 {place.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'} rounded-xl text-xs font-black hover:opacity-80 transition-all">
                                    {place.isFeatured ? '★ Unfeature' : '☆ Feature'}
                                </button>
                            </form>
                            <a href="/family/parks/{place.id}"
                                class="w-full text-center px-4 py-2 bg-sky-50 text-sky-600 border border-sky-100 rounded-xl text-xs font-black hover:bg-sky-100 transition-all">
                                View →
                            </a>
                            <form method="POST" action="?/delete" use:enhance>
                                <input type="hidden" name="id" value={place.id} />
                                <button
                                    onclick={(e) => { if (!confirm('Delete this place permanently?')) e.preventDefault(); }}
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