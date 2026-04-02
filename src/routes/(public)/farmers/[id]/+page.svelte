<!-- src/routes/(public)/farmers/[id]/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    let { data } = $props();
    const { farmer, currentUserId, isAdmin } = data;
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Back Nav -->
    <div class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/farmers" class="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1">
                ← Back to Farmers Market
            </a>
            <div class="flex items-center gap-2">
                {#if currentUserId === farmer.userId || isAdmin}
                    <form method="POST" action="?/delete" use:enhance>
                        <button
                            onclick={(e) => { if (!confirm('Delete this farm listing?')) e.preventDefault(); }}
                            class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
                            🗑 Delete
                        </button>
                    </form>
                {/if}
                <a href="/farmers/create"
                    class="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-black hover:bg-green-700 transition-all">
                    + List Your Farm
                </a>
            </div>
        </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-8 space-y-6">

        <!-- Header -->
        <div class="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-white relative overflow-hidden">
            <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">🌾</div>
            <div class="relative z-10">
                <div class="flex flex-wrap gap-2 mb-3">
                    {#if farmer.isFeatured}
                        <span class="px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest">✨ Featured</span>
                    {/if}
                    {#if farmer.isOrganic}
                        <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">🌿 Organic</span>
                    {/if}
                </div>
                <h1 class="text-3xl font-black">{farmer.farmName}</h1>
                <p class="text-green-200 mt-1">by {farmer.contactName}</p>

                <!-- Feature badges -->
                <div class="flex flex-wrap gap-2 mt-4">
                    {#if farmer.isUpick}
                        <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black">🍓 U-Pick Available</span>
                    {/if}
                    {#if farmer.acceptsSnapEbt}
                        <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black">💳 SNAP/EBT Accepted</span>
                    {/if}
                    {#if farmer.offersDelivery}
                        <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black">🚗 Delivery Available</span>
                    {/if}
                    {#if farmer.acceptsPreorders}
                        <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black">📦 Pre-orders Welcome</span>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Current Availability -->
        {#if farmer.currentAvailabilityNote}
            <div class="bg-green-50 border-2 border-green-200 rounded-3xl p-6">
                <h2 class="text-xs font-black text-green-600 uppercase tracking-widest mb-2">🌱 Available Right Now</h2>
                <p class="text-green-800 font-bold">{farmer.currentAvailabilityNote}</p>
            </div>
        {/if}

        <!-- About -->
        {#if farmer.bio}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">About the Farm</h2>
                <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{farmer.bio}</p>
            </div>
        {/if}

        <!-- What We Sell -->
        {#if farmer.produceCategories?.length > 0}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">What We Sell</h2>
                <div class="flex flex-wrap gap-2">
                    {#each farmer.produceCategories as cat}
                        <span class="px-4 py-2 bg-green-50 border border-green-100 text-green-700 rounded-full text-sm font-black">{cat}</span>
                    {/each}
                </div>
                {#if farmer.seasonalAvailability?.length > 0}
                    <div class="mt-4 pt-4 border-t border-slate-100">
                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Seasonal Availability</p>
                        <div class="flex flex-wrap gap-2">
                            {#each farmer.seasonalAvailability as season}
                                <span class="px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-xs font-bold">📅 {season}</span>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}

        <!-- Where to Find Us -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">Where to Find Us</h2>

            {#if farmer.farmAddress}
                <div>
                    <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Farm Address</p>
                    <p class="font-bold text-slate-900">📍 {farmer.farmAddress}</p>
                    {#if farmer.locationPin}
                        <a href={farmer.locationPin} target="_blank" rel="noopener noreferrer"
                            class="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-black text-sm hover:bg-green-700 transition-all">
                            🗺️ Get Directions
                        </a>
                    {:else}
                        <a href="https://maps.google.com/?q={encodeURIComponent(farmer.farmAddress)}"
                            target="_blank" rel="noopener noreferrer"
                            class="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-black text-sm hover:bg-green-700 transition-all">
                            🗺️ Search on Google Maps
                        </a>
                    {/if}
                </div>
            {/if}

            {#if farmer.businessHours}
                <div class="pt-3 border-t border-slate-100">
                    <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Farm Stand Hours</p>
                    <p class="font-bold text-slate-900">🕐 {farmer.businessHours}</p>
                </div>
            {/if}

            {#if farmer.marketsAttended?.length > 0}
                <div class="pt-3 border-t border-slate-100">
                    <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Farmers Markets</p>
                    <div class="flex flex-wrap gap-2">
                        {#each farmer.marketsAttended as market}
                            <span class="px-3 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-full text-xs font-bold">🏪 {market}</span>
                        {/each}
                    </div>
                </div>
            {/if}

            {#if farmer.marketSchedule}
                <div class="pt-3 border-t border-slate-100">
                    <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Market Schedule</p>
                    <p class="text-slate-700 text-sm leading-relaxed">{farmer.marketSchedule}</p>
                </div>
            {/if}
        </div>

        <!-- Contact & Social -->
        {#if farmer.phone || farmer.email || farmer.website || farmer.instagram || farmer.facebook}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Contact & Social</h2>
                {#if farmer.phone}
                    <a href="tel:{farmer.phone}" class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-green-50 transition-all group">
                        <span class="text-xl">📞</span>
                        <span class="font-bold text-slate-700 group-hover:text-green-600">{farmer.phone}</span>
                    </a>
                {/if}
                {#if farmer.email}
                    <a href="mailto:{farmer.email}" class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-green-50 transition-all group">
                        <span class="text-xl">✉️</span>
                        <span class="font-bold text-slate-700 group-hover:text-green-600">{farmer.email}</span>
                    </a>
                {/if}
                {#if farmer.website}
                    <a href={farmer.website} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-green-50 transition-all group">
                        <span class="text-xl">🌐</span>
                        <span class="font-bold text-slate-700 group-hover:text-green-600 truncate">{farmer.website}</span>
                    </a>
                {/if}
                {#if farmer.instagram}
                    <a href="https://instagram.com/{farmer.instagram}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-green-50 transition-all group">
                        <span class="text-xl">📸</span>
                        <span class="font-bold text-slate-700 group-hover:text-green-600">@{farmer.instagram}</span>
                    </a>
                {/if}
                {#if farmer.facebook}
                    <a href={farmer.facebook.startsWith('http') ? farmer.facebook : `https://${farmer.facebook}`} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-green-50 transition-all group">
                        <span class="text-xl">👤</span>
                        <span class="font-bold text-slate-700 group-hover:text-green-600">{farmer.facebook}</span>
                    </a>
                {/if}
            </div>
        {/if}

        <!-- Share -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Share This Farm</h2>
            <button
                onclick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}
                class="flex items-center gap-3 px-5 py-3 bg-slate-100 hover:bg-green-50 text-slate-700 hover:text-green-600 rounded-2xl font-black text-sm transition-all">
                🔗 Copy Link
            </button>
        </div>

        <div class="text-center pt-4">
            <a href="/farmers" class="text-sm font-bold text-green-600 hover:underline">← See all local farmers</a>
        </div>

    </div>
</div>