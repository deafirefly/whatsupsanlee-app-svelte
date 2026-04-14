<!-- src/routes/(public)/family/parks/[id]/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import ShareBar from '$lib/components/ShareBar.svelte';
    let { data } = $props();
    const { place, currentUserId, isAdmin } = data;

    const typeConfig: Record<string, { emoji: string; label: string }> = {
        park:         { emoji: '🌳', label: 'Park' },
        playground:   { emoji: '🛝', label: 'Playground' },
        trail:        { emoji: '🥾', label: 'Trail' },
        sports_field: { emoji: '⚽', label: 'Sports Field' },
        swimming:     { emoji: '🏊', label: 'Swimming Area' },
        picnic:       { emoji: '🧺', label: 'Picnic Area' },
    };

    const typeInfo = typeConfig[place.type] ?? { emoji: '📍', label: place.type };
    const isTrail = place.type === 'trail';

    const difficultyColors: Record<string, string> = {
        easy: 'bg-green-100 text-green-700',
        moderate: 'bg-amber-100 text-amber-700',
        hard: 'bg-red-100 text-red-700',
    };
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Back Nav -->
    <div class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/family" class="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                ← Back to Family Hub
            </a>
            <div class="flex items-center gap-2">
                {#if currentUserId === place.userId || isAdmin}
                    <form method="POST" action="?/delete" use:enhance>
                        <button onclick={(e) => { if (!confirm('Delete this place?')) e.preventDefault(); }}
                            class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
                            🗑 Delete
                        </button>
                    </form>
                {/if}
                <a href="/family/parks/submit"
                    class="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-black hover:bg-sky-700 transition-all">
                    + Submit a Place
                </a>
            </div>
        </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-8 space-y-6">

        <!-- Header -->
        <div class="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">
                {typeInfo.emoji}
            </div>
            <div class="relative z-10">
                <div class="flex flex-wrap gap-2 mb-3">
                    <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                        {typeInfo.emoji} {typeInfo.label}
                    </span>
                    {#if place.isFeatured}
                        <span class="px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest">✨ Featured</span>
                    {/if}
                    {#if isTrail && place.trailDifficulty}
                        <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest capitalize">
                            {place.trailDifficulty}
                        </span>
                    {/if}
                </div>
                <h1 class="text-3xl font-black">{place.name}</h1>
                {#if place.ageRange && place.ageRange !== 'all'}
                    <p class="text-sky-200 mt-1">
                        Best for: {place.ageRange === 'toddler' ? '👶 Toddlers' : place.ageRange === 'kids' ? '🧒 Kids' : '🧑 Teens'}
                    </p>
                {:else}
                    <p class="text-sky-200 mt-1">👨‍👩‍👧‍👦 All ages welcome</p>
                {/if}
            </div>
        </div>

        <!-- Photo -->
        {#if place.imageUrl}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <img src={place.imageUrl} alt={place.name} class="w-full h-auto" />
            </div>
        {/if}

        <!-- About -->
        {#if place.description}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">About</h2>
                <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{place.description}</p>
            </div>
        {/if}

        <!-- Trail Details -->
        {#if isTrail && (place.trailLength || place.trailDifficulty)}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Trail Info</h2>
                <div class="grid grid-cols-2 gap-4">
                    {#if place.trailLength}
                        <div class="bg-slate-50 rounded-2xl p-4 text-center">
                            <p class="text-2xl font-black text-slate-900">{place.trailLength}</p>
                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Distance</p>
                        </div>
                    {/if}
                    {#if place.trailDifficulty}
                        <div class="bg-slate-50 rounded-2xl p-4 text-center">
                            <p class="text-lg font-black capitalize {difficultyColors[place.trailDifficulty] ?? 'text-slate-900'} px-3 py-1 rounded-xl inline-block">
                                {place.trailDifficulty}
                            </p>
                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Difficulty</p>
                        </div>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- Features -->
        {#if place.features?.length > 0}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Features & Amenities</h2>
                <div class="flex flex-wrap gap-2">
                    {#each place.features as feature}
                        <span class="px-4 py-2 bg-sky-50 border border-sky-100 text-sky-700 rounded-full text-sm font-black">
                            {feature}
                        </span>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Location -->
        {#if place.address || place.locationPin}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">Location</h2>
                {#if place.address}
                    <p class="font-bold text-slate-900">📍 {place.address}</p>
                {/if}
                {#if place.locationPin}
                    <a href={place.locationPin} target="_blank" rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl font-black text-sm hover:bg-sky-700 transition-all">
                        🗺️ Get Directions
                    </a>
                {:else if place.address}
                    <a href="https://maps.google.com/?q={encodeURIComponent(place.address)}"
                        target="_blank" rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl font-black text-sm hover:bg-sky-700 transition-all">
                        🗺️ Search on Google Maps
                    </a>
                {/if}
            </div>
        {/if}

        <!-- Share -->
        <ShareBar title={place.name} description={place.type.replace('_', ' ')} />

        <div class="text-center pt-4">
            <a href="/family" class="text-sm font-bold text-sky-600 hover:underline">← Back to Family Hub</a>
        </div>

    </div>
</div>