<!-- src/routes/(public)/family/parks/submit/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { form } = $props();

    let isSubmitting = $state(false);
    let selectedType = $state('park');
    let selectedAge = $state('all');
    let selectedFeatures = $state<string[]>([]);

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
        <a href="/family" class="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 mb-4">
            ← Back to Family Hub
        </a>
        <h1 class="text-3xl font-black text-slate-900">Submit a Place 📍</h1>
        <p class="text-slate-500 mt-1">Add a park, trail, or family spot to the Lee County directory.</p>
    </div>

    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-bold">
            ⚠ {form.message}
        </div>
    {/if}

    <form method="POST" use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => { await update(); isSubmitting = false; };
    }} class="space-y-8">

        <input type="hidden" name="features" value={JSON.stringify(selectedFeatures)} />

        <!-- Type -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Type of Place *</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                {#each types as type}
                    <button type="button" onclick={() => selectedType = type.value}
                        class="p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all
                        {selectedType === type.value
                            ? 'border-sky-600 bg-sky-50 text-sky-700'
                            : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}">
                        <span class="text-2xl">{type.emoji}</span>
                        <span class="text-xs font-bold">{type.label}</span>
                    </button>
                {/each}
            </div>
            <input type="hidden" name="type" value={selectedType} />
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Basic Info</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Name *</label>
                <input name="name" required placeholder="e.g. Horner Park, Deep River Trail"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Description <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea name="description" rows={3}
                    placeholder="Describe what makes this place great for families..."
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"></textarea>
            </div>
        </div>

        <!-- Trail specific -->
        {#if selectedType === 'trail'}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
                <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Trail Details</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Length</label>
                        <input name="trailLength" placeholder="e.g. 2.3 miles"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Difficulty</label>
                        <select name="trailDifficulty"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none bg-white">
                            <option value="">Select...</option>
                            <option value="easy">Easy</option>
                            <option value="moderate">Moderate</option>
                            <option value="hard">Hard</option>
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
                        {selectedAge === age.value
                            ? 'border-sky-600 bg-sky-50'
                            : 'border-slate-100 hover:border-slate-200'}">
                        <span class="text-xl block">{age.emoji}</span>
                        <span class="text-xs font-bold text-slate-700">{age.label}</span>
                    </button>
                {/each}
            </div>
            <input type="hidden" name="ageRange" value={selectedAge} />
        </div>

        <!-- Features -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-sky-600 uppercase tracking-widest mb-2">Features & Amenities</h3>
            <div class="flex flex-wrap gap-2">
                {#each featureOptions as feature}
                    <button type="button" onclick={() => toggleFeature(feature)}
                        class="px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all
                        {selectedFeatures.includes(feature)
                            ? 'border-sky-600 bg-sky-600 text-white'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-sky-300'}">
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
                <input name="address" placeholder="e.g. 123 Park Dr, Sanford, NC"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Google Maps Link <span class="text-slate-400 font-normal">(optional)</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-3.5 text-slate-400">📍</span>
                    <input name="locationPin" placeholder="Paste Google Maps link here"
                        class="w-full p-3 pl-9 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
            </div>
        </div>

        <button type="submit" disabled={isSubmitting}
            class="w-full py-4 bg-sky-600 text-white font-black rounded-2xl hover:bg-sky-700 shadow-lg transition-all disabled:opacity-50 text-lg">
            {isSubmitting ? 'Submitting...' : 'Submit for Review 📍'}
        </button>

    </form>
</div>