<script lang="ts">
    import { enhance } from '$app/forms';

    let { form } = $props();

    let category = $state('food_truck');
    let scheduleType = $state('weekly');
    let selectedDays = $state(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    let startTime = $state('09:00');
    let endTime = $state('17:00');
    let specificDates = $state('');
    let isSubmitting = $state(false);

    let scheduleSummary = $derived(
        scheduleType === 'weekly'
            ? `${selectedDays.join(', ')} | ${startTime}-${endTime}`
            : specificDates
    );

    const categories = [
        { value: 'food_truck', label: 'Food Truck', emoji: '🚚' },
        { value: 'farmer', label: 'Farmer', emoji: '👨‍🌾' },
        { value: 'photographer', label: 'Photographer', emoji: '📸' },
        { value: 'artist', label: 'Artist', emoji: '🎨' },
    ];
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-8">
        <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-4">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900">Create a Listing</h1>
        <p class="text-slate-500 mt-1">Share your business or craft with the San Lee community.</p>
    </div>

    <!-- Error Message -->
    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-bold">
            ⚠ {form.message}
        </div>
    {/if}

    <form
        method="POST"
        use:enhance={() => {
            isSubmitting = true;
            return async ({ update }) => {
                await update();
                isSubmitting = false;
            };
        }}
        class="space-y-8"
    >
        <!-- Category Picker -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Category</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each categories as cat}
                    <button
                        type="button"
                        onclick={() => category = cat.value}
                        class="p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all duration-200
                        {category === cat.value
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm'
                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'}"
                    >
                        <span class="text-2xl transition-transform {category === cat.value ? 'scale-110' : ''}">
                            {cat.emoji}
                        </span>
                        <span class="text-xs font-bold">{cat.label}</span>
                    </button>
                {/each}
            </div>
            <input type="hidden" name="category" value={category} />
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Basic Info</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Business Name *</label>
                    <input
                        name="businessName"
                        required
                        placeholder="e.g. Dinkins Food Truck"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Contact Person *</label>
                    <input
                        name="contactPerson"
                        required
                        placeholder="Your name"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Your Story / Bio</label>
                <textarea
                    name="bio"
                    placeholder="Tell the community about yourself, your food, your craft..."
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
            </div>
        </div>

        <!-- Contact Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Contact Info</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                    <input
                        name="phone"
                        type="tel"
                        placeholder="(910) 555-0123"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="hello@yourbusiness.com"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Website</label>
                <input
                    name="website"
                    type="url"
                    placeholder="https://yourbusiness.com"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Location</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Physical Address / Area *</label>
                <input
                    name="address"
                    required
                    placeholder="e.g. 123 Main St or 'Downtown Sanford Area'"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Google Maps Pin <span class="text-slate-400 font-normal">(optional)</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-3.5 text-slate-400">📍</span>
                    <input
                        name="locationPin"
                        placeholder="Paste Google Maps link here"
                        class="w-full p-3 pl-9 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <p class="text-[11px] text-slate-400 mt-1">Tip: Open Google Maps → drop a pin → tap Share → copy link.</p>
            </div>
        </div>

        <!-- Schedule -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <div class="flex items-center justify-between mb-2">
                <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Schedule</h3>
                <div class="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        type="button"
                        onclick={() => scheduleType = 'weekly'}
                        class="px-3 py-1 text-[10px] font-bold rounded-md transition-all
                        {scheduleType === 'weekly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}">
                        WEEKLY
                    </button>
                    <button
                        type="button"
                        onclick={() => scheduleType = 'event'}
                        class="px-3 py-1 text-[10px] font-bold rounded-md transition-all
                        {scheduleType === 'event' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}">
                        DATES / EVENTS
                    </button>
                </div>
            </div>

            {#if scheduleType === 'weekly'}
                <div class="space-y-4">
                    <p class="text-xs text-slate-400 italic">Select the days you're typically available.</p>
                    <div class="flex flex-wrap gap-2">
                        {#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as day}
                            <button
                                type="button"
                                onclick={() => {
                                    if (selectedDays.includes(day)) {
                                        selectedDays = selectedDays.filter(d => d !== day);
                                    } else {
                                        selectedDays = [...selectedDays, day];
                                    }
                                }}
                                class="w-11 h-11 rounded-full border-2 font-bold text-[10px] transition-all
                                {selectedDays.includes(day)
                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                                    : 'border-slate-200 bg-white text-slate-400 hover:border-indigo-300'}">
                                {day}
                            </button>
                        {/each}
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">Start Time</label>
                            <input type="time" bind:value={startTime} class="w-full p-2 border border-slate-200 rounded-xl text-sm" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-500 mb-1">End Time</label>
                            <input type="time" bind:value={endTime} class="w-full p-2 border border-slate-200 rounded-xl text-sm" />
                        </div>
                    </div>
                </div>
            {:else}
                <div class="space-y-2">
                    <textarea
                        bind:value={specificDates}
                        placeholder="e.g. 'Opening Gala: Feb 20th, 6pm–9pm' or 'Every first Saturday at the Art Walk'"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                    ></textarea>
                    <p class="text-[11px] text-slate-400">Best for pop-up events, workshops, or seasonal markets.</p>
                </div>
            {/if}

            <input type="hidden" name="scheduleSummary" value={scheduleSummary} />
            <input type="hidden" name="specificDates" value={specificDates} />
        </div>

        <!-- Social Media -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Social Media <span class="text-slate-400 font-normal normal-case text-[11px]">(all optional)</span></h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">📸 Instagram</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-sm font-bold">@</span>
                        <input name="instagram" placeholder="yourhandle" class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">👤 Facebook</label>
                    <input name="facebook" placeholder="facebook.com/yourpage" class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">🐦 X / Twitter</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-sm font-bold">@</span>
                        <input name="twitter" placeholder="yourhandle" class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">🎵 TikTok</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-sm font-bold">@</span>
                        <input name="tiktok" placeholder="yourhandle" class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Submit -->
        <button
            type="submit"
            disabled={isSubmitting}
            class="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
            {isSubmitting ? 'Submitting...' : 'Submit for Approval →'}
        </button>

    </form>
</div>