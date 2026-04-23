<!-- src/routes/(member)/yard-sales/[id]/edit/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    const { sale } = data;

    let isSubmitting = $state(false);
    let items = $state<string[]>(sale.items ?? []);
    let newItem = $state('');

    const suggestedItems = [
        'Furniture', 'Clothes', 'Tools', 'Toys', 'Books',
        'Electronics', 'Kitchen Items', 'Decor', 'Sports Equipment',
        'Baby Items', 'Jewelry', 'Artwork', 'Outdoor Equipment', 'Bikes'
    ];

    function addItem() {
        const trimmed = newItem.trim();
        if (trimmed && !items.includes(trimmed)) items = [...items, trimmed];
        newItem = '';
    }

    function removeItem(item: string) {
        items = items.filter(i => i !== item);
    }

    function addSuggested(item: string) {
        if (!items.includes(item)) items = [...items, item];
    }
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <div class="mb-8">
        <a href="/yard-sales/{sale.id}" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-4">
            ← Back to Listing
        </a>
        <h1 class="text-3xl font-black text-slate-900">Edit Yard Sale 🏷️</h1>
        <p class="text-slate-500 mt-1">Make your changes and resubmit for review.</p>
    </div>

    {#if sale.status === 'rejected'}
        <div class="mb-6 flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl p-4">
            <span class="text-lg">❌</span>
            <p class="font-bold">This listing was rejected. Edit and resubmit below.</p>
        </div>
    {/if}

    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-bold">
            ⚠ {form.message}
        </div>
    {/if}

    <form method="POST" use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => { await update(); isSubmitting = false; };
    }} class="space-y-8">

        <input type="hidden" name="items" value={JSON.stringify(items)} />

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Sale Info</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Sale Title *</label>
                <input name="title" required value={sale.title}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Description <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea name="description" rows={3}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none">{sale.description ?? ''}</textarea>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Your Name *</label>
                <input name="contactName" required value={sale.contactName}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
        </div>

        <!-- Date & Time -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Date & Time</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Sale Date *</label>
                <input name="saleDate" type="date" required value={sale.saleDate}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Start Time *</label>
                    <input name="startTime" type="time" required value={sale.startTime}
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">End Time *</label>
                    <input name="endTime" type="time" required value={sale.endTime}
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
                </div>
            </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Location</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Street Address *</label>
                <input name="address" required value={sale.address}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Google Maps Pin <span class="text-slate-400 font-normal">(optional)</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-3.5 text-slate-400">📍</span>
                    <input name="locationPin" value={sale.locationPin ?? ''}
                        placeholder="Paste Google Maps link here"
                        class="w-full p-3 pl-9 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>
        </div>

        <!-- Items -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">What Are You Selling? *</h3>
            <div class="flex flex-wrap gap-2">
                {#each suggestedItems as suggestion}
                    <button type="button" onclick={() => addSuggested(suggestion)}
                        disabled={items.includes(suggestion)}
                        class="px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all
                        {items.includes(suggestion)
                            ? 'border-indigo-600 bg-indigo-600 text-white cursor-default'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-300'}">
                        {items.includes(suggestion) ? '✓ ' : '+ '}{suggestion}
                    </button>
                {/each}
            </div>
            <div class="flex gap-2">
                <input type="text" bind:value={newItem}
                    onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(); }}}
                    placeholder="Or type a custom item..."
                    class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                <button type="button" onclick={addItem}
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                    Add
                </button>
            </div>
            {#if items.length > 0}
                <div class="flex flex-wrap gap-2">
                    {#each items as item}
                        <span class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold">
                            {item}
                            <button type="button" onclick={() => removeItem(item)}
                                class="text-indigo-400 hover:text-indigo-700 font-black">✕</button>
                        </span>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Contact -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Contact <span class="text-slate-400 font-normal normal-case text-[11px]">(optional)</span></h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                    <input name="phone" type="tel" value={sale.phone ?? ''}
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input name="email" type="email" value={sale.email ?? ''}
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>
        </div>

        <button type="submit" disabled={isSubmitting || items.length === 0}
            class="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg transition-all disabled:opacity-50 text-lg">
            {isSubmitting ? 'Saving...' : 'Save & Resubmit for Review 🏷️'}
        </button>

    </form>
</div>