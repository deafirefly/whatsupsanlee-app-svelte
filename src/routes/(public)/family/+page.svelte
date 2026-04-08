<!-- src/routes/(public)/family/+page.svelte -->
<script lang="ts">
    let { data } = $props();

    let activeTab = $state<'events' | 'parks' | 'trails'>('events');

    function formatDate(dateStr: string) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
    }

    function formatTime(t: string | null) {
        if (!t) return '';
        const [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
    }

    const typeConfig: Record<string, { emoji: string; label: string; color: string }> = {
        park:         { emoji: '🌳', label: 'Park',           color: 'bg-green-50 text-green-700 border-green-100' },
        playground:   { emoji: '🛝', label: 'Playground',     color: 'bg-yellow-50 text-yellow-700 border-yellow-100' },
        trail:        { emoji: '🥾', label: 'Trail',          color: 'bg-amber-50 text-amber-700 border-amber-100' },
        sports_field: { emoji: '⚽', label: 'Sports Field',   color: 'bg-blue-50 text-blue-700 border-blue-100' },
        swimming:     { emoji: '🏊', label: 'Swimming',       color: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
        picnic:       { emoji: '🧺', label: 'Picnic Area',    color: 'bg-rose-50 text-rose-700 border-rose-100' },
    };

    const difficultyConfig: Record<string, { label: string; color: string }> = {
        easy:     { label: 'Easy',     color: 'bg-green-100 text-green-700' },
        moderate: { label: 'Moderate', color: 'bg-amber-100 text-amber-700' },
        hard:     { label: 'Hard',     color: 'bg-red-100 text-red-700' },
    };

    const eventCategoryEmoji: Record<string, string> = {
        community: '🎉', movie: '🎬', arts: '🎨', school: '🏫',
        church: '⛪', farmers_market: '🌽', other: '📦'
    };
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Header -->
    <div class="bg-gradient-to-br from-sky-500 to-blue-600 text-white">
        <div class="max-w-5xl mx-auto px-6 py-12">
            <div class="text-center">
                <div class="text-5xl mb-3">👨‍👩‍👧‍👦</div>
                <h1 class="text-4xl font-black">Family Activities Hub</h1>
                <p class="text-sky-200 mt-2 text-lg">Things to do with kids in Lee County</p>
                <div class="flex gap-3 justify-center mt-6 flex-wrap">
                    <a href="/family/parks/submit"
                        class="px-6 py-3 bg-white text-sky-700 font-black rounded-full shadow-lg hover:scale-105 transition-all text-sm">
                        + Submit a Place
                    </a>
                    <a href="/events/{new Date().toISOString().split('T')[0]}"
                        class="px-6 py-3 bg-white/20 text-white font-black rounded-full hover:bg-white/30 transition-all text-sm">
                        📅 All Events
                    </a>
                </div>
            </div>
        </div>

        <!-- Tab Navigation -->
        <div class="max-w-5xl mx-auto px-6 pb-0">
            <div class="flex gap-1 bg-white/10 rounded-2xl p-1 max-w-md mx-auto">
                {#each [
                    { key: 'events', label: 'Events', emoji: '🎉' },
                    { key: 'parks', label: 'Parks', emoji: '🌳' },
                    { key: 'trails', label: 'Trails', emoji: '🥾' },
                ] as tab}
                    <button onclick={() => activeTab = tab.key as any}
                        class="flex-1 py-2.5 rounded-xl text-sm font-black transition-all
                        {activeTab === tab.key ? 'bg-white text-sky-700 shadow-sm' : 'text-white/80 hover:text-white'}">
                        {tab.emoji} {tab.label}
                        {#if tab.key === 'events'}
                            <span class="ml-1 text-[10px] opacity-70">({data.familyEvents.length})</span>
                        {:else if tab.key === 'parks'}
                            <span class="ml-1 text-[10px] opacity-70">({data.parks.length})</span>
                        {:else}
                            <span class="ml-1 text-[10px] opacity-70">({data.trails.length})</span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-8">

        <!-- EVENTS TAB -->
        {#if activeTab === 'events'}
            {#if data.familyEvents.length === 0}
                <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <span class="text-4xl block mb-4">📭</span>
                    <h3 class="text-xl font-bold text-slate-900">No family events coming up</h3>
                    <p class="text-slate-500 text-sm mt-1">Check back soon or post a family-friendly event!</p>
                    <a href="/events/create"
                        class="mt-6 inline-block bg-sky-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-sky-700 transition-all">
                        + Post a Family Event
                    </a>
                </div>
            {:else}
                <div class="space-y-4">
                    {#each data.familyEvents as event}
                        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6">
                            <div class="flex gap-4">
                                <!-- Date badge -->
                                <div class="flex-shrink-0 bg-sky-50 border border-sky-100 rounded-2xl p-3 text-center min-w-[60px]">
                                    <p class="text-[10px] font-black text-sky-400 uppercase">
                                        {new Date(event.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                                    </p>
                                    <p class="text-2xl font-black text-sky-600 leading-tight">
                                        {new Date(event.startDate + 'T00:00:00').getDate()}
                                    </p>
                                </div>

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-start gap-2 flex-wrap mb-1">
                                        <span class="px-2 py-0.5 bg-sky-50 text-sky-600 border border-sky-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            👨‍👩‍👧 Family Friendly
                                        </span>
                                        <span class="text-sm">{eventCategoryEmoji[event.category] ?? '📦'}</span>
                                    </div>
                                    <h3 class="font-black text-slate-900 text-lg">{event.title}</h3>
                                    {#if event.description}
                                        <p class="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                                    {/if}
                                    <div class="flex flex-wrap gap-4 mt-2 text-xs text-slate-500">
                                        {#if event.startTime}
                                            <span>🕐 {formatTime(event.startTime)}{event.endTime ? ` – ${formatTime(event.endTime)}` : ''}</span>
                                        {/if}
                                        {#if event.locationName || event.address}
                                            <span>📍 {event.locationName ?? event.address}</span>
                                        {/if}
                                    </div>
                                </div>

                                <a href="/events/{event.startDate}"
                                    class="flex-shrink-0 self-center px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-black hover:bg-sky-700 transition-all">
                                    View →
                                </a>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}

        <!-- PARKS TAB -->
        {#if activeTab === 'parks'}
            {#if data.parks.length === 0}
                <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <span class="text-4xl block mb-4">🌳</span>
                    <h3 class="text-xl font-bold text-slate-900">No parks listed yet</h3>
                    <p class="text-slate-500 text-sm mt-1">Be the first to add a local park!</p>
                    <a href="/family/parks/submit"
                        class="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-green-700 transition-all">
                        + Submit a Park
                    </a>
                </div>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {#each data.parks as place}
                        {@const typeInfo = typeConfig[place.type] ?? typeConfig.park}
                        <a href="/family/parks/{place.id}" class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden block">
                            {#if place.imageUrl}
                                <div class="w-full h-40 overflow-hidden">
                                    <img src={place.imageUrl} alt={place.name} class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                            {:else}
                                <div class="w-full h-40 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                                    <span class="text-6xl opacity-40">{typeInfo.emoji}</span>
                                </div>
                            {/if}
                            <div class="p-5">
                                <div class="flex items-center gap-2 mb-2 flex-wrap">
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase border {typeInfo.color}">
                                        {typeInfo.emoji} {typeInfo.label}
                                    </span>
                                    {#if place.isFeatured}
                                        <span class="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black border border-amber-100">✨ Featured</span>
                                    {/if}
                                    {#if place.ageRange && place.ageRange !== 'all'}
                                        <span class="px-2 py-0.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black border border-sky-100">
                                            {place.ageRange === 'toddler' ? '👶 Toddlers' : place.ageRange === 'kids' ? '🧒 Kids' : '🧑 Teens'}
                                        </span>
                                    {/if}
                                </div>
                                <h3 class="font-black text-slate-900 text-lg">{place.name}</h3>
                                {#if place.description}
                                    <p class="text-sm text-slate-500 mt-1 line-clamp-2">{place.description}</p>
                                {/if}
                                {#if place.address}
                                    <p class="text-xs text-slate-400 mt-2">📍 {place.address}</p>
                                {/if}
                                {#if place.features?.length > 0}
                                    <div class="mt-3 flex flex-wrap gap-1">
                                        {#each place.features.slice(0, 3) as feature}
                                            <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">{feature}</span>
                                        {/each}
                                        {#if place.features.length > 3}
                                            <span class="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full text-[10px] font-bold">+{place.features.length - 3}</span>
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        {/if}

        <!-- TRAILS TAB -->
        {#if activeTab === 'trails'}
            {#if data.trails.length === 0}
                <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <span class="text-4xl block mb-4">🥾</span>
                    <h3 class="text-xl font-bold text-slate-900">No trails listed yet</h3>
                    <p class="text-slate-500 text-sm mt-1">Know a great trail? Add it!</p>
                    <a href="/family/parks/submit"
                        class="mt-6 inline-block bg-amber-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-amber-700 transition-all">
                        + Submit a Trail
                    </a>
                </div>
            {:else}
                <div class="space-y-4">
                    {#each data.trails as trail}
                        <a href="/family/parks/{trail.id}" class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 block">
                            <div class="flex gap-4">
                                <div class="flex-shrink-0 w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl">
                                    🥾
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 flex-wrap mb-1">
                                        {#if trail.trailDifficulty}
                                            {@const diff = difficultyConfig[trail.trailDifficulty]}
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-black {diff?.color ?? 'bg-slate-100 text-slate-600'}">
                                                {diff?.label ?? trail.trailDifficulty}
                                            </span>
                                        {/if}
                                        {#if trail.trailLength}
                                            <span class="text-xs text-slate-500 font-bold">📏 {trail.trailLength}</span>
                                        {/if}
                                    </div>
                                    <h3 class="font-black text-slate-900 text-lg">{trail.name}</h3>
                                    {#if trail.description}
                                        <p class="text-sm text-slate-500 mt-1 line-clamp-2">{trail.description}</p>
                                    {/if}
                                    {#if trail.address}
                                        <p class="text-xs text-slate-400 mt-1">📍 {trail.address}</p>
                                    {/if}
                                    {#if trail.features?.length > 0}
                                        <div class="mt-2 flex flex-wrap gap-1">
                                            {#each trail.features.slice(0, 4) as feature}
                                                <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">{feature}</span>
                                            {/each}
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        {/if}

    </div>
</div>