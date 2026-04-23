<!-- src/routes/(public)/open-houses/[id]/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import ShareBar from '$lib/components/ShareBar.svelte';

    let { data } = $props();
    const { house, currentUserId, isAdmin, today } = data;

    const isPast = house.openDate < today;
    const isToday = house.openDate === today;

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
        single_family: 'Single Family Home',
        condo: 'Condo',
        townhouse: 'Townhouse',
        land: 'Land / Lot',
        commercial: 'Commercial',
        other: 'Property',
    };
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Back Nav -->
    <div class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/open-houses" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                ← Back to Open Houses
            </a>
            <div class="flex items-center gap-2">
                {#if currentUserId === house.userId || isAdmin}
                    <form method="POST" action="?/delete" use:enhance>
                        <button onclick={(e) => { if (!confirm('Delete this listing?')) e.preventDefault(); }}
                            class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
                            🗑 Delete
                        </button>
                    </form>
                {/if}
                <a href="/open-houses/create"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                    + Post Open House
                </a>
            </div>
        </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-8 space-y-6">


        <!-- Status Banners (owner/admin only) -->
        {#if house.status === 'pending'}
            <div class="flex items-center justify-between gap-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div class="flex items-center gap-3">
                    <span class="text-lg">⏳</span>
                    <p class="font-bold">Pending admin approval — we'll notify you once it's live!</p>
                </div>
                {#if currentUserId === house.userId || isAdmin}
                    <a href="/open-houses/{house.id}/edit"
                        class="flex-shrink-0 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-black hover:bg-amber-700 transition-all">
                        ✏️ Edit
                    </a>
                {/if}
            </div>
        {:else if house.status === 'rejected'}
            <div class="flex items-center justify-between gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl p-4">
                <div class="flex items-center gap-3">
                    <span class="text-lg">❌</span>
                    <div>
                        <p class="font-bold">This listing was not approved.</p>
                        <p class="text-xs mt-0.5">Edit and resubmit, or contact us if you have questions.</p>
                    </div>
                </div>
                {#if currentUserId === house.userId || isAdmin}
                    <a href="/open-houses/{house.id}/edit"
                        class="flex-shrink-0 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 transition-all">
                        ✏️ Edit & Resubmit
                    </a>
                {/if}
            </div>
        {/if}
        
        <!-- Hero Header -->
        <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">🏠</div>
            <div class="relative z-10">
                <div class="flex flex-wrap gap-2 mb-3">
                    {#if isPast}
                        <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">Past</span>
                    {:else if isToday}
                        <span class="px-3 py-1 bg-emerald-400 text-white rounded-full text-xs font-black uppercase tracking-widest animate-pulse">🔴 Today!</span>
                    {:else}
                        <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">Upcoming</span>
                    {/if}
                    <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                        {propertyTypeLabel[house.propertyType ?? 'single_family']}
                    </span>
                    {#if house.isFeatured}
                        <span class="px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-black uppercase">✨ Featured</span>
                    {/if}
                </div>
                <h1 class="text-3xl font-black">{house.title}</h1>
                <p class="text-indigo-200 mt-1">📍 {house.address}</p>
                <p class="text-3xl font-black mt-3">{formatPrice(house.price)}</p>
            </div>
        </div>

        <!-- Photo -->
        {#if house.imageUrl}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <img src={house.imageUrl} alt={house.title} class="w-full h-auto max-h-96 object-cover" />
            </div>
        {/if}

        <!-- Open House Time -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Open House</h2>
            <div class="flex items-center gap-4 flex-wrap">
                <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center min-w-[80px]">
                    <p class="text-[10px] font-black text-indigo-400 uppercase">
                        {new Date(house.openDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p class="text-3xl font-black text-indigo-600 leading-tight">
                        {new Date(house.openDate + 'T00:00:00').getDate()}
                    </p>
                    <p class="text-[10px] font-black text-indigo-400 uppercase">
                        {new Date(house.openDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric' })}
                    </p>
                </div>
                <div>
                    <p class="font-black text-slate-900 text-lg">{formatDate(house.openDate)}</p>
                    <p class="font-black text-indigo-600 text-lg">{formatTime(house.startTime)} – {formatTime(house.endTime)}</p>
                    {#if isToday}
                        <p class="text-emerald-600 font-black text-sm mt-1">🟢 Happening today — stop by!</p>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Property Details -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Property Details</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                {#if house.bedrooms}
                    <div class="bg-slate-50 rounded-2xl p-4 text-center">
                        <p class="text-2xl font-black text-slate-900">{house.bedrooms}</p>
                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">🛏 Bedrooms</p>
                    </div>
                {/if}
                {#if house.bathrooms}
                    <div class="bg-slate-50 rounded-2xl p-4 text-center">
                        <p class="text-2xl font-black text-slate-900">{house.bathrooms}</p>
                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">🚿 Bathrooms</p>
                    </div>
                {/if}
                {#if house.sqFt}
                    <div class="bg-slate-50 rounded-2xl p-4 text-center">
                        <p class="text-2xl font-black text-slate-900">{house.sqFt.toLocaleString()}</p>
                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">📐 Sq Ft</p>
                    </div>
                {/if}
                {#if house.lotSize}
                    <div class="bg-slate-50 rounded-2xl p-4 text-center">
                        <p class="text-xl font-black text-slate-900">{house.lotSize}</p>
                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">🌿 Lot Size</p>
                    </div>
                {/if}
                {#if house.yearBuilt}
                    <div class="bg-slate-50 rounded-2xl p-4 text-center">
                        <p class="text-2xl font-black text-slate-900">{house.yearBuilt}</p>
                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">🏗 Year Built</p>
                    </div>
                {/if}
                <div class="bg-slate-50 rounded-2xl p-4 text-center">
                    <p class="text-xl font-black text-slate-900">{propertyTypeLabel[house.propertyType ?? 'single_family']}</p>
                    <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">🏠 Type</p>
                </div>
            </div>
        </div>

        <!-- Description -->
        {#if house.description}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">About This Property</h2>
                <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{house.description}</p>
            </div>
        {/if}

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">Location</h2>
            <p class="font-bold text-slate-900">📍 {house.address}</p>
            {#if house.locationPin}
                <a href={house.locationPin} target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                    🗺️ Get Directions
                </a>
            {:else}
                <a href="https://maps.google.com/?q={encodeURIComponent(house.address)}"
                    target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                    🗺️ View on Google Maps
                </a>
            {/if}
        </div>

        <!-- Agent Contact -->
        <div class="bg-indigo-600 rounded-3xl p-6 text-white">
            <h2 class="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Contact Agent</h2>
            <p class="font-black text-xl">{house.agentName}</p>
            {#if house.agentCompany}
                <p class="text-indigo-200 text-sm mt-0.5">{house.agentCompany}</p>
            {/if}
            <div class="mt-4 space-y-2">
                {#if house.agentPhone}
                    <a href="tel:{house.agentPhone}" class="flex items-center gap-3 text-sm font-bold text-white hover:text-indigo-200 transition-colors">
                        📞 {house.agentPhone}
                    </a>
                {/if}
                {#if house.agentEmail}
                    <a href="mailto:{house.agentEmail}" class="flex items-center gap-3 text-sm font-bold text-white hover:text-indigo-200 transition-colors truncate">
                        ✉️ {house.agentEmail}
                    </a>
                {/if}
            </div>
        </div>

        <!-- Share -->
        <ShareBar title={house.title} description="{propertyTypeLabel[house.propertyType ?? 'single_family']} · {house.address}" />

    </div>
</div>