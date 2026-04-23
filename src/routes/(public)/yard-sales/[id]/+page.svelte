<!-- src/routes/(public)/yard-sales/[id]/+page.svelte -->
<script lang="ts">
    import ShareBar from '$lib/components/ShareBar.svelte';
    let { data } = $props();
    const { sale, currentUserId, isAdmin } = data;

    function formatDate(dateStr: string) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }

    function formatTime(t: string) {
        const [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
    }

    const today = new Date().toISOString().split('T')[0];
    const isPast = sale.saleDate < today;
    const isToday = sale.saleDate === today;
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <div class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/yard-sales" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                ← Back to Yard Sales
            </a>
            <div class="flex items-center gap-2">
                {#if currentUserId === sale.userId || isAdmin}
                    <form method="POST" action="?/delete">
                        <button
                            onclick={(e) => { if (!confirm('Delete this yard sale?')) e.preventDefault(); }}
                            class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
                            🗑 Delete
                        </button>
                    </form>
                {/if}
                <a href="/yard-sales/create"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                    + Post Your Sale
                </a>
            </div>
        </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-8 space-y-6">

        <!-- Status Banners (owner/admin only) -->
        {#if sale.status === 'pending'}
            <div class="flex items-center justify-between gap-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <div class="flex items-center gap-3">
                    <span class="text-lg">⏳</span>
                    <p class="font-bold">Pending admin approval — we'll notify you once it's live!</p>
                </div>
                {#if currentUserId === sale.userId || isAdmin}
                    <a href="/yard-sales/{sale.id}/edit"
                        class="flex-shrink-0 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-black hover:bg-amber-700 transition-all">
                        ✏️ Edit
                    </a>
                {/if}
            </div>
        {:else if sale.status === 'rejected'}
            <div class="flex items-center justify-between gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl p-4">
                <div class="flex items-center gap-3">
                    <span class="text-lg">❌</span>
                    <div>
                        <p class="font-bold">This listing was not approved.</p>
                        <p class="text-xs mt-0.5">Edit and resubmit, or contact us if you have questions.</p>
                    </div>
                </div>
                {#if currentUserId === sale.userId || isAdmin}
                    <a href="/yard-sales/{sale.id}/edit"
                        class="flex-shrink-0 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 transition-all">
                        ✏️ Edit & Resubmit
                    </a>
                {/if}
            </div>
        {/if}

        <!-- Header Card -->
        <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">
                🏷️
            </div>
            <div class="relative z-10">
                {#if isPast}
                    <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-3 inline-block">
                        Past Sale
                    </span>
                {:else if isToday}
                    <span class="px-3 py-1 bg-white/30 rounded-full text-xs font-black uppercase tracking-widest mb-3 inline-block animate-pulse">
                        🔴 Happening Today!
                    </span>
                {:else}
                    <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-3 inline-block">
                        Upcoming Sale
                    </span>
                {/if}

                {#if sale.isFeatured}
                    <span class="px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-black uppercase tracking-widest mb-3 inline-block ml-2">
                        ✨ Featured
                    </span>
                {/if}

                <h1 class="text-3xl font-black mt-2">{sale.title}</h1>
                <p class="text-indigo-200 mt-1">by {sale.contactName}</p>
            </div>
        </div>

        <!-- Date, Time & Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest">When & Where</h2>

            <div class="flex items-start gap-4">
                <div class="flex-shrink-0 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center min-w-[72px]">
                    <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                        {new Date(sale.saleDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                    <p class="text-3xl font-black text-indigo-600 leading-tight">
                        {new Date(sale.saleDate + 'T00:00:00').getDate()}
                    </p>
                    <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                        {new Date(sale.saleDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                </div>

                <div class="flex-1 space-y-3">
                    <div>
                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                        <p class="font-black text-slate-900">{formatDate(sale.saleDate)}</p>
                    </div>
                    <div>
                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Time</p>
                        <p class="font-black text-slate-900 text-lg text-indigo-600">
                            {formatTime(sale.startTime)} – {formatTime(sale.endTime)}
                        </p>
                    </div>
                </div>
            </div>

            <div class="pt-4 border-t border-slate-100">
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Address</p>
                <p class="font-bold text-slate-900">📍 {sale.address}</p>
                {#if sale.locationPin}
                    <a href={sale.locationPin} target="_blank" rel="noopener noreferrer"
                        class="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                        🗺️ Get Directions
                    </a>
                {:else}
                    <a href="https://maps.google.com/?q={encodeURIComponent(sale.address)}"
                        target="_blank" rel="noopener noreferrer"
                        class="mt-3 inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                        🗺️ Search on Google Maps
                    </a>
                {/if}
            </div>
        </div>

        <!-- Items for Sale -->
        {#if sale.items?.length > 0}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">What's for Sale</h2>
                <div class="flex flex-wrap gap-2">
                    {#each sale.items as item}
                        <span class="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-sm font-black">
                            {item}
                        </span>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Description -->
        {#if sale.description}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Details</h2>
                <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{sale.description}</p>
            </div>
        {/if}

        <!-- Contact -->
        {#if sale.phone || sale.email}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Contact</h2>
                {#if sale.phone}
                    <a href="tel:{sale.phone}"
                        class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all group">
                        <span class="text-xl">📞</span>
                        <span class="font-bold text-slate-700 group-hover:text-indigo-600">{sale.phone}</span>
                    </a>
                {/if}
                {#if sale.email}
                    <a href="mailto:{sale.email}"
                        class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all group">
                        <span class="text-xl">✉️</span>
                        <span class="font-bold text-slate-700 group-hover:text-indigo-600">{sale.email}</span>
                    </a>
                {/if}
            </div>
        {/if}

        <!-- Share — only show if approved -->
        {#if sale.status === 'approved'}
            <ShareBar title={sale.title} description="Yard Sale in Lee County" />
        {/if}

        <div class="text-center pt-4">
            <a href="/yard-sales" class="text-sm font-bold text-indigo-600 hover:underline">
                ← See all upcoming yard sales
            </a>
        </div>

    </div>
</div>