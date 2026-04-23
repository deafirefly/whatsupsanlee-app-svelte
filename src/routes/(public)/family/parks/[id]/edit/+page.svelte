<!-- src/routes/(public)/family/parks/[id]/edit/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    const { place } = data;

    let isSubmitting = $state(false);
    let selectedType = $state(place.type);
    let selectedAge = $state(place.ageRange ?? 'all');
    let selectedFeatures = $state<string[]>(place.features ?? []);

    const types = [
        { value: 'park', label: 'Park', emoji: '🌳' },
        { value: 'playground', label: 'Playground', emoji: '🛝' },
        { value: 'trail', label: 'Trail', emoji: '🥾' },
        { value: 'sports_field', label: 'Sports Field', emoji: '⚽' },
        { value: 'swimming', label: 'Swimming', emoji: '🏊' },
        { value: 'picnic', label: 'Picnic Area', emoji: '🧺' },
    ];

    const featureOptions = [
        'Restrooms', 'Parking', 'Picnic Tables', 'Water Fountain',
        'Dog Friendly', 'ADA Accessible', 'Covered Shelter', 'Grills/BBQ',
        'Fishing', 'Boat Launch', 'Bike Racks', 'Lighting',
        'Drinking Water', 'Swimming Area', 'Splash Pad'
    ];

    function toggleFeature(f: string) {
        selectedFeatures = selectedFeatures.includes(f)
            ? selectedFeatures.filter(x => x !== f)
            : [...selectedFeatures, f];
    }
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <div class="mb-8">
        <a href="/family/parks/{place.id}" class="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 mb-4">
            ← Back to Listing
        </a>
        <h1 class="text-3xl font-black text-slate-900">Edit Place 📍</h1>
        <p class="text-slate-500 mt-1">Make your changes and resubmit for review.</p>
    </div>

    {#if place.status === 'rejected'}
        <div class="mb-6 flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl p-4">
            <span class="text-lg">❌</span>
            <p class="font-bold">This listing was rejected. Edit and resubmit below.</p>
        </div>
    {/if}

    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-bold">⚠ {form.message}</div>
    {/if}

    <form method="POST" use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => { await update(); isSubmitting = false; };
    }} class="space-y-8">

        <input type="hidden" name="features" value={JSON.stringify(selectedFeatures)} />
        <input type="hidden" name="type" value={selectedType} />
        <input type="hidden" name="ageRange" value={selectedAge} />

        <!-- Type -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Type of Place *</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                {#each types as type}
                    <button type="button" onclick={() => selectedType = type.value}
                        class="p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all
                        {selectedType === type.value ? 'border-sky-600 bg-sky-50 text-sky-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}">
                        <span class="text-2xl">{type.emoji}</span>
                        <span class="text-xs font-bold">{type.label}</span>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Basic Info</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Name *</label>
                <input name="name" required value={place.name}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea name="description" rows={3}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none">{place.description ?? ''}</textarea>
            </div>
        </div>

        <!-- Trail Details -->
        {#if selectedType === 'trail'}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
                <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Trail Details</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Length</label>
                        <input name="trailLength" value={place.trailLength ?? ''}
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Difficulty</label>
                        <select name="trailDifficulty"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white">
                            <option value="">Select...</option>
                            <option value="easy" selected={place.trailDifficulty === 'easy'}>Easy</option>
                            <option value="moderate" selected={place.trailDifficulty === 'moderate'}>Moderate</option>
                            <option value="hard" selected={place.trailDifficulty === 'hard'}>Hard</option>
                        </select>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Age Range -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Best For</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                {#each [
                    { value: 'all', label: 'All Ages', emoji: '👨‍👩‍👧‍👦' },
                    { value: 'toddler', label: 'Toddlers', emoji: '👶' },
                    { value: 'kids', label: 'Kids', emoji: '🧒' },
                    { value: 'teens', label: 'Teens', emoji: '🧑' },
                ] as age}
                    <button type="button" onclick={() => selectedAge = age.value}
                        class="p-3 border-2 rounded-2xl text-center transition-all
                        {selectedAge === age.value ? 'border-sky-600 bg-sky-50' : 'border-slate-100 hover:border-slate-200'}">
                        <span class="text-xl block">{age.emoji}</span>
                        <span class="text-xs font-bold text-slate-700">{age.label}</span>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Features -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Features & Amenities</h3>
            <div class="flex flex-wrap gap-2">
                {#each featureOptions as feature}
                    <button type="button" onclick={() => toggleFeature(feature)}
                        class="px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all
                        {selectedFeatures.includes(feature) ? 'border-sky-600 bg-sky-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-sky-300'}">
                        {selectedFeatures.includes(feature) ? '✓ ' : '+ '}{feature}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Location</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Address</label>
                <input name="address" value={place.address ?? ''}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Google Maps Link</label>
                <input name="locationPin" value={place.locationPin ?? ''}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
        </div>

        <button type="submit" disabled={isSubmitting}
            class="w-full py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 shadow-lg transition-all disabled:opacity-50 text-lg">
            {isSubmitting ? 'Saving...' : 'Save & Resubmit for Review 📍'}
        </button>

    </form>
</div>