<!-- src/routes/(member)/farmers/[id]/edit/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';

    let { data, form } = $props();
    const { farmer } = data;

    let isSubmitting = $state(false);
    let imageUrl = $state(farmer.imageUrl ?? '');
    let isUploading = $state(false);
    let uploader: any = null;

    const produceOptions = [
        'Vegetables', 'Fruits', 'Eggs', 'Honey', 'Herbs', 'Flowers',
        'Meat', 'Dairy', 'Baked Goods', 'Preserves', 'Plants/Seedlings', 'Microgreens'
    ];
    const seasonOptions = ['Spring', 'Summer', 'Fall', 'Winter', 'Year-round'];
    const marketOptions = [
        'Sanford Farmers Market', 'Broadway Farmers Market',
        'Tramway Market', 'Lee County Fairgrounds Market'
    ];

    let selectedProduce = $state<string[]>(farmer.produceCategories ?? []);
    let selectedSeasons = $state<string[]>(farmer.seasonalAvailability ?? []);
    let selectedMarkets = $state<string[]>(farmer.marketsAttended ?? []);
    let customMarket = $state('');
    let isUpick = $state(farmer.isUpick ?? false);
    let acceptsSnapEbt = $state(farmer.acceptsSnapEbt ?? false);
    let offersDelivery = $state(farmer.offersDelivery ?? false);
    let isOrganic = $state(farmer.isOrganic ?? false);
    let acceptsPreorders = $state(farmer.acceptsPreorders ?? false);

    function toggleItem(arr: string[], item: string): string[] {
        return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
    }

    function addCustomMarket() {
        const trimmed = customMarket.trim();
        if (trimmed && !selectedMarkets.includes(trimmed)) selectedMarkets = [...selectedMarkets, trimmed];
        customMarket = '';
    }

    onMount(async () => {
        try {
            const { genUploader } = await import('uploadthing/client');
            uploader = genUploader({ url: '/api/uploadthing' });
        } catch (err) { console.error('Uploadthing init error:', err); }
    });

    async function handleImageChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file || !uploader) return;
        try {
            isUploading = true;
            const res = await uploader.uploadFiles('listingImage', { files: [file] });
            if (res?.[0]) imageUrl = res[0].url;
            isUploading = false;
        } catch (err: any) { isUploading = false; }
    }
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <div class="mb-8">
        <a href="/farmers/{farmer.id}" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-4">
            ← Back to Listing
        </a>
        <h1 class="text-3xl font-black text-slate-900">Edit Farm Listing 🌾</h1>
        <p class="text-slate-500 mt-1">Make your changes and resubmit for review.</p>
    </div>

    {#if farmer.status === 'rejected'}
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

        <input type="hidden" name="imageUrl" value={imageUrl} />
        <input type="hidden" name="produceCategories" value={JSON.stringify(selectedProduce)} />
        <input type="hidden" name="seasonalAvailability" value={JSON.stringify(selectedSeasons)} />
        <input type="hidden" name="marketsAttended" value={JSON.stringify(selectedMarkets)} />
        <input type="hidden" name="isUpick" value={String(isUpick)} />
        <input type="hidden" name="acceptsSnapEbt" value={String(acceptsSnapEbt)} />
        <input type="hidden" name="offersDelivery" value={String(offersDelivery)} />
        <input type="hidden" name="isOrganic" value={String(isOrganic)} />
        <input type="hidden" name="acceptsPreorders" value={String(acceptsPreorders)} />

        <!-- Photo -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Farm Photo</h3>
            {#if imageUrl}
                <div class="relative rounded-2xl overflow-hidden border border-slate-200 h-48 bg-slate-100">
                    <img src={imageUrl} alt="Preview" class="w-full h-full object-cover" />
                    <button type="button" onclick={() => imageUrl = ''}
                        class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black hover:bg-red-600 transition-all">
                        🗑 Remove
                    </button>
                </div>
            {:else}
                <div class="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center gap-3">
                    {#if isUploading}
                        <div class="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    {:else}
                        <span class="text-3xl">📸</span>
                        <label class="cursor-pointer bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-all">
                            Upload Photo
                            <input type="file" accept="image/*" class="hidden" onchange={handleImageChange} />
                        </label>
                    {/if}
                </div>
            {/if}
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Farm Info</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Farm Name *</label>
                <input name="farmName" required value={farmer.farmName}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Your Name *</label>
                <input name="contactName" required value={farmer.contactName}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">About Your Farm</label>
                <textarea name="bio" rows={4}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none">{farmer.bio ?? ''}</textarea>
            </div>
        </div>

        <!-- What You Sell -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">What You Sell *</h3>
            <div class="flex flex-wrap gap-2">
                {#each produceOptions as option}
                    <button type="button" onclick={() => selectedProduce = toggleItem(selectedProduce, option)}
                        class="px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all
                        {selectedProduce.includes(option) ? 'border-green-600 bg-green-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-green-400'}">
                        {selectedProduce.includes(option) ? '✓ ' : '+ '}{option}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Seasonal Availability -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">When Are You Available?</h3>
            <div class="flex flex-wrap gap-2">
                {#each seasonOptions as season}
                    <button type="button" onclick={() => selectedSeasons = toggleItem(selectedSeasons, season)}
                        class="px-4 py-2 text-xs font-bold rounded-full border-2 transition-all
                        {selectedSeasons.includes(season) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300'}">
                        {selectedSeasons.includes(season) ? '✓ ' : ''}{season}
                    </button>
                {/each}
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Current Availability Note</label>
                <input name="currentAvailabilityNote" value={farmer.currentAvailabilityNote ?? ''}
                    placeholder="e.g. Tomatoes available now through September!"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Location</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Farm Address</label>
                <input name="farmAddress" value={farmer.farmAddress ?? ''}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Google Maps Link</label>
                <input name="locationPin" value={farmer.locationPin ?? ''}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
        </div>

        <!-- Markets -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Markets Attended</h3>
            <div class="flex flex-wrap gap-2">
                {#each marketOptions as market}
                    <button type="button" onclick={() => selectedMarkets = toggleItem(selectedMarkets, market)}
                        class="px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all
                        {selectedMarkets.includes(market) ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300'}">
                        {selectedMarkets.includes(market) ? '✓ ' : '+ '}{market}
                    </button>
                {/each}
            </div>
            <div class="flex gap-2">
                <input bind:value={customMarket} placeholder="Add another market..."
                    onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomMarket(); }}}
                    class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button type="button" onclick={addCustomMarket}
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700">Add</button>
            </div>
        </div>

        <!-- Special Features -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-3">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Special Features</h3>
            {#each [
                { key: 'isUpick', label: '🍓 U-Pick Available', bind: isUpick },
                { key: 'acceptsSnapEbt', label: '💳 Accepts SNAP/EBT', bind: acceptsSnapEbt },
                { key: 'offersDelivery', label: '🚚 Offers Delivery', bind: offersDelivery },
                { key: 'isOrganic', label: '🌿 Organic', bind: isOrganic },
                { key: 'acceptsPreorders', label: '📋 Accepts Pre-orders', bind: acceptsPreorders },
            ] as feature}
                <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" class="sr-only peer"
                        checked={feature.bind}
                        onchange={() => {
                            if (feature.key === 'isUpick') isUpick = !isUpick;
                            else if (feature.key === 'acceptsSnapEbt') acceptsSnapEbt = !acceptsSnapEbt;
                            else if (feature.key === 'offersDelivery') offersDelivery = !offersDelivery;
                            else if (feature.key === 'isOrganic') isOrganic = !isOrganic;
                            else if (feature.key === 'acceptsPreorders') acceptsPreorders = !acceptsPreorders;
                        }} />
                    <div class="w-10 h-6 bg-slate-200 peer-checked:bg-green-500 rounded-full transition-all relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"></div>
                    <span class="text-sm font-bold text-slate-700">{feature.label}</span>
                </label>
            {/each}
        </div>

        <!-- Contact -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Contact & Social</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                    <input name="phone" type="tel" value={farmer.phone ?? ''}
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input name="email" type="email" value={farmer.email ?? ''}
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Website</label>
                    <input name="website" type="url" value={farmer.website ?? ''}
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">📸 Instagram</label>
                    <input name="instagram" value={farmer.instagram ?? ''}
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>
        </div>

        <button type="submit" disabled={isSubmitting || selectedProduce.length === 0}
            class="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 shadow-lg transition-all disabled:opacity-50 text-lg">
            {isSubmitting ? 'Saving...' : 'Save & Resubmit for Review 🌾'}
        </button>

    </form>
</div>