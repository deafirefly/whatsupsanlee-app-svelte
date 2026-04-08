<script lang="ts">
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    const { allAreas, allCommunities } = data;

    let imageUrl = $state('');
    let isUploading = $state(false);
    let isSubmitting = $state(false);
    let isMultiDay = $state(false);
    let selectedAreaId = $state('');
    let uploader: any = null;

    // Filter communities by selected area
    let filteredCommunities = $derived(
        selectedAreaId
            ? allCommunities.filter((c: any) => c.areaId === Number(selectedAreaId))
            : []
    );

    const categories = [
        { value: 'food_truck',     label: 'Food Truck',      emoji: '🚚' },
        { value: 'open_house',     label: 'Open House',      emoji: '🏠' },
        { value: 'yard_sale',      label: 'Yard Sale',       emoji: '🛍️' },
        { value: 'farmers_market', label: "Farmer's Market", emoji: '🌽' },
        { value: 'movie',          label: 'Movie',           emoji: '🎬' },
        { value: 'community',      label: 'Community',       emoji: '🎉' },
        { value: 'arts',           label: 'Arts & Crafts',   emoji: '🎨' },
        { value: 'church',         label: 'Church',          emoji: '⛪' },
        { value: 'school',         label: 'School',          emoji: '🏫' },
        { value: 'other',          label: 'Other',           emoji: '📦' },
    ];

    let selectedCategory = $state('');

    onMount(async () => {
        try {
            const { genUploader } = await import('uploadthing/client');
            uploader = genUploader({ url: '/api/uploadthing' });
        } catch (err) {
            console.error('Uploadthing init error:', err);
        }
    });

    async function handleImageChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file || !uploader) return;
        try {
            isUploading = true;
            const res = await uploader.uploadFiles('listingImage', { files: [file] });
            if (res?.[0]) imageUrl = res[0].url;
            isUploading = false;
        } catch (err: any) {
            isUploading = false;
            console.error('Upload failed:', err);
        }
    }
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-8">
        <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900 mt-4">Post an Event</h1>
        <p class="text-slate-500 mt-1">Share what's happening in Lee County!</p>
    </div>

    <!-- Error Message -->
    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
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
        class="space-y-6"
    >

        <!-- Category Picker -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Event Type</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {#each categories as cat}
                    <button
                        type="button"
                        onclick={() => selectedCategory = cat.value}
                        class="p-3 border-2 rounded-xl flex flex-col items-center gap-1.5 transition-all
                        {selectedCategory === cat.value
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}"
                    >
                        <span class="text-xl {selectedCategory === cat.value ? 'scale-110' : ''} transition-transform">
                            {cat.emoji}
                        </span>
                        <span class="text-[10px] font-black text-center leading-tight">{cat.label}</span>
                    </button>
                {/each}
            </div>
            <input type="hidden" name="category" value={selectedCategory} />
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Event Details</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Event Title *</label>
                <input
                    name="title"
                    required
                    placeholder="e.g. Saturday Yard Sale, Open House at 123 Main St"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea
                    name="description"
                    rows={3}
                    placeholder="Tell people what to expect..."
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm resize-none"
                ></textarea>
            </div>
        </div>

        <!-- Event Image -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Event Photo <span class="text-slate-400 font-normal normal-case text-[11px]">(optional)</span></h3>
            {#if imageUrl}
                <div class="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 mb-3">
                    <img src={imageUrl} alt="Event preview" class="w-full h-full object-cover" />
                    <button
                        type="button"
                        onclick={() => imageUrl = ''}
                        class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black hover:bg-red-600 transition-all">
                        🗑 Remove
                    </button>
                </div>
            {:else}
                <div class="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center gap-3">
                    {#if isUploading}
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p class="text-xs font-black text-indigo-600 uppercase animate-pulse">Uploading...</p>
                        </div>
                    {:else}
                        <span class="text-3xl">📸</span>
                        <label class="cursor-pointer bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md">
                            Choose Photo
                            <input type="file" accept="image/*" class="hidden" onchange={handleImageChange} />
                        </label>
                        <p class="text-[11px] text-slate-400 uppercase font-black tracking-widest">Max 4MB</p>
                    {/if}
                </div>
            {/if}
            <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>

        <!-- Date & Time -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Date & Time</h3>
                <label class="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        bind:checked={isMultiDay}
                        class="w-4 h-4 rounded accent-indigo-600"
                    />
                    <span class="text-xs font-bold text-slate-600">Multi-day event</span>
                </label>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">
                        {isMultiDay ? 'Start Date *' : 'Date *'}
                    </label>
                    <input
                        name="startDate"
                        type="date"
                        required
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                    />
                </div>
                {#if isMultiDay}
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">End Date *</label>
                        <input
                            name="endDate"
                            type="date"
                            required
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                        />
                    </div>
                {/if}
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Start Time</label>
                    <input
                        name="startTime"
                        type="time"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                    />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">End Time</label>
                    <input
                        name="endTime"
                        type="time"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                    />
                </div>
            </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Location</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Location Name</label>
                <input
                    name="locationName"
                    placeholder="e.g. Depot Park, 123 Main St"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Address</label>
                <input
                    name="address"
                    placeholder="Full street address"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Google Maps Pin <span class="text-slate-400 font-normal">(optional)</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-3.5 text-slate-400">📍</span>
                    <input
                        name="locationPin"
                        placeholder="Paste Google Maps link here"
                        class="w-full p-3 pl-9 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                    />
                </div>
            </div>
        </div>

        <!-- Area & Community -->
        {#if allAreas.length > 0}
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Area & Community <span class="text-slate-400 font-normal normal-case text-[11px]">(optional)</span></h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Area</label>
                    <select
                        name="areaId"
                        bind:value={selectedAreaId}
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none bg-white text-sm"
                    >
                        <option value="">Select an area...</option>
                        {#each allAreas as area}
                            <option value={area.id}>{area.name}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Community</label>
                    <select
                        name="communityId"
                        disabled={filteredCommunities.length === 0}
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none bg-white text-sm disabled:opacity-50"
                    >
                        <option value="">
                            {selectedAreaId ? 'Select community...' : 'Select area first'}
                        </option>
                        {#each filteredCommunities as community}
                            <option value={community.id}>{community.name}</option>
                        {/each}
                    </select>
                </div>
            </div>
        </div>
        {/if}

        <!-- Family Friendly -->
<div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
    <div class="flex items-center justify-between">
        <div>
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">👨‍👩‍👧‍👦 Family Friendly</h3>
            <p class="text-xs text-slate-400">Check this if the event is suitable for families with children.</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="isFamilyFriendly" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
        </label>
    </div>
</div>

        <!-- Submit -->
        <button
            type="submit"
            disabled={isSubmitting || !selectedCategory}
            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 text-lg"
        >
            {isSubmitting ? 'Submitting...' : 'Submit Event for Approval →'}
        </button>

    </form>
</div>