<!-- src/routes/(member)/yard-sales/create/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { form } = $props();

    let isSubmitting = $state(false);
    let newItem = $state('');
    let items = $state<string[]>([]);

    const suggestedItems = [
        'Furniture', 'Clothes', 'Tools', 'Toys', 'Books',
        'Electronics', 'Kitchen Items', 'Decor', 'Sports Equipment',
        'Baby Items', 'Jewelry', 'Artwork', 'Outdoor Equipment', 'Bikes'
    ];

    function addItem() {
        const trimmed = newItem.trim();
        if (trimmed && !items.includes(trimmed)) {
            items = [...items, trimmed];
        }
        newItem = '';
    }

    function addSuggested(item: string) {
        if (!items.includes(item)) {
            items = [...items, item];
        }
    }

    function removeItem(item: string) {
        items = items.filter(i => i !== item);
    }

    function handleItemKeydown(e: KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
        }
    }
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-8">
        <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-4">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900">Post a Yard Sale 🏷️</h1>
        <p class="text-slate-500 mt-1">Let your neighbors know what treasures you're selling!</p>
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
        <!-- Hidden items field -->
        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Sale Info</h3>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Sale Title *</label>
                <input
                    name="title"
                    required
                    placeholder="e.g. Moving Sale — Everything Must Go!"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Description <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea
                    name="description"
                    placeholder="Any extra details about your sale, parking info, special items..."
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                ></textarea>
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                    name="contactName"
                    required
                    placeholder="First name or family name (e.g. The Johnson Family)"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
        </div>

        <!-- Date & Time -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Date & Time</h3>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Sale Date *</label>
                <input
                    name="saleDate"
                    type="date"
                    required
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Start Time *</label>
                    <input
                        name="startTime"
                        type="time"
                        required
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <p class="text-[11px] text-slate-400 mt-1">Most yard sales start 7–8 AM</p>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">End Time *</label>
                    <input
                        name="endTime"
                        type="time"
                        required
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Location</h3>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Street Address *</label>
                <input
                    name="address"
                    required
                    placeholder="e.g. 123 Oak Street, Sanford, NC"
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

        <!-- Items for Sale -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">What Are You Selling? *</h3>
            <p class="text-xs text-slate-400">Add categories of items — helps neighbors know if it's worth the trip!</p>

            <!-- Suggestions -->
            <div>
                <p class="text-xs font-bold text-slate-500 mb-2">Quick add:</p>
                <div class="flex flex-wrap gap-2">
                    {#each suggestedItems as suggestion}
                        <button
                            type="button"
                            onclick={() => addSuggested(suggestion)}
                            disabled={items.includes(suggestion)}
                            class="px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all
                            {items.includes(suggestion)
                                ? 'border-indigo-600 bg-indigo-600 text-white cursor-default'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}"
                        >
                            {items.includes(suggestion) ? '✓ ' : '+ '}{suggestion}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Custom item input -->
            <div class="flex gap-2">
                <input
                    type="text"
                    bind:value={newItem}
                    onkeydown={handleItemKeydown}
                    placeholder="Or type a custom item..."
                    class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                    type="button"
                    onclick={addItem}
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all"
                >
                    Add
                </button>
            </div>

            <!-- Selected items -->
            {#if items.length > 0}
                <div>
                    <p class="text-xs font-bold text-slate-500 mb-2">Your items ({items.length}):</p>
                    <div class="flex flex-wrap gap-2">
                        {#each items as item}
                            <span class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold">
                                {item}
                                <button
                                    type="button"
                                    onclick={() => removeItem(item)}
                                    class="text-indigo-400 hover:text-indigo-700 font-black leading-none"
                                >
                                    ✕
                                </button>
                            </span>
                        {/each}
                    </div>
                </div>
            {:else}
                <p class="text-xs text-amber-600 font-bold">⚠ Add at least one item category to continue.</p>
            {/if}
        </div>

        <!-- Contact Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Contact <span class="text-slate-400 font-normal normal-case text-[11px]">(optional — for questions)</span></h3>
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
                        placeholder="you@example.com"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>
        </div>

        <!-- Submit -->
        <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            class="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
            {isSubmitting ? 'Submitting...' : 'Submit for Approval 🏷️'}
        </button>

    </form>
</div>