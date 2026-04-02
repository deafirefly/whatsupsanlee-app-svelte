<!-- src/routes/(member)/farmers/create/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { form } = $props();

    let isSubmitting = $state(false);

    // Produce categories
    const produceOptions = [
        'Vegetables', 'Fruits', 'Eggs', 'Honey', 'Herbs', 'Flowers',
        'Meat', 'Dairy', 'Baked Goods', 'Preserves', 'Plants/Seedlings', 'Microgreens'
    ];
    let selectedProduce = $state<string[]>([]);

    // Seasonal availability
    const seasonOptions = ['Spring', 'Summer', 'Fall', 'Winter', 'Year-round'];
    let selectedSeasons = $state<string[]>([]);

    // Markets attended
    const marketOptions = [
        'Sanford Farmers Market', 'Broadway Farmers Market',
        'Tramway Market', 'Lee County Fairgrounds Market'
    ];
    let selectedMarkets = $state<string[]>([]);
    let customMarket = $state('');

    // Special features
    let isUpick = $state(false);
    let acceptsSnapEbt = $state(false);
    let offersDelivery = $state(false);
    let isOrganic = $state(false);
    let acceptsPreorders = $state(false);

    function toggleItem(arr: string[], item: string): string[] {
        return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
    }

    function addCustomMarket() {
        const trimmed = customMarket.trim();
        if (trimmed && !selectedMarkets.includes(trimmed)) {
            selectedMarkets = [...selectedMarkets, trimmed];
        }
        customMarket = '';
    }
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-8">
        <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-4">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900">List Your Farm 🌾</h1>
        <p class="text-slate-500 mt-1">Share your farm and produce with the Lee County community.</p>
    </div>

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
        <!-- Hidden fields for arrays and toggles -->
        <input type="hidden" name="produceCategories" value={JSON.stringify(selectedProduce)} />
        <input type="hidden" name="seasonalAvailability" value={JSON.stringify(selectedSeasons)} />
        <input type="hidden" name="marketsAttended" value={JSON.stringify(selectedMarkets)} />
        <input type="hidden" name="isUpick" value={String(isUpick)} />
        <input type="hidden" name="acceptsSnapEbt" value={String(acceptsSnapEbt)} />
        <input type="hidden" name="offersDelivery" value={String(offersDelivery)} />
        <input type="hidden" name="isOrganic" value={String(isOrganic)} />
        <input type="hidden" name="acceptsPreorders" value={String(acceptsPreorders)} />

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Farm Info</h3>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Farm / Business Name *</label>
                <input name="farmName" required placeholder="e.g. Sunrise Family Farm"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Your Name *</label>
                <input name="contactName" required placeholder="e.g. John Smith"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">About Your Farm <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea name="bio" placeholder="Tell the community about your farm, your story, your farming practices..."
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>
        </div>

        <!-- What You Sell -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">What You Sell *</h3>
            <div class="flex flex-wrap gap-2">
                {#each produceOptions as option}
                    <button type="button"
                        onclick={() => selectedProduce = toggleItem(selectedProduce, option)}
                        class="px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all
                        {selectedProduce.includes(option)
                            ? 'border-green-600 bg-green-600 text-white'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-green-400 hover:text-green-600'}">
                        {selectedProduce.includes(option) ? '✓ ' : '+ '}{option}
                    </button>
                {/each}
            </div>
            {#if selectedProduce.length === 0}
                <p class="text-xs text-amber-600 font-bold">⚠ Select at least one category.</p>
            {/if}
        </div>

        <!-- Seasonal Availability -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">When Are You Available?</h3>
            <div class="flex flex-wrap gap-2">
                {#each seasonOptions as season}
                    <button type="button"
                        onclick={() => selectedSeasons = toggleItem(selectedSeasons, season)}
                        class="px-4 py-2 text-xs font-bold rounded-full border-2 transition-all
                        {selectedSeasons.includes(season)
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300'}">
                        {selectedSeasons.includes(season) ? '✓ ' : ''}{season}
                    </button>
                {/each}
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Current Availability Note <span class="text-slate-400 font-normal">(optional)</span></label>
                <input name="currentAvailabilityNote"
                    placeholder="e.g. Tomatoes and sweet corn available now through September!"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
        </div>

        <!-- Where to Find You -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Where to Find You</h3>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Farm Address / Farm Stand Location <span class="text-slate-400 font-normal">(optional)</span></label>
                <input name="farmAddress" placeholder="e.g. 1234 Farm Road, Sanford, NC"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Google Maps Pin <span class="text-slate-400 font-normal">(optional)</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-3.5 text-slate-400">📍</span>
                    <input name="locationPin" placeholder="Paste Google Maps link here"
                        class="w-full p-3 pl-9 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Farmers Markets You Attend <span class="text-slate-400 font-normal">(optional)</span></label>
                <div class="flex flex-wrap gap-2 mb-3">
                    {#each marketOptions as market}
                        <button type="button"
                            onclick={() => selectedMarkets = toggleItem(selectedMarkets, market)}
                            class="px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all
                            {selectedMarkets.includes(market)
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300'}">
                            {selectedMarkets.includes(market) ? '✓ ' : '+ '}{market}
                        </button>
                    {/each}
                </div>
                <!-- Custom market -->
                <div class="flex gap-2">
                    <input type="text" bind:value={customMarket}
                        onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomMarket(); }}}
                        placeholder="Add another market..."
                        class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    <button type="button" onclick={addCustomMarket}
                        class="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                        Add
                    </button>
                </div>
                {#if selectedMarkets.length > 0}
                    <div class="mt-2 flex flex-wrap gap-1.5">
                        {#each selectedMarkets as market}
                            <span class="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold">
                                {market}
                                <button type="button" onclick={() => selectedMarkets = selectedMarkets.filter(m => m !== market)}
                                    class="text-indigo-400 hover:text-indigo-700 font-black">✕</button>
                            </span>
                        {/each}
                    </div>
                {/if}
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Market Schedule <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea name="marketSchedule"
                    placeholder="e.g. Sanford Farmers Market every Saturday 8am–12pm, Broadway Market first Sunday of month"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm min-h-[80px] focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Farm Stand Hours <span class="text-slate-400 font-normal">(optional)</span></label>
                <input name="businessHours" placeholder="e.g. Mon–Sat 8am–6pm, closed Sunday"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
        </div>

        <!-- Special Features -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-3">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Special Features</h3>

            {#each [
                { key: 'isUpick', label: '🍓 U-Pick Available', desc: 'Customers can come pick their own produce', bind: isUpick },
                { key: 'acceptsSnapEbt', label: '💳 Accepts SNAP / EBT', desc: 'We accept SNAP/EBT benefits', bind: acceptsSnapEbt },
                { key: 'offersDelivery', label: '🚗 Delivery Available', desc: 'We deliver to local areas', bind: offersDelivery },
                { key: 'isOrganic', label: '🌿 Organic / Naturally Grown', desc: 'We grow without synthetic pesticides', bind: isOrganic },
                { key: 'acceptsPreorders', label: '📦 Pre-orders Welcome', desc: 'Customers can pre-order produce', bind: acceptsPreorders },
            ] as feature}
                <label class="flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                    {feature.bind ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-white hover:border-slate-200'}">
                    <input type="checkbox" bind:checked={feature.bind} class="mt-0.5 accent-indigo-600 w-4 h-4 flex-shrink-0" />
                    <div>
                        <p class="font-black text-slate-900 text-sm">{feature.label}</p>
                        <p class="text-xs text-slate-400 mt-0.5">{feature.desc}</p>
                    </div>
                </label>
            {/each}
        </div>

        <!-- Contact & Social -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Contact & Social <span class="text-slate-400 font-normal normal-case text-[11px]">(all optional)</span></h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                    <input name="phone" type="tel" placeholder="(910) 555-0123"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input name="email" type="email" placeholder="farm@example.com"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Website</label>
                    <input name="website" type="url" placeholder="https://yourfarm.com"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">📸 Instagram</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 font-bold text-sm">@</span>
                        <input name="instagram" placeholder="yourfarm"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">👤 Facebook</label>
                    <input name="facebook" placeholder="facebook.com/yourfarm"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>
        </div>

        <!-- Submit -->
        <button type="submit" disabled={isSubmitting || selectedProduce.length === 0}
            class="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg">
            {isSubmitting ? 'Submitting...' : 'Submit for Approval 🌾'}
        </button>

    </form>
</div>