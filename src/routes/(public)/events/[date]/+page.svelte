<script>
	import { svelte } from "@sveltejs/vite-plugin-svelte";

</script>
<!-- src/routes/(public)/events/[date]/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';

    let { data } = $props();

    let date = $derived(data.date);
    let displayDate = $derived(data.displayDate);
    let isToday = $derived(data.isToday);
    let dayEvents = $derived(data.dayEvents);
    let foodTruckLocations = $derived(data.foodTruckLocations);
    let prevDate = $derived(data.prevDate);
    let nextDate = $derived(data.nextDate);
    let isLoggedIn = $derived(data.isLoggedIn);

    let yardSalesOpen = $state(false);

    let dateLabel = $derived(() => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        const twoDaysAgo = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
        const twoDaysFromNow = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
        const threeDaysAgo = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0];
        const threeDaysFromNow = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

        switch (date) {
            case today: return { text: 'Today', color: 'bg-white/20' };
            case yesterday: return { text: 'Yesterday', color: 'bg-white/20' };
            case tomorrow: return { text: 'Tomorrow', color: 'bg-white/20' };
            case twoDaysAgo: return { text: '2 Days Ago', color: 'bg-white/20' };
            case twoDaysFromNow: return { text: 'In 2 Days', color: 'bg-white/20' };
            case threeDaysAgo: return { text: '3 Days Ago', color: 'bg-white/20' };
            case threeDaysFromNow: return { text: 'In 3 Days', color: 'bg-white/20' };
            default: return null;
        }
    });

    const categoryConfig: Record<string, { emoji: string; label: string; color: string }> = {
        food_truck:     { emoji: '🚚', label: 'Food Truck',     color: 'bg-orange-50 text-orange-600 border-orange-100' },
        open_house:     { emoji: '🏠', label: 'Open House',     color: 'bg-blue-50 text-blue-600 border-blue-100' },
        yard_sale:      { emoji: '🛍️', label: 'Yard Sale',      color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
        farmers_market: { emoji: '🌽', label: "Farmer's Market", color: 'bg-green-50 text-green-600 border-green-100' },
        movie:          { emoji: '🎬', label: 'Movie',          color: 'bg-purple-50 text-purple-600 border-purple-100' },
        community:      { emoji: '🎉', label: 'Community',      color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
        arts:           { emoji: '🎨', label: 'Arts & Crafts',  color: 'bg-rose-50 text-rose-600 border-rose-100' },
        church:         { emoji: '⛪', label: 'Church',         color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
        school:         { emoji: '🏫', label: 'School',         color: 'bg-teal-50 text-teal-600 border-teal-100' },
        other:          { emoji: '📦', label: 'Other',          color: 'bg-slate-50 text-slate-600 border-slate-100' },
    };

    function getCategory(cat: string) {
        return categoryConfig[cat] ?? categoryConfig.other;
    }

    function formatTime(time: string | null) {
        if (!time) return '';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
    }

    let activeFilter = $state('all');

    const filters = [
        { value: 'all', label: 'All', emoji: '📅' },
        { value: 'food_truck', label: 'Food Trucks', emoji: '🚚' },
        { value: 'open_house', label: 'Open Houses', emoji: '🏠' },
        { value: 'yard_sale', label: 'Yard Sales', emoji: '🛍️' },
        { value: 'farmers_market', label: "Farmer's Market", emoji: '🌽' },
        { value: 'movie', label: 'Movies', emoji: '🎬' },
        { value: 'community', label: 'Community', emoji: '🎉' },
        { value: 'other', label: 'Other', emoji: '📦' },
    ];


    let allItems = $derived([
    ...dayEvents,
    ...foodTruckLocations.map(ft => ({
        id: ft.id,
        title: ft.businessName,
        category: 'food_truck',
        locationName: ft.locationName,
        address: ft.address,
        latitude: ft.latitude,
        longitude: ft.longitude,
        startTime: ft.startTime,
        endTime: ft.endTime,
        description: ft.notes,
        imageUrl: ft.imageUrl,
        isFoodTruckSchedule: true
    })),
    ...(data.yardSales ?? []).map(sale => ({
        id: sale.id,
        title: sale.title,
        category: 'yard_sale',
        address: sale.address,
        locationName: null,
        latitude: null,
        longitude: null,
        startTime: sale.startTime,
        endTime: sale.endTime,
        description: sale.description,
        imageUrl: null,
        isFeatured: sale.isFeatured,
        isYardSale: true,
        items: sale.items,
        phone: sale.phone,
    }))
]);

    let filteredItems = $derived(
        activeFilter === 'all'
            ? allItems
            : allItems.filter(item => item.category === activeFilter)
    );

    let totalCount = $derived(allItems.length);
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Back Nav -->
    <div class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                ← Back to Community
            </a>
            {#if isLoggedIn}
                <a href="/events/create"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                    + Post Event
                </a>
            {:else}
                <a href="/login"
                    class="px-4 py-2 border border-indigo-200 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-50 transition-all">
                    Login to Post Event
                </a>
            {/if}
        </div>
    </div>

    <div class="max-w-5xl mx-auto px-6 py-8 space-y-8">

        <!-- Date Header -->
        <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">
                📅
            </div>
            <div class="relative z-10">
                {#if dateLabel()}
                    <span class="px-3 py-1 {dateLabel()?.color} rounded-full text-xs font-black uppercase tracking-widest mb-3 inline-block">
                        {dateLabel()?.text}
                    </span>
                {/if}
                <h1 class="text-3xl font-black">{displayDate}</h1>
                <p class="text-indigo-200 mt-1">
                    {totalCount} {totalCount === 1 ? 'item' : 'items'} in Lee County
                </p>

                <div class="flex items-center gap-3 mt-6 flex-wrap">
                    <a href={`/events/${prevDate}`}
                        class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-black transition-all">
                        ← Previous
                    </a>
                    <a href={`/events/${new Date().toISOString().split('T')[0]}`}
                        class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-black transition-all">
                        Today
                    </a>
                    <a href={`/events/${nextDate}`}
                        class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-black transition-all">
                        Next →
                    </a>
                    <input
                        type="date"
                        value={date}
                        onchange={(e) => {
                            const target = e.target as HTMLInputElement;
                            if (target.value) {
                                window.location.href = `/events/${target.value}`;
                            }
                        }}
                        class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-black transition-all text-white cursor-pointer outline-none border-none [color-scheme:dark]"
                    />
                </div>
            </div>
        </div>

        <!-- Category Filters -->
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {#each filters as filter}
                <button
                    onclick={() => activeFilter = filter.value}
                    class="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all border
                    {activeFilter === filter.value
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}"
                >
                    {filter.emoji} {filter.label}
                </button>
            {/each}
        </div>

        <!-- Events List -->
        {#if filteredItems.length === 0}
            <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <span class="text-4xl block mb-4">📭</span>
                <h3 class="text-xl font-bold text-slate-900">No events for this day</h3>
                <p class="text-slate-500 text-sm mt-1">
                    {activeFilter !== 'all' ? 'Try selecting a different category or ' : ''}
                    Check back later or post your own event!
                </p>
                {#if isLoggedIn}
                    <a href="/events/create"
                        class="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                        + Post an Event
                    </a>
                {/if}
            </div>
        {:else}
            <div class="space-y-4">
                {#each filteredItems as item}
                    {@const cat = getCategory(item.category)}
                    <svelte:element
    this={item.isYardSale ? 'a' : 'div'}
    href={item.isYardSale ? `/yard-sales/${item.id}` : undefined}
    class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden block">
    <div class="flex gap-4 p-6">

                            <div class="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-slate-50 border border-slate-100">
                                {cat.emoji}
                            </div>

                            <div class="flex-1 min-w-0">
                                <div class="flex items-start justify-between gap-4 flex-wrap">
                                    <div>
                                        <div class="flex items-center gap-2 mb-1 flex-wrap">
                                            <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border {cat.color}">
                                                {cat.label}
                                            </span>
                                            {#if item.isFeatured}
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100">
                                                    ⭐ Featured
                                                </span>
                                            {/if}
                                        </div>
                                        <h3 class="font-black text-slate-900 text-lg">{item.title}</h3>
                                    </div>
                                    {#if item.startTime}
                                        <div class="flex-shrink-0 text-right">
                                            <p class="font-black text-indigo-600 text-sm">
                                                {formatTime(item.startTime)}
                                                {#if item.endTime} – {formatTime(item.endTime)}{/if}
                                            </p>
                                        </div>
                                    {/if}
                                </div>

                                {#if item.description}
                                    <p class="text-sm text-slate-500 mt-2 line-clamp-2">{item.description}</p>
                                {/if}

                                {#if item.isYardSale && item.items?.length > 0}
    <div class="mt-2 flex flex-wrap gap-1.5">
        {#each item.items.slice(0, 4) as saleItem}
            <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{saleItem}</span>
        {/each}
        {#if item.items.length > 4}
            <span class="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full text-xs font-bold">+{item.items.length - 4} more</span>
        {/if}
    </div>
{/if}

                                <div class="flex items-center gap-4 mt-3 flex-wrap">
                                    {#if item.locationName || item.address}
                                        <div class="flex items-center gap-1.5 text-xs text-slate-500">
                                            <span>📍</span>
                                            <span>{item.locationName ?? item.address}</span>
                                        </div>
                                    {/if}
                                    {#if item.latitude && item.longitude}
                                        <a href={`https://maps.google.com/?q=${item.latitude},${item.longitude}`}
                                            target="_blank" rel="noopener noreferrer"
                                            class="flex items-center gap-1 text-xs font-black text-indigo-600 hover:underline">
                                            Get Directions →
                                        </a>
                                    {/if}
                                </div>
                            </div>

                            {#if item.imageUrl}
                                <div class="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 hidden sm:block">
                                    <img src={item.imageUrl} alt={item.title} class="w-full h-full object-cover" />
                                </div>
                            {/if}

                        </div>
                    </div>
                    </svelte:element>
                {/each}
            </div>
        {/if}

        <!-- Yard Sales on this day -->
        {#if data.yardSales?.length > 0}
            <div class="mt-8 pt-8 border-t border-slate-200">
                <button
                    onclick={() => yardSalesOpen = !yardSalesOpen}
                    class="w-full flex items-center justify-between group mb-4"
                >
                    <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest">
                        🏷️ Yard Sales Today ({data.yardSales.length})
                    </h2>
                    <span class="text-xs font-black text-indigo-400 group-hover:text-indigo-600 transition-colors">
                        {yardSalesOpen ? '▲ Hide' : '▼ Show all'}
                    </span>
                </button>

                {#if yardSalesOpen}
                    <div class="space-y-3">
                        {#each data.yardSales as sale}
                            <a href="/yard-sales/{sale.id}" class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 block hover:shadow-md transition-all">
                                <div class="flex gap-4">
                                    <div class="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-indigo-50 border border-indigo-100">
                                        🏷️
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-start justify-between gap-4 flex-wrap">
                                            <div>
                                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-indigo-50 text-indigo-600 border-indigo-100">
                                                    Yard Sale
                                                </span>
                                                <h3 class="font-black text-slate-900 text-lg mt-1">{sale.title}</h3>
                                                <p class="text-sm text-slate-500">by {sale.contactName}</p>
                                            </div>
                                            <div class="flex-shrink-0 text-right">
                                                <p class="font-black text-indigo-600 text-sm">
                                                    {formatTime(sale.startTime)} – {formatTime(sale.endTime)}
                                                </p>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-2 mt-2 text-xs text-slate-500">
                                            <span>📍</span>
                                            <span>{sale.address}</span>
                                        </div>
                                        {#if sale.items?.length > 0}
                                            <div class="mt-2 flex flex-wrap gap-1.5">
                                                {#each sale.items as item}
                                                    <span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{item}</span>
                                                {/each}
                                            </div>
                                        {/if}
                                        {#if sale.phone}
                                            <p class="mt-2 text-xs text-slate-400">📞 {sale.phone}</p>
                                        {/if}
                                    </div>
                                </div>
                            </a>
                        {/each}
                    </div>
                {:else}
                    <!-- Preview — show first 3 only -->
                    <div class="space-y-3">
                        {#each data.yardSales.slice(0, 3) as sale}
                            <a href="/yard-sales/{sale.id}" class="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-md transition-all block">
                                <span class="text-2xl">🏷️</span>
                                <div class="flex-1 min-w-0">
                                    <p class="font-black text-slate-900 text-sm">{sale.title}</p>
                                    <p class="text-xs text-slate-500 mt-0.5">📍 {sale.address} · {formatTime(sale.startTime)}–{formatTime(sale.endTime)}</p>
                                </div>
                            </a>
                        {/each}
                        {#if data.yardSales.length > 3}
                            <button
                                onclick={() => yardSalesOpen = true}
                                class="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 font-black text-xs rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                                + Show {data.yardSales.length - 3} more yard sale{data.yardSales.length - 3 > 1 ? 's' : ''}
                            </button>
                        {/if}
                    </div>
                {/if}
            </div>
        {/if}

    </div>
</div>