<script lang="ts">
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    const { listing, availability } = data;
let specificDates = $state(data.specificDates);

$effect(() => {
    specificDates = data.specificDates;
});

    const days = [
        { key: 'monday',    label: 'Monday' },
        { key: 'tuesday',   label: 'Tuesday' },
        { key: 'wednesday', label: 'Wednesday' },
        { key: 'thursday',  label: 'Thursday' },
        { key: 'friday',    label: 'Friday' },
        { key: 'saturday',  label: 'Saturday' },
        { key: 'sunday',    label: 'Sunday' },
    ];

    let availabilityMap = $state<Record<string, { isAvailable: boolean; startTime: string; endTime: string }>>(
        Object.fromEntries(days.map(d => {
            const existing = availability.find(a => a.dayOfWeek === d.key);
            return [d.key, {
                isAvailable: existing?.isAvailable ?? false,
                startTime: existing?.startTime ?? '09:00',
                endTime: existing?.endTime ?? '17:00'
            }];
        }))
    );

    let isSaving = $state(false);
    let showSuccess = $state(false);
    let currentMode = $state(listing.availabilityMode ?? 'weekly');

    // New specific date form
    let newDate = $state('');
    let newStartTime = $state('09:00');
    let newEndTime = $state('17:00');
    let newNotes = $state('');

    let today = new Date().toISOString().split('T')[0];

    function showToast() {
        showSuccess = true;
        setTimeout(() => showSuccess = false, 3000);
    }

    function formatDate(dateStr: string) {
        const parts = dateStr.split('-').map(Number);
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
</script>

<div class="max-w-2xl mx-auto p-6 pb-20 space-y-6">

    <!-- Header -->
    <div class="mb-2">
        <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900 mt-4">Set Availability</h1>
        <p class="text-slate-500 mt-1">Let clients know when you're available for bookings.</p>
    </div>

    <!-- Success Toast -->
    {#if showSuccess}
        <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <span>✅</span>
            <p class="text-emerald-800 font-bold text-sm">Saved successfully!</p>
        </div>
    {/if}

    {#if form?.message}
        <div class="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
        </div>
    {/if}

    <!-- Booking Toggle -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <form method="POST" action="?/toggleBooking" use:enhance={() => {
            return async ({ update }) => { await update({ reset: false }); };
        }}>
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-black text-slate-900">Booking System</p>
                    <p class="text-xs text-slate-500 mt-0.5">
                        {listing.bookingEnabled ? '✅ Clients can request bookings' : '❌ Booking is disabled'}
                    </p>
                </div>
                <button type="submit"
                    class="px-4 py-2 rounded-xl text-xs font-black transition-all
                    {listing.bookingEnabled
                        ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'}">
                    {listing.bookingEnabled ? 'Disable Bookings' : 'Enable Bookings'}
                </button>
            </div>
        </form>
    </div>

    <!-- Mode Selector -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Availability Mode</h3>
        <form method="POST" action="?/setMode" use:enhance={() => {
            return async ({ update }) => {
                await update({ reset: false });
                showToast();
            };
        }} class="grid grid-cols-2 gap-3">
            {#each [
                { value: 'weekly', label: '📅 Weekly Schedule', desc: 'Repeat every week' },
                { value: 'specific', label: '🗓️ Specific Dates', desc: 'Choose exact dates' },
            ] as mode}
                <label class="cursor-pointer">
                    <input type="radio" name="mode" value={mode.value}
                        checked={currentMode === mode.value}
                        onchange={() => currentMode = mode.value}
                        class="sr-only peer" />
                    <div class="p-4 rounded-2xl border-2 transition-all text-center
                        peer-checked:border-indigo-600 peer-checked:bg-indigo-50 border-slate-200 hover:border-slate-300">
                        <p class="font-black text-sm text-slate-900">{mode.label}</p>
                        <p class="text-[11px] text-slate-400 mt-0.5">{mode.desc}</p>
                    </div>
                </label>
            {/each}
            <button type="submit"
                class="col-span-2 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                Save Mode →
            </button>
        </form>
    </div>

    <!-- Weekly Schedule -->
    {#if currentMode === 'weekly'}
        <form method="POST" action="?/saveAvailability"
            use:enhance={() => {
                isSaving = true;
                return async ({ update }) => {
                    await update({ reset: false });
                    isSaving = false;
                    showToast();
                };
            }}
            class="space-y-4"
        >
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <p class="text-xs font-black text-slate-500 uppercase tracking-widest">Weekly Schedule</p>
                </div>
                <div class="divide-y divide-slate-100">
                    {#each days as day}
                        <div class="p-5 flex items-center gap-4 flex-wrap">
                            <label class="flex items-center gap-3 cursor-pointer min-w-[140px]">
                                <input
                                    type="checkbox"
                                    name="{day.key}_available"
                                    bind:checked={availabilityMap[day.key].isAvailable}
                                    class="w-4 h-4 rounded accent-indigo-600"
                                />
                                <span class="font-black text-slate-900 text-sm">{day.label}</span>
                            </label>
                            {#if availabilityMap[day.key].isAvailable}
                                <div class="flex items-center gap-3 flex-1">
                                    <div class="flex items-center gap-2">
                                        <label class="text-xs text-slate-400 font-bold">From</label>
                                        <input type="time" name="{day.key}_start"
                                            bind:value={availabilityMap[day.key].startTime}
                                            class="p-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <label class="text-xs text-slate-400 font-bold">To</label>
                                        <input type="time" name="{day.key}_end"
                                            bind:value={availabilityMap[day.key].endTime}
                                            class="p-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                                    </div>
                                </div>
                            {:else}
                                <span class="text-xs text-slate-400 italic">Not available</span>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>
            <button type="submit" disabled={isSaving}
                class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 text-lg shadow-lg shadow-indigo-200">
                {isSaving ? 'Saving...' : 'Save Weekly Schedule →'}
            </button>
        </form>

    <!-- Specific Dates -->
    {:else}
        <div class="space-y-4">

            <!-- Add New Date -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Add Available Date</h3>

                <form method="POST" action="?/addSpecificDate" use:enhance={() => {
    return async ({ update }) => {
        await update();
        newDate = '';
        newStartTime = '09:00';
        newEndTime = '17:00';
        newNotes = '';
        showToast();
    };
}} class="space-y-3">


                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-600 mb-1">Date *</label>
                            <input type="date" name="date" required min={today}
                                bind:value={newDate}
                                class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                                style="color-scheme: light;" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 mb-1">Start Time *</label>
                            <input type="time" name="startTime" required
                                bind:value={newStartTime}
                                class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 mb-1">End Time *</label>
                            <input type="time" name="endTime" required
                                bind:value={newEndTime}
                                class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-600 mb-1">Note <span class="text-slate-400 font-normal">(optional)</span></label>
                        <input type="text" name="notes"
                            bind:value={newNotes}
                            placeholder="e.g. Spring Market, Holiday Special..."
                            class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                    </div>
                    <button type="submit"
                        class="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                        + Add Date
                    </button>
                </form>
            </div>

            <!-- Existing Specific Dates -->
            {#if specificDates.length === 0}
                <div class="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <span class="text-4xl block mb-3">🗓️</span>
                    <p class="font-black text-slate-900">No specific dates added yet</p>
                    <p class="text-xs text-slate-400 mt-1">Add your available dates above</p>
                </div>
            {:else}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div class="px-6 py-4 bg-slate-50 border-b border-slate-100">
                        <p class="text-xs font-black text-slate-500 uppercase tracking-widest">
                            Your Available Dates ({specificDates.length})
                        </p>
                    </div>
                    <div class="divide-y divide-slate-100">
                        {#each specificDates as sd}
                            <div class="p-4 flex items-center gap-4">
                                <div class="flex-shrink-0 text-center bg-indigo-50 rounded-xl p-3 min-w-[56px]">
                                    <p class="text-[10px] font-black text-indigo-600 uppercase">
                                        {new Date(sd.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                                    </p>
                                    <p class="text-2xl font-black text-slate-900 leading-none mt-0.5">
                                        {new Date(sd.date + 'T00:00:00').getDate()}
                                    </p>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-black text-slate-900 text-sm">{formatDate(sd.date)}</p>
                                    <p class="text-xs text-indigo-600 font-bold mt-0.5">
                                        {sd.startTime} – {sd.endTime}
                                    </p>
                                    {#if sd.notes}
                                        <p class="text-xs text-slate-400 mt-0.5 italic">{sd.notes}</p>
                                    {/if}
                                </div>
                                <form method="POST" action="?/deleteSpecificDate" use:enhance={() => {
                                    return async ({ update }) => { await update(); };
                                }}>
                                    <input type="hidden" name="id" value={sd.id} />
                                    <button type="submit"
                                        class="px-3 py-2 text-xs font-black rounded-xl bg-red-50 text-red-500 border border-red-200 hover:bg-red-600 hover:text-white transition-all">
                                        🗑 Remove
                                    </button>
                                </form>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/if}

</div>