<!-- src/routes/(public)/open-houses/+page.svelte -->
<script lang="ts">
    let { data } = $props();

    function formatDate(dateStr: string) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }

    function formatTime(t: string) {
        const [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
    }

    function formatPrice(p: number | null) {
        if (!p) return 'Contact for price';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(p);
    }

    const propertyTypeLabel: Record<string, string> = {
        single_family: 'Single Family',
        condo: 'Condo',
        townhouse: 'Townhouse',
        land: 'Land',
        commercial: 'Commercial',
        other: 'Other',
    };
</script>

<div class="max-w-4xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-10 text-center">
        <div class="text-5xl mb-3">🏠</div>
        <h1 class="text-4xl font-black text-slate-900">Open Houses</h1>
        <p class="text-slate-500 mt-2">Find your next home in Lee County!</p>
        <a href="/open-houses/create"
            class="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-all text-sm">
            + Post an Open House
        </a>
    </div>

    <!-- Upcoming -->
    <section class="mb-12">
        <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">
            Upcoming Open Houses ({data.upcoming.length})
        </h2>

        {#if data.upcoming.length === 0}
            <div class="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <span class="text-4xl block mb-3">🏡</span>
                <p class="font-bold text-slate-600">No upcoming open houses.</p>
                <p class="text-slate-400 text-sm mt-1">Be the first to post one!</p>
            </div>
        {:else}
            <div class="space-y-4">
                {#each data.upcoming as house}
                    <a href="/open-houses/{house.id}" class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all block overflow-hidden">
                        <div class="flex flex-col md:flex-row">

                            <!-- Photo or placeholder -->
                            <div class="md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-gradient-to-br from-indigo-100 to-slate-200">
                                {#if house.imageUrl}
                                    <img src={house.imageUrl} alt={house.title} class="w-full h-full object-cover" />
                                {:else}
                                    <div class="w-full h-full flex items-center justify-center">
                                        <span class="text-5xl opacity-30">🏠</span>
                                    </div>
                                {/if}
                            </div>

                            <div class="flex-1 p-6">
                                <div class="flex items-start justify-between gap-4 flex-wrap">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 flex-wrap mb-2">
                                            <span class="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                🏠 {propertyTypeLabel[house.propertyType ?? 'single_family'] ?? 'Home'}
                                            </span>
                                            {#if house.isFeatured}
                                                <span class="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[10px] font-black uppercase">✨ Featured</span>
                                            {/if}
                                        </div>
                                        <h3 class="font-black text-slate-900 text-xl">{house.title}</h3>
                                        <p class="text-slate-500 text-sm mt-1">📍 {house.address}</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-2xl font-black text-indigo-600">{formatPrice(house.price)}</p>
                                    </div>
                                </div>

                                <!-- Property stats -->
                                <div class="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
                                    {#if house.bedrooms}
                                        <span class="flex items-center gap-1">🛏 <strong>{house.bedrooms}</strong> beds</span>
                                    {/if}
                                    {#if house.bathrooms}
                                        <span class="flex items-center gap-1">🚿 <strong>{house.bathrooms}</strong> baths</span>
                                    {/if}
                                    {#if house.sqFt}
                                        <span class="flex items-center gap-1">📐 <strong>{house.sqFt.toLocaleString()}</strong> sq ft</span>
                                    {/if}
                                </div>

                                <!-- Open house time -->
                                <div class="mt-3 flex items-center gap-4 flex-wrap text-xs">
                                    <div class="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-black">
                                        📅 {formatDate(house.openDate)} · {formatTime(house.startTime)} – {formatTime(house.endTime)}
                                    </div>
                                    {#if house.agentName}
                                        <span class="text-slate-400">Hosted by {house.agentName}{house.agentCompany ? ` · ${house.agentCompany}` : ''}</span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </section>

    <!-- Past -->
    {#if data.past.length > 0}
        <section>
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Past Open Houses ({data.past.length})
            </h2>
            <div class="space-y-3">
                {#each data.past as house}
                    <a href="/open-houses/{house.id}" class="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 hover:shadow-sm transition-all block opacity-60">
                        <span class="text-2xl">🏠</span>
                        <div class="flex-1 min-w-0">
                            <p class="font-black text-slate-700 text-sm">{house.title}</p>
                            <p class="text-xs text-slate-400 mt-0.5">📍 {house.address} · {formatDate(house.openDate)}</p>
                        </div>
                        {#if house.price}
                            <p class="text-sm font-black text-slate-500 flex-shrink-0">{formatPrice(house.price)}</p>
                        {/if}
                    </a>
                {/each}
            </div>
        </section>
    {/if}

</div>