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
            <a href="/about" class="px-4 py-2 bg-indigo-600 text-slate-50 rounded-md text-sm font-medium hover:bg-slate-800 transition-all ">
                About Us
            </a>
            <a href="/feed" class="px-4 py-2 bg-indigo-600 text-slate-50 rounded-md text-sm font-medium hover:bg-slate-800 transition-all ">
            📣 Feed
            </a>
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

    <footer class="p-8 border-t">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-xs text-muted-foreground">&copy; 2026 WhatsUp SanLee. All rights reserved.</p>
        <div class="flex items-center gap-6 text-xs">
            <a href="/about" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">About</a>
            <a href="/contact" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">Contact</a>
            <a href="/privacy" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">Privacy</a>
            <a href="/terms" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">Terms</a>
            <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-[#5865F2] text-white rounded-lg font-black hover:opacity-90 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Discord
            </a>
        </div>
    </div>
</footer>
</div>