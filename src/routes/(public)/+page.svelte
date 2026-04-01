<script lang="ts">
	let { data } = $props();

    let activeCategory = $state('all');
    let searchQuery = $state('');

    let filteredListings = $derived(
        data.approvedListings.filter(item => {
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                (item.businessName?.toLowerCase().includes(searchLower)) || 
                (item.bio?.toLowerCase().includes(searchLower));
            return matchesCategory && matchesSearch;
        })
    );
</script>

<div class="min-h-screen flex flex-col bg-background">

    <!-- Hero Section -->
	<main class="flex-1 flex flex-col items-center justify-center p-6 text-center">
		<div class="max-w-3xl space-y-6">
			<h1 class="text-5xl md:text-6xl font-extrabold tracking-tighter text-indigo-600">
				Welcome to 
			</h1>
			<h1 class="text-5xl md:text-6xl font-extrabold tracking-tighter text-indigo-600">
                <span class="italic text-indigo-600">What's Up SanLee!</span>
            </h1>
			<p class="text-lg text-muted-foreground max-w-[600px] mx-auto">
				Experience the power of tiered access. Whether you're a Member or a VIP, 
				everything you need is just one click away.
			</p>
			<div class="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/login" class="px-8 py-4 bg-indigo-600 text-slate-50 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
					Enter Dashboard
				</a>
				<div class="px-8 py-4 border rounded-full font-bold text-muted-foreground italic">
					Future Content Coming Soon...
				</div>
			</div>
		</div>
	</main>

    <!-- Community Listings -->
	<div class="max-w-7xl mx-auto w-full p-6">
        <header class="mb-12 text-center">
            <h1 class="text-4xl font-extrabold text-slate-900 mb-4">Discover Our Community</h1>
            <p class="text-lg text-muted-foreground">Local food trucks, farmers, and creators in one place.</p>
        </header>

        <div class="max-w-2xl mx-auto mb-8">
            <div class="relative group">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span class="text-xl group-focus-within:scale-110 transition-transform">🔍</span>
                </div>
                <input 
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search by name, menu, or craft..."
                    class="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm 
                           focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none 
                           transition-all duration-300 text-lg placeholder:text-slate-400"
                />
                {#if searchQuery}
                    <button 
                        onclick={() => searchQuery = ''}
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        ✕
                    </button>
                {/if}
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-3 ml-2">
                Found {filteredListings.length} results
            </p>
        </div>

        {#if filteredListings.length === 0}
            <div class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <span class="text-4xl mb-4 block">🔍</span>
                <h3 class="text-xl font-bold text-slate-900">No matches found</h3>
                <p class="text-slate-500">We couldn't find any listings for "{searchQuery}".</p>
                <button 
                    onclick={() => { searchQuery = ''; activeCategory = 'all'; }} 
                    class="mt-4 text-indigo-600 font-bold hover:underline"
                >
                    Clear all filters
                </button>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {#each filteredListings as item}
                    <div class="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col">

                        <div class="relative w-full aspect-video overflow-hidden">
                            {#if item.imageUrl}
                                <img
                                    src={item.imageUrl}
                                    alt={item.businessName}
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            {:else}
                                <div class="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:from-indigo-600 group-hover:to-pink-500 transition-all duration-500 flex items-center justify-center">
                                    <span class="text-6xl opacity-40">
                                        {item.category === 'food_truck' ? '🚚' : item.category === 'farmer' ? '👨‍🌾' : item.category === 'photographer' ? '📸' : '🎨'}
                                    </span>
                                </div>
                            {/if}

                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                {#if item.isFeatured || item.isVip}
                                    <div class="flex items-center gap-2 mb-1">
                                        {#if item.isFeatured}
                                            <span class="px-2 py-0.5 bg-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                                                ✨ Featured
                                            </span>
                                        {/if}
                                        {#if item.isVip}
                                            <span class="px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest">
                                                ⭐ VIP
                                            </span>
                                        {/if}
                                    </div>
                                {/if}
                                <h2 class="text-white font-black text-lg leading-tight line-clamp-1">
                                    {item.businessName}
                                </h2>
                                <span class="text-white/70 text-xs font-bold uppercase tracking-widest">
                                    {item.category?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        <div class="p-4 flex flex-col flex-1">
                            {#if item.bio && item.bio.trim() !== ''}
                                <p class="text-sm text-slate-600 line-clamp-2 leading-relaxed flex-1">
                                    {item.bio}
                                </p>
                            {:else}
                                <p class="text-sm text-slate-400 italic flex-1">No description yet.</p>
                            {/if}

                            <div class="mt-3 space-y-1">
                                {#if item.scheduleSummary}
                                    <div class="flex items-center gap-2 text-xs text-slate-500">
                                        <span>🕐</span>
                                        <span class="truncate">{item.scheduleSummary.split('|')[0].trim()}</span>
                                    </div>
                                {/if}
                                {#if item.address}
                                    <div class="flex items-center gap-2 text-xs text-slate-500">
                                        <span>📍</span>
                                        <span class="truncate">{item.address.split(',')[0]}</span>
                                    </div>
                                {/if}
                            </div>
                        </div>

                        <div class="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                            <a href={`/listings/${item.id}`}
                                class="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest transition-colors">
                                View Profile
                            </a>
                            <button
                                onclick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/listings/${item.id}`);
                                }}
                                class="text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Share listing"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                </svg>
                            </button>
                        </div>

                    </div>
                {/each}
            </div>
        {/if}

        <!-- Upcoming Yard Sales — cleanly below the listings grid -->
        {#if data.upcomingYardSales?.length > 0}
            <div class="mt-12 pt-10 border-t border-slate-100">
                <h2 class="text-2xl font-black text-slate-900 mb-6">🏷️ Upcoming Yard Sales</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {#each data.upcomingYardSales as sale}
                        <a href="/yard-sales/{sale.id}" class="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all block">
                            <p class="font-black text-slate-900">{sale.title}</p>
                            <p class="text-sm text-slate-500 mt-1">📅 {sale.saleDate} · {sale.address}</p>
                            <div class="mt-2 flex flex-wrap gap-1">
                                {#each sale.items.slice(0, 3) as item}
                                    <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{item}</span>
                                {/each}
                            </div>
                        </a>
                    {/each}
                </div>
                <a href="/yard-sales" class="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline">View all yard sales →</a>
            </div>
        {/if}

    </div><!-- end max-w-7xl -->

</div><!-- end min-h-screen -->