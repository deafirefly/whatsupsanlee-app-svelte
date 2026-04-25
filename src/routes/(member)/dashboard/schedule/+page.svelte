<!-- src/routes/(member)/dashboard/schedule/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    const { listing, upcoming, past, today } = data;

    let isSubmitting = $state(false);
    let showBulkAdd = $state(false);

    // Single entry form state
    let newDate = $state('');
    let newLocation = $state('');
    let newAddress = $state('');
    let newStartTime = $state('');
    let newEndTime = $state('');
    let newNotes = $state('');

    // Bulk add state
    let bulkEntries = $state<Array<{
        date: string;
        locationName: string;
        address: string;
        startTime: string;
        endTime: string;
        notes: string;
        id: number;
    }>>([]);

    let bulkIdCounter = $state(0);

    // Common locations for quick-fill
    let savedLocations = $state<Array<{name: string; address: string}>>([
        { name: 'Downtown Sanford', address: 'Downtown Sanford, NC 27330' },
        { name: 'Sanford Farmers Market', address: '1801 Nash St, Sanford, NC 27330' },
        { name: 'Lee County Fairgrounds', address: '1900 Nash St, Sanford, NC 27330' },
    ]);

    function addBulkRow() {
        bulkEntries = [...bulkEntries, {
            date: '',
            locationName: '',
            address: '',
            startTime: '11:00',
            endTime: '14:00',
            notes: '',
            id: bulkIdCounter++,
        }];
    }

    function removeBulkRow(id: number) {
        bulkEntries = bulkEntries.filter(e => e.id !== id);
    }

    function formatDate(dateStr: string) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
    }

    function formatTime(t: string) {
        const [h, m] = t.split(':').map(Number);
        return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
    }

    // Get next 30 days for quick date selection
    function getNext30Days() {
        const days = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    }

    const next30Days = getNext30Days();

    // Days that already have entries
    let scheduledDates = $derived(new Set(upcoming.map(s => s.date)));

    function copyEntry(entry: any) {
        newLocation = entry.locationName ?? '';
        newAddress = entry.address ?? '';
        newStartTime = entry.startTime ?? '';
        newEndTime = entry.endTime ?? '';
        newNotes = entry.notes ?? '';
        newDate = '';
        showBulkAdd = false;
        // Scroll to top form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-8">
        <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-4">
            ← Back to Dashboard
        </a>
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <div>
                <h1 class="text-3xl font-black text-slate-900">📅 Schedule Manager</h1>
                <p class="text-slate-500 mt-1">Tell customers where <strong>{listing.businessName}</strong> will be each day.</p>
            </div>
            <a href="/listings/{listing.id}" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-50 transition-all">
                View Public Page →
            </a>
        </div>
    </div>

    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-bold">⚠ {form.message}</div>
    {/if}

    {#if form?.success}
        <div class="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-bold">
            ✅ {form.count ? `${form.count} entries saved!` : 'Entry saved!'}
        </div>
    {/if}

    <!-- Add Single Entry -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-6">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Add Schedule Entry</h2>
            <button type="button" onclick={() => showBulkAdd = !showBulkAdd}
                class="px-4 py-2 text-xs font-black rounded-xl transition-all
                {showBulkAdd ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                {showBulkAdd ? '✕ Close Bulk Add' : '📋 Bulk Add Multiple Days'}
            </button>
        </div>

        {#if !showBulkAdd}
            <!-- Single Entry Form -->
            <form method="POST" action="?/addEntry" use:enhance={() => {
                isSubmitting = true;
                return async ({ update }) => {
                    await update();
                    isSubmitting = false;
                    newDate = '';
                    newLocation = '';
                    newAddress = '';
                    newStartTime = '';
                    newEndTime = '';
                    newNotes = '';
                };
            }} class="space-y-4">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Date *</label>
                        <select name="date" bind:value={newDate} required
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                            <option value="">Select a date...</option>
                            {#each next30Days as day}
                                <option value={day} disabled={scheduledDates.has(day)}>
                                    {formatDate(day)}{scheduledDates.has(day) ? ' ✓ scheduled' : ''}
                                </option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Location Name *</label>
                        <input name="locationName" bind:value={newLocation} required
                            placeholder="e.g. Downtown Sanford"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Address *</label>
                    <input name="address" bind:value={newAddress} required
                        placeholder="Full address"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <!-- Quick fill buttons -->
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each savedLocations as loc}
                            <button type="button"
                                onclick={() => { newLocation = loc.name; newAddress = loc.address; }}
                                class="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-full text-xs font-bold transition-all">
                                📍 {loc.name}
                            </button>
                        {/each}
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Start Time *</label>
                        <input name="startTime" type="time" bind:value={newStartTime} required
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">End Time *</label>
                        <input name="endTime" type="time" bind:value={newEndTime} required
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Notes <span class="text-slate-400 font-normal">(optional)</span></label>
                    <input name="notes" bind:value={newNotes}
                        placeholder="e.g. Rain cancels this event"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>

                <button type="submit" disabled={isSubmitting}
                    class="w-full py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : '+ Add to Schedule'}
                </button>
            </form>

        {:else}
            <!-- Bulk Add Form -->
            <div class="space-y-4">
                <p class="text-sm text-slate-500">Add multiple days at once. Great for planning your whole month!</p>

                {#if bulkEntries.length === 0}
                    <div class="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                        <p class="text-slate-400 text-sm font-bold mb-3">No entries yet</p>
                        <button type="button" onclick={addBulkRow}
                            class="px-5 py-2.5 bg-indigo-600 text-white font-black rounded-xl text-sm hover:bg-indigo-700 transition-all">
                            + Add First Day
                        </button>
                    </div>
                {:else}
                    <div class="space-y-3">
                        {#each bulkEntries as entry (entry.id)}
                            <div class="bg-slate-50 rounded-2xl p-4 space-y-3">
                                <div class="flex items-center justify-between">
                                    <p class="text-xs font-black text-slate-500 uppercase tracking-widest">
                                        {entry.date ? formatDate(entry.date) : 'New Entry'}
                                        {#if entry.date && scheduledDates.has(entry.date)}
                                            <span class="text-amber-500 ml-1">⚠ Will update existing</span>
                                        {/if}
                                    </p>
                                    <button type="button" onclick={() => removeBulkRow(entry.id)}
                                        class="text-red-400 hover:text-red-600 font-black text-xs">✕ Remove</button>
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-xs font-bold text-slate-600 mb-1">Date *</label>
                                        <select bind:value={entry.date}
                                            class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                            <option value="">Select...</option>
                                            {#each next30Days as day}
                                                <option value={day}>{formatDate(day)}</option>
                                            {/each}
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-600 mb-1">Location *</label>
                                        <input bind:value={entry.locationName} placeholder="Location name"
                                            class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                    <div class="col-span-2">
                                        <label class="block text-xs font-bold text-slate-600 mb-1">Address *</label>
                                        <input bind:value={entry.address} placeholder="Full address"
                                            class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                        <div class="flex flex-wrap gap-1.5 mt-1.5">
                                            {#each savedLocations as loc}
                                                <button type="button"
                                                    onclick={() => { entry.locationName = loc.name; entry.address = loc.address; }}
                                                    class="px-2 py-0.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-500 rounded-full text-[10px] font-bold transition-all">
                                                    📍 {loc.name}
                                                </button>
                                            {/each}
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-600 mb-1">Start *</label>
                                        <input type="time" bind:value={entry.startTime}
                                            class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-slate-600 mb-1">End *</label>
                                        <input type="time" bind:value={entry.endTime}
                                            class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
                                    </div>
                                    <div class="col-span-2">
                                        <label class="block text-xs font-bold text-slate-600 mb-1">Notes</label>
                                        <input bind:value={entry.notes} placeholder="e.g. Rain cancels this event"
                                            class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <button type="button" onclick={addBulkRow}
                        class="w-full py-2.5 border-2 border-dashed border-indigo-200 text-indigo-600 font-black text-xs rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                        + Add Another Day
                    </button>

                    <form method="POST" action="?/bulkAdd" use:enhance={() => {
                        isSubmitting = true;
                        return async ({ update }) => {
                            await update();
                            isSubmitting = false;
                            bulkEntries = [];
                            showBulkAdd = false;
                        };
                    }}>
                        <input type="hidden" name="entries" value={JSON.stringify(bulkEntries.map(({id, ...rest}) => rest))} />
                        <button type="submit" disabled={isSubmitting || bulkEntries.length === 0}
                            class="w-full py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : `Save ${bulkEntries.length} Schedule Entr${bulkEntries.length === 1 ? 'y' : 'ies'}`}
                        </button>
                    </form>
                {/if}
            </div>
        {/if}
    </div>

    <!-- Upcoming Schedule -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 mb-6">
        <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">
            Upcoming Schedule ({upcoming.length})
        </h2>

        {#if upcoming.length === 0}
            <div class="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
                <p class="text-4xl mb-3">📅</p>
                <p class="font-bold text-slate-600 text-sm">No upcoming schedule entries.</p>
                <p class="text-slate-400 text-xs mt-1">Add your first entry above to let customers know where to find you!</p>
            </div>
        {:else}
            <div class="space-y-3">
                {#each upcoming as entry}
                    <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl flex-wrap">
                        <!-- Date badge -->
                        <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-center min-w-[60px] flex-shrink-0">
                            <p class="text-[10px] font-black text-indigo-400 uppercase">
                                {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                            </p>
                            <p class="text-xl font-black text-indigo-600 leading-tight">
                                {new Date(entry.date + 'T00:00:00').getDate()}
                            </p>
                            <p class="text-[10px] font-black text-indigo-400 uppercase">
                                {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                        </div>

                        <div class="flex-1 min-w-0">
                            <p class="font-black text-slate-900">{entry.locationName}</p>
                            <p class="text-xs text-slate-500 mt-0.5">📍 {entry.address}</p>
                            <p class="text-xs font-black text-indigo-600 mt-0.5">
                                {formatTime(entry.startTime ?? '')} – {formatTime(entry.endTime ?? '')}
                            </p>
                            {#if entry.notes}
                                <p class="text-xs text-amber-600 mt-0.5 italic">📝 {entry.notes}</p>
                            {/if}
                        </div>

                        <form method="POST" action="?/deleteEntry" use:enhance>
                            <input type="hidden" name="id" value={entry.id} />
                            <button
                                onclick={(e) => { if (!confirm('Remove this schedule entry?')) e.preventDefault(); }}
                                class="px-3 py-2 bg-red-50 text-red-500 border border-red-100 rounded-xl text-xs font-black hover:bg-red-100 transition-all flex-shrink-0">
                                🗑
                            </button>
                        </form>
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Past Schedule -->
    {#if past.length > 0}
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Past Entries</h2>
            <div class="space-y-2">
                {#each past.filter(p => p.date < today).slice(-5) as entry}
                    <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl opacity-70 hover:opacity-100 transition-all flex-wrap">
                        <p class="text-xs font-black text-slate-400 w-20 flex-shrink-0">{formatDate(entry.date)}</p>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-bold text-slate-600">{entry.locationName}</p>
                            <p class="text-xs text-slate-400">{entry.address}</p>
                        </div>
                        <div class="flex items-center gap-2 flex-shrink-0">
                            <button type="button"
                                onclick={() => copyEntry(entry)}
                                class="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all">
                                📋 Copy
                            </button>
                            <form method="POST" action="?/deleteEntry" use:enhance>
                                <input type="hidden" name="id" value={entry.id} />
                                <button
                                    onclick={(e) => { if (!confirm('Remove this past entry?')) e.preventDefault(); }}
                                    class="px-3 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
                                    🗑
                                </button>
                            </form>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

</div>