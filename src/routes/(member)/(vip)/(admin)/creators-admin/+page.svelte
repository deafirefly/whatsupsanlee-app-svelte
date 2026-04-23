<!-- src/routes/(member)/(vip)/(admin)/creators-admin/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { data } = $props();
    let filter = $state<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    let filtered = $derived(
        filter === 'all' ? data.allCreators : data.allCreators.filter(c => c.status === filter)
    );

    let counts = $derived({
        pending: data.allCreators.filter(c => c.status === 'pending').length,
        approved: data.allCreators.filter(c => c.status === 'approved').length,
        rejected: data.allCreators.filter(c => c.status === 'rejected').length,
    });

    const platformEmojis: Record<string, string> = {
        youtube: '▶️', tiktok: '🎵', instagram: '📸',
        twitch: '🎮', podcast: '🎙️',
    };
</script>

<div class="max-w-5xl mx-auto p-6 pb-20">
    <div class="mb-8">
        <h1 class="text-3xl font-black text-slate-900">Creators Admin 📱</h1>
        <p class="text-slate-500 mt-1">Review and approve local creator profiles.</p>
    </div>

    <!-- Filter tabs -->
    <div class="flex gap-2 mb-6 flex-wrap">
        {#each [['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']] as [val, label]}
            <button onclick={() => filter = val as any}
                class="px-4 py-2 rounded-xl text-sm font-bold transition-all
                {filter === val ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}">
                {label}
                {#if val !== 'all'}
                    <span class="ml-1 opacity-70">({counts[val as keyof typeof counts]})</span>
                {/if}
            </button>
        {/each}
    </div>

    {#if filtered.length === 0}
        <div class="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p class="font-bold text-slate-400">No creators in this category.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each filtered as creator}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <div class="flex items-start justify-between gap-4 flex-wrap">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <h3 class="font-black text-slate-900">{creator.name}</h3>
                                <span class="px-2 py-0.5 text-[10px] font-black rounded-full uppercase tracking-widest
                                    {creator.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                     creator.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                     'bg-red-100 text-red-600'}">
                                    {creator.status}
                                </span>
                                {#if creator.isFeatured}
                                    <span class="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-100 text-amber-700 uppercase">✨ Featured</span>
                                {/if}
                            </div>
                            <p class="text-sm text-slate-500">
                                Submitted by {creator.authorName || creator.authorEmail}
                                {#if creator.area} · 📍 {creator.area}{/if}
                            </p>
                            {#if creator.tagline}
                                <p class="text-sm text-slate-600 mt-1 italic">"{creator.tagline}"</p>
                            {/if}

                            <!-- Platforms -->
                            <div class="mt-2 flex flex-wrap gap-1.5">
                                {#each Object.entries(platformEmojis) as [platform, emoji]}
                                    {#if (creator as any)[platform]}
                                        <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                            {emoji} {platform}
                                        </span>
                                    {/if}
                                {/each}
                            </div>

                            <!-- Categories -->
                            {#if creator.contentCategories.length > 0}
                                <div class="mt-2 flex flex-wrap gap-1">
                                    {#each creator.contentCategories as cat}
                                        <span class="px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full text-[10px] font-bold">{cat}</span>
                                    {/each}
                                </div>
                            {/if}
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-col gap-2 min-w-[120px]">
                            {#if creator.status !== 'approved'}
                                <form method="POST" action="?/approve" use:enhance>
                                    <input type="hidden" name="id" value={creator.id} />
                                    <button class="w-full px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all">✓ Approve</button>
                                </form>
                            {/if}
                            {#if creator.status !== 'rejected'}
                                <form method="POST" action="?/reject" use:enhance>
                                    <input type="hidden" name="id" value={creator.id} />
                                    <button class="w-full px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all">✕ Reject</button>
                                </form>
                            {/if}
                            <form method="POST" action="?/toggleFeatured" use:enhance>
                                <input type="hidden" name="id" value={creator.id} />
                                <input type="hidden" name="isFeatured" value={String(creator.isFeatured)} />
                                <button class="w-full px-4 py-2 {creator.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'} rounded-xl text-xs font-black hover:opacity-80 transition-all">
                                    {creator.isFeatured ? '★ Unfeature' : '☆ Feature'}
                                </button>
                            </form>
                            <a href="/creators/{creator.id}"
                                class="w-full text-center px-4 py-2 bg-violet-50 text-violet-600 border border-violet-100 rounded-xl text-xs font-black hover:bg-violet-100 transition-all">
                                View →
                            </a>
                            <form method="POST" action="?/delete" use:enhance>
                                <input type="hidden" name="id" value={creator.id} />
                                <button onclick={(e) => { if (!confirm('Delete this creator profile?')) e.preventDefault(); }}
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