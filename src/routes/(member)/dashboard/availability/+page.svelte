<script lang="ts">
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    const { listing, availability } = data;

    const days = [
        { key: 'monday',    label: 'Monday' },
        { key: 'tuesday',   label: 'Tuesday' },
        { key: 'wednesday', label: 'Wednesday' },
        { key: 'thursday',  label: 'Thursday' },
        { key: 'friday',    label: 'Friday' },
        { key: 'saturday',  label: 'Saturday' },
        { key: 'sunday',    label: 'Sunday' },
    ];

    // Build a map of existing availability
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

    function showToast() {
        showSuccess = true;
        setTimeout(() => showSuccess = false, 3000);
    }
</script>

<div class="max-w-2xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-8">
        <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900 mt-4">Set Availability</h1>
        <p class="text-slate-500 mt-1">Let clients know when you're available for bookings.</p>
    </div>

    <!-- Booking Toggle -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-6">
        <form method="POST" action="?/toggleBooking" use:enhance={() => {
            return async ({ update }) => { await update({ reset: false }); };
        }}>
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-black text-slate-900">Booking System</p>
                    <p class="text-xs text-slate-500 mt-0.5">
                        {listing.bookingEnabled ? '✅ Clients can request bookings from your listing' : '❌ Booking is disabled on your listing'}
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

    <!-- Success Toast -->
    {#if showSuccess}
        <div class="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <span>✅</span>
            <p class="text-emerald-800 font-bold text-sm">Availability saved successfully!</p>
        </div>
    {/if}

    <!-- Error -->
    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
        </div>
    {/if}

    <form
        method="POST"
        action="?/saveAvailability"
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
                        <!-- Day Toggle -->
                        <label class="flex items-center gap-3 cursor-pointer min-w-[140px]">
                            <input
                                type="checkbox"
                                name="{day.key}_available"
                                bind:checked={availabilityMap[day.key].isAvailable}
                                class="w-4 h-4 rounded accent-indigo-600"
                            />
                            <span class="font-black text-slate-900 text-sm">{day.label}</span>
                        </label>

                        <!-- Time Range -->
                        {#if availabilityMap[day.key].isAvailable}
                            <div class="flex items-center gap-3 flex-1">
                                <div class="flex items-center gap-2">
                                    <label class="text-xs text-slate-400 font-bold">From</label>
                                    <input
                                        type="time"
                                        name="{day.key}_start"
                                        bind:value={availabilityMap[day.key].startTime}
                                        class="p-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                                    />
                                </div>
                                <div class="flex items-center gap-2">
                                    <label class="text-xs text-slate-400 font-bold">To</label>
                                    <input
                                        type="time"
                                        name="{day.key}_end"
                                        bind:value={availabilityMap[day.key].endTime}
                                        class="p-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        {:else}
                            <span class="text-xs text-slate-400 italic">Not available</span>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

        <button
            type="submit"
            disabled={isSaving}
            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 text-lg shadow-lg shadow-indigo-200"
        >
            {isSaving ? 'Saving...' : 'Save Availability →'}
        </button>
    </form>
</div>