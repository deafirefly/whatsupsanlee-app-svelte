<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let pending = $derived(data.allEvents.filter(e => e.status === 'pending'));
    let approved = $derived(data.allEvents.filter(e => e.status === 'approved'));
    let rejected = $derived(data.allEvents.filter(e => e.status === 'rejected'));

    let activeTab = $state<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    let filtered = $derived(
        activeTab === 'all'
            ? data.allEvents
            : data.allEvents.filter(e => e.status === activeTab)
    );

    const categoryConfig: Record<string, { emoji: string; label: string }> = {
        food_truck:     { emoji: '🚚', label: 'Food Truck' },
        open_house:     { emoji: '🏠', label: 'Open House' },
        yard_sale:      { emoji: '🛍️', label: 'Yard Sale' },
        farmers_market: { emoji: '🌽', label: "Farmer's Market" },
        movie:          { emoji: '🎬', label: 'Movie' },
        community:      { emoji: '🎉', label: 'Community' },
        arts:           { emoji: '🎨', label: 'Arts & Crafts' },
        church:         { emoji: '⛪', label: 'Church' },
        school:         { emoji: '🏫', label: 'School' },
        other:          { emoji: '📦', label: 'Other' },
    };

    function getCategory(cat: string) {
        return categoryConfig[cat] ?? { emoji: '📦', label: 'Other' };
    }

    function formatDate(date: string) {
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    function formatTime(time: string | null) {
        if (!time) return '';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
    }
</script>

<div class="max-w-5xl mx-auto p-6 space-y-6">

    <!-- Header -->
    <div>
        <h1 class="text-3xl font-black text-slate-900">Event Approvals</h1>
        <p class="text-slate-500 mt-1">Review and manage community event submissions.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-3 gap-4">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p class="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Pending</p>
            <p class="text-3xl font-black text-amber-700">{pending.length}</p>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <p class="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Approved</p>
            <p class="text-3xl font-black text-emerald-700">{approved.length}</p>
        </div>
        <div class="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p class="text-xs font-black text-red-400 uppercase tracking-widest mb-1">Rejected</p>
            <p class="text-3xl font-black text-red-700">{rejected.length}</p>
        </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {#each ['pending', 'approved', 'rejected', 'all'] as tab}
            <button
                onclick={() => activeTab = tab as typeof activeTab}
                class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all
                {activeTab === tab
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'}"
            >
                {tab}
                {#if tab === 'pending' && pending.length > 0}
                    <span class="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[10px]">
                        {pending.length}
                    </span>
                {/if}
            </button>
        {/each}
    </div>

    <!-- Events List -->
    {#if filtered.length === 0}
        <div class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <span class="text-4xl block mb-4">📋</span>
            <h3 class="text-xl font-bold text-slate-900">No {activeTab} events</h3>
            <p class="text-slate-500 text-sm mt-1">Nothing to review here right now.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each filtered as event}
                {@const cat = getCategory(event.category)}
                <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <!-- Event Info -->
                        <div class="flex items-start gap-4">
                            <div class="text-3xl bg-slate-50 p-3 rounded-2xl flex-shrink-0">
                                {cat.emoji}
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h3 class="font-black text-lg text-slate-900">{event.title}</h3>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                        {event.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                         event.status === 'rejected' ? 'bg-red-50 text-red-500 border border-red-200' :
                                         'bg-amber-50 text-amber-600 border border-amber-200'}">
                                        {event.status}
                                    </span>
                                </div>
                                <p class="text-sm text-slate-500 mt-0.5">{cat.label}</p>
                                <div class="flex items-center gap-3 mt-1 flex-wrap">
                                    <p class="text-xs text-slate-400">
                                        📅 {formatDate(event.startDate)}
                                        {#if event.endDate !== event.startDate}
                                            → {formatDate(event.endDate)}
                                        {/if}
                                    </p>
                                    {#if event.startTime}
                                        <p class="text-xs text-indigo-600 font-bold">
                                            🕐 {formatTime(event.startTime)}
                                            {#if event.endTime} – {formatTime(event.endTime)}{/if}
                                        </p>
                                    {/if}
                                    {#if event.locationName || event.address}
                                        <p class="text-xs text-slate-400">
                                            📍 {event.locationName ?? event.address}
                                        </p>
                                    {/if}
                                </div>
                                {#if event.description}
                                    <p class="text-xs text-slate-400 mt-1 line-clamp-1 italic">"{event.description}"</p>
                                {/if}
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap gap-2 md:flex-col md:items-end">

                            <!-- View on Events Page -->
                            {#if event.status === 'approved'}
                               <a  
                                    href={`/events/${event.startDate}`}
                                    target="_blank"
                                    class="px-4 py-2 text-xs font-black rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    👁 View
                                </a>
                            {/if}

                            <!-- Approve -->
                            {#if event.status !== 'approved'}
                                <form method="POST" action="?/approve" use:enhance>
                                    <input type="hidden" name="id" value={event.id} />
                                    <button type="submit"
                                        class="px-4 py-2 text-xs font-black rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
                                        ✓ Approve
                                    </button>
                                </form>
                            {/if}

                            <!-- Reject -->
                            {#if event.status !== 'rejected'}
                                <form method="POST" action="?/reject" use:enhance>
                                    <input type="hidden" name="id" value={event.id} />
                                    <button type="submit"
                                        class="px-4 py-2 text-xs font-black rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all">
                                        ✕ Reject
                                    </button>
                                </form>
                            {/if}

                            <!-- Delete -->
                            <form method="POST" action="?/delete" use:enhance
                                onsubmit={(e) => {
                                    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <input type="hidden" name="id" value={event.id} />
                                <button type="submit"
                                    class="px-4 py-2 text-xs font-black rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                    🗑 Delete
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

</div>