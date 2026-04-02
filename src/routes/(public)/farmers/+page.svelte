<!-- src/routes/(public)/farmers/+page.svelte -->
<script lang="ts">
    let { data } = $props();

    let searchQuery = $state('');
    let activeFilter = $state('all');

    const produceFilters = [
        'all', 'Vegetables', 'Fruits', 'Eggs', 'Honey', 'Herbs',
        'Meat', 'Dairy', 'Baked Goods', 'Flowers', 'Plants/Seedlings'
    ];

    let filtered = $derived(
        data.farmers.filter(f => {
            const matchesSearch = !searchQuery ||
                f.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.produceCategories.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesFilter = activeFilter === 'all' ||
                f.produceCategories.includes(activeFilter);

            return matchesSearch && matchesFilter;
        })
    );
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Header -->
    <div class="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div class="max-w-5xl mx-auto px-6 py-12 text-center">
            <div class="text-5xl mb-3">🌾</div>
            <h1 class="text-4xl font-black">Farmers Market</h1>
            <p class="text-green-200 mt-2 text-lg">Fresh local produce from Lee County farmers</p>
            <div class="flex gap-3 justify-center mt-6 flex-wrap">
                <a href="/farmers/create"
                    class="px-6 py-3 bg-white text-green-700 font-black rounded-full shadow-lg hover:scale-105 transition-all text-sm">
                    + List Your Farm
                </a>
                <a href="/"
                    class="px-6 py-3 bg-white/20 text-white font-black rounded-full hover:bg-white/30 transition-all text-sm">
                    ← Back to Community
                </a>
            </div>
        </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-8 space-y-6">

        <!-- Search -->
        <div class="relative">
            <span class="absolute left-4 top-4 text-slate-400">🔍</span>
            <input type="text" bind:value={searchQuery}
                placeholder="Search farms, produce..."
                class="w-full pl-11 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm focus:border-green-500 focus:ring-4 focus:ring-green-50 outline-none text-sm" />
        </div>

        <!-- Produce Filter -->
        <div class="flex gap-2 overflow-x-auto pb-2">
            {#each produceFilters as filter}
                <button onclick={() => activeFilter = filter}
                    class="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all border
                    {activeFilter === filter
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-green-300'}">
                    {filter === 'all' ? '🌱 All' : filter}
                </button>
            {/each}
        </div>

        <!-- Results count -->
        <p class="text-xs font-black text-slate-400 uppercase tracking-widest">
            {filtered.length} farm{filtered.length !== 1 ? 's' : ''} found
        </p>

        <!-- Farmer Cards -->
        {#if filtered.length === 0}
            <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <span class="text-4xl block mb-4">🌱</span>
                <h3 class="text-xl font-bold text-slate-900">No farms found</h3>
                <p class="text-slate-500 text-sm mt-1">Try a different search or filter.</p>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each filtered as farmer}
                    <a href="/farmers/{farmer.id}" class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden block">

                        <!-- Card Header -->
                        <div class="bg-gradient-to-br from-green-500 to-emerald-600 p-6 relative">
                            <div class="absolute -right-4 -top-4 text-white/10 text-8xl font-black select-none">🌾</div>
                            <div class="relative z-10">
                                {#if farmer.isFeatured}
                                    <span class="px-2 py-0.5 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest mb-2 inline-block">✨ Featured</span>
                                {/if}
                                {#if farmer.isOrganic}
                                    <span class="px-2 py-0.5 bg-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest mb-2 inline-block ml-1">🌿 Organic</span>
                                {/if}
                                <h3 class="font-black text-white text-xl">{farmer.farmName}</h3>
                                <p class="text-green-200 text-sm mt-0.5">by {farmer.contactName}</p>
                            </div>
                        </div>

                        <!-- Card Content -->
                        <div class="p-5 space-y-3">

                            {#if farmer.currentAvailabilityNote}
                                <div class="bg-green-50 border border-green-100 rounded-2xl px-4 py-2">
                                    <p class="text-xs font-black text-green-700 uppercase tracking-widest mb-0.5">Available Now</p>
                                    <p class="text-sm text-green-800 font-bold">{farmer.currentAvailabilityNote}</p>
                                </div>
                            {/if}

                            {#if farmer.bio}
                                <p class="text-sm text-slate-500 line-clamp-2">{farmer.bio}</p>
                            {/if}

                            <!-- Produce tags -->
                            {#if farmer.produceCategories?.length > 0}
                                <div class="flex flex-wrap gap-1.5">
                                    {#each farmer.produceCategories.slice(0, 5) as cat}
                                        <span class="px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-bold">{cat}</span>
                                    {/each}
                                    {#if farmer.produceCategories.length > 5}
                                        <span class="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">+{farmer.produceCategories.length - 5} more</span>
                                    {/if}
                                </div>
                            {/if}

                            <!-- Info row -->
                            <div class="flex flex-wrap gap-3 text-xs text-slate-500 pt-1">
                                {#if farmer.farmAddress}
                                    <span>📍 {farmer.farmAddress.split(',')[0]}</span>
                                {/if}
                                {#if farmer.marketsAttended?.length > 0}
                                    <span>🏪 {farmer.marketsAttended.length} market{farmer.marketsAttended.length > 1 ? 's' : ''}</span>
                                {/if}
                                {#if farmer.seasonalAvailability?.length > 0}
                                    <span>📅 {farmer.seasonalAvailability.join(', ')}</span>
                                {/if}
                            </div>

                            <!-- Feature badges -->
                            <div class="flex flex-wrap gap-1.5 pt-1">
                                {#if farmer.isUpick}
                                    <span class="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black">🍓 U-Pick</span>
                                {/if}
                                {#if farmer.acceptsSnapEbt}
                                    <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black">💳 SNAP/EBT</span>
                                {/if}
                                {#if farmer.offersDelivery}
                                    <span class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[10px] font-black">🚗 Delivery</span>
                                {/if}
                                {#if farmer.acceptsPreorders}
                                    <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black">📦 Pre-orders</span>
                                {/if}
                            </div>
                        </div>

                    </a>
                {/each}
            </div>
        {/if}

    </div>
</div>