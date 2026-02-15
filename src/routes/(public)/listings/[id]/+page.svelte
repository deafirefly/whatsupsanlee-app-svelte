<script lang="ts">
    let { data } = $props();
    const { listing } = data;

    // Helper to format category for the badge
    const categoryLabel = listing.category?.replace('_', ' ') || 'Community';
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">
    <div class="bg-white border-b">
        <div class="max-w-5xl mx-auto px-6 py-4">
            <a href="/" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
                ← Back to Directory
            </a>
        </div>
    </div>

    <div class="max-w-5xl mx-auto p-6 mt-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <header class="mb-8">
                        <div class="flex items-center gap-3 mb-4">
                            <span class="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                                {categoryLabel}
                            </span>
                            <span class="h-1 w-1 rounded-full bg-slate-300"></span>
                            <span class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <span class="relative flex h-2 w-2">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Verified Member
                            </span>
                        </div>
                        
                        <h1 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                            {listing.businessName}
                        </h1>
                        <p class="text-xl text-slate-500 mt-4 font-medium italic">
                            hosted by {listing.contactPerson}
                        </p>
                    </header>

                    <div class="space-y-4">
                        <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">The Story</h3>
                        <p class="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
                            {listing.bio}
                        </p>
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 text-white/10 text-9xl font-black select-none">
                        {listing.category === 'food_truck' ? '🚚' : '✨'}
                    </div>

                    <div class="relative z-10 space-y-8">
                        <div>
                            <h4 class="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-3">When to find us</h4>
                            <p class="text-xl font-bold leading-snug">{listing.scheduleSummary}</p>
                        </div>

                        <div>
                            <h4 class="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-3">Where we're at</h4>
                            <p class="text-lg font-medium mb-4 leading-snug">{listing.address}</p>
                            {#if listing.locationPin}
                                <a href={listing.locationPin} target="_blank" class="flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-lg">
                                    📍 GET DIRECTIONS
                                </a>
                            {/if}
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Join our community</h4>
                    <div class="grid grid-cols-2 gap-4">
                        {#if listing.instagram}
                            <a href="https://instagram.com/{listing.instagram}" target="_blank" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
                                <span class="text-2xl group-hover:scale-110 transition-transform">📸</span>
                                <span class="text-[10px] font-black uppercase">Instagram</span>
                            </a>
                        {/if}
                        {#if listing.facebook}
                            <a href={listing.facebook} target="_blank" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 transition-all group">
                                <span class="text-2xl group-hover:scale-110 transition-transform">👤</span>
                                <span class="text-[10px] font-black uppercase">Facebook</span>
                            </a>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>