<script lang="ts">
	let { data } = $props();

    let activeCategory = $state('all');
    let searchQuery = $state(''); // New search state

    // Advanced filtering: Handles both Category and Search Text
    let filteredListings = $derived(
        data.approvedListings.filter(item => {
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            
            // Adding ?.toLowerCase() handles potential null values safely
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                (item.businessName?.toLowerCase().includes(searchLower)) || 
                (item.bio?.toLowerCase().includes(searchLower));
            
            return matchesCategory && matchesSearch;
        })
    );

</script>

<div class="min-h-screen flex flex-col bg-background">
	<header class="p-6 flex justify-between items-center border-b text-indigo-600">
		<span class="font-bold text-xl tracking-tight">What's Up SanLee!</span>
		<nav class="flex gap-4">
			<a href="/login" class="px-4 py-2 bg-indigo-600 text-slate-50 rounded-md text-sm font-medium hover:bg-slate-800 transition-all shadow-sm">Login</a>
			<a href="/register" class="px-4 py-2 bg-indigo-600 text-slate-50 rounded-md text-sm font-medium hover:opacity-90 transition-all">
				Get Started
			</a>
		</nav>
	</header>

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
				<div class="px-8 py-4 border rounded-full font-bold text-muted-foreground italic ">
					Future Content Coming Soon...
				</div>
			</div>
		</div>
	</main>

	<div class="max-w-7xl mx-auto p-6">
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

    {#if data.approvedListings.length === 0}
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
        <div class="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
            
            <div class="h-24 bg-gradient-to-br from-indigo-500 to-purple-600 relative flex items-end justify-center pb-0 group-hover:from-indigo-600 group-hover:to-pink-500 transition-all duration-500">
                <div class="absolute -bottom-6 bg-white p-3 rounded-2xl shadow-md border border-slate-50 text-3xl group-hover:scale-110 transition-transform duration-500">
                    {item.category === 'food_truck' ? '🚚' : item.category === 'farmer' ? '👨‍🌾' : item.category === 'photographer' ? '📸' : '🎨'}
                </div>
            </div>

            <div class="p-8 pt-10 flex flex-col flex-1">
                <div class="flex justify-center mb-4">
                    <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100">
                        {item.category?.replace('_', ' ')}
                    </span>
                </div>

                <h2 class="text-2xl font-black text-slate-900 text-center mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.businessName}
                </h2>

                <p class="text-sm text-slate-500 text-center line-clamp-2 mb-6 flex-1 italic">
                    "{item.bio}"
                </p>

                <div class="grid grid-cols-2 gap-2 py-4 border-t border-slate-50 mb-6">
                    <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                        <span class="text-[10px] font-black text-slate-400 uppercase">Schedule</span>
                        <span class="text-[11px] font-bold text-slate-700 truncate w-full text-center">
                            {item.scheduleSummary?.split('|')[0]}
                        </span>
                    </div>
                    <div class="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                        <span class="text-[10px] font-black text-slate-400 uppercase">Area</span>
                        <span class="text-[11px] font-bold text-slate-700 truncate w-full text-center">
                            {item.address?.split(',')[0]}
                        </span>
                    </div>
                </div>

                <a href="/listings/{item.id}" class="relative group/btn overflow-hidden rounded-2xl bg-slate-900 px-6 py-4 text-center transition-all">
                    <span class="relative z-10 text-sm font-black text-white">View Full Profile</span>
                    <div class="absolute inset-0 bg-indigo-600 translate-y-[101%] group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                </a>
            </div>
        </div>
    {/each}
</div>

    {/if}
</div>

	<footer class="p-8 border-t text-center text-xs text-muted-foreground">
		&copy; 2026 Portal OS. All rights reserved.
	</footer>
</div>