<!-- src/routes/(public)/creators/+page.svelte -->
<script lang="ts">
    let { data } = $props();

    let searchQuery = $state('');
    let activeCategory = $state('all');

    const categories = [
        'Gaming', 'Food', 'Music', 'Art', 'Local News', 'Podcast',
        'Comedy', 'Education', 'Sports', 'Lifestyle', 'Tech', 'Faith', 'Family', 'Other'
    ];

    const platformConfig: Record<string, { emoji: string; label: string; color: string }> = {
        youtube:   { emoji: '▶️', label: 'YouTube',   color: 'bg-red-50 text-red-600 border-red-100' },
        tiktok:    { emoji: '🎵', label: 'TikTok',    color: 'bg-slate-900 text-white border-slate-700' },
        instagram: { emoji: '📸', label: 'Instagram', color: 'bg-pink-50 text-pink-600 border-pink-100' },
        twitch:    { emoji: '🎮', label: 'Twitch',    color: 'bg-purple-50 text-purple-600 border-purple-100' },
        podcast:   { emoji: '🎙️', label: 'Podcast',   color: 'bg-amber-50 text-amber-600 border-amber-100' },
        facebook:  { emoji: '👤', label: 'Facebook',  color: 'bg-blue-50 text-blue-600 border-blue-100' },
        twitter:   { emoji: '🐦', label: 'X/Twitter', color: 'bg-slate-50 text-slate-700 border-slate-200' },
        bluesky:   { emoji: '🦋', label: 'Bluesky',   color: 'bg-sky-50 text-sky-600 border-sky-100' },
        website:   { emoji: '🌐', label: 'Website',   color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    };

    function getPlatforms(creator: any) {
        return ['youtube', 'tiktok', 'instagram', 'twitch', 'podcast', 'facebook', 'twitter', 'bluesky', 'website']
            .filter(p => creator[p]);
    }

    let filtered = $derived(
        data.creators.filter(c => {
            const matchesSearch = !searchQuery ||
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.contentCategories.some((cat: string) => cat.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = activeCategory === 'all' ||
                c.contentCategories.includes(activeCategory);
            return matchesSearch && matchesCategory;
        })
    );
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Header -->
    <div class="bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
        <div class="max-w-5xl mx-auto px-6 py-12 text-center">
            <div class="text-5xl mb-3">📱</div>
            <h1 class="text-4xl font-black">Local Creators</h1>
            <p class="text-violet-200 mt-2 text-lg">Lee County's YouTubers, TikTokers, podcasters & more</p>
            <a href="/creators/create"
                class="mt-6 inline-block px-6 py-3 bg-white text-violet-700 font-black rounded-full shadow-lg hover:scale-105 transition-all text-sm">
                + Submit Your Creator Profile
            </a>
        </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-8 space-y-6">

        <!-- Search -->
        <div class="relative">
            <span class="absolute left-4 top-3.5 text-slate-400 text-xl">🔍</span>
            <input type="text" bind:value={searchQuery}
                placeholder="Search creators, categories..."
                class="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl shadow-sm focus:border-violet-500 focus:ring-4 focus:ring-violet-50 outline-none text-sm" />
            {#if searchQuery}
                <button onclick={() => searchQuery = ''}
                    class="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">✕</button>
            {/if}
        </div>

        <!-- Category Filter -->
        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button onclick={() => activeCategory = 'all'}
                class="flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all border
                {activeCategory === 'all' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'}">
                🌟 All
            </button>
            {#each categories as cat}
                <button onclick={() => activeCategory = cat}
                    class="flex-shrink-0 px-4 py-2 rounded-full text-xs font-black transition-all border
                    {activeCategory === cat ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'}">
                    {cat}
                </button>
            {/each}
        </div>

        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {filtered.length} creator{filtered.length !== 1 ? 's' : ''} found
        </p>

        <!-- Creators Grid -->
        {#if filtered.length === 0}
            <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <span class="text-4xl block mb-4">📭</span>
                <h3 class="text-xl font-bold text-slate-900">No creators found</h3>
                <p class="text-slate-500 text-sm mt-1">
                    {searchQuery ? `No results for "${searchQuery}"` : 'Be the first local creator to join!'}
                </p>
                <a href="/creators/create"
                    class="mt-6 inline-block bg-violet-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-violet-700 transition-all">
                    + Submit Your Profile
                </a>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each filtered as creator}
                    {@const platforms = getPlatforms(creator)}
                    <a href="/creators/{creator.id}"
                        class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden block group">

                        <!-- Cover / Avatar area -->
                        <div class="relative h-32 bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center overflow-hidden">
                            <div class="absolute inset-0 opacity-10 text-[100px] flex items-center justify-center">📱</div>
                            {#if creator.isFeatured}
                                <span class="absolute top-3 right-3 px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full">✨ Featured</span>
                            {/if}
                            {#if creator.imageUrl}
                                <img src={creator.imageUrl} alt={creator.name}
                                    class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                            {:else}
                                <div class="w-20 h-20 rounded-full bg-white/20 border-4 border-white shadow-lg flex items-center justify-center text-3xl font-black text-white">
                                    {creator.name[0].toUpperCase()}
                                </div>
                            {/if}
                        </div>

                        <div class="p-5">
                            <h3 class="font-black text-slate-900 text-lg group-hover:text-violet-600 transition-colors">{creator.name}</h3>
                            {#if creator.tagline}
                                <p class="text-sm text-slate-500 mt-0.5 italic">{creator.tagline}</p>
                            {/if}
                            {#if creator.area}
                                <p class="text-xs text-slate-400 mt-1">📍 {creator.area}</p>
                            {/if}

                            <!-- Content Categories -->
                            {#if creator.contentCategories.length > 0}
                                <div class="mt-3 flex flex-wrap gap-1.5">
                                    {#each creator.contentCategories.slice(0, 3) as cat}
                                        <span class="px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full text-[10px] font-black border border-violet-100">{cat}</span>
                                    {/each}
                                    {#if creator.contentCategories.length > 3}
                                        <span class="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black">+{creator.contentCategories.length - 3}</span>
                                    {/if}
                                </div>
                            {/if}

                            <!-- Platform icons -->
                            {#if platforms.length > 0}
                                <div class="mt-3 flex flex-wrap gap-1.5">
                                    {#each platforms.slice(0, 5) as platform}
                                        {@const config = platformConfig[platform]}
                                        <span class="px-2 py-1 rounded-lg text-[10px] font-black border {config.color}">
                                            {config.emoji} {config.label}
                                        </span>
                                    {/each}
                                    {#if platforms.length > 5}
                                        <span class="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-black">+{platforms.length - 5}</span>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</div>