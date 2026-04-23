<!-- src/routes/(member)/open-houses/create/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';

    let { form } = $props();

    let isSubmitting = $state(false);
    let imageUrl = $state('');
    let isUploading = $state(false);
    let uploader: any = null;

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

    <div class="mb-8">
        <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-4">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900">Post an Open House 🏠</h1>
        <p class="text-slate-500 mt-1">Let Lee County buyers know about your open house!</p>
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

        <input type="hidden" name="imageUrl" value={imageUrl} />

        <!-- Photo Upload -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Property Photo</h3>
            {#if imageUrl}
                <div class="relative rounded-2xl overflow-hidden border border-slate-200 h-56 bg-slate-100">
                    <img src={imageUrl} alt="Property preview" class="w-full h-full object-cover" />
                    <button type="button" onclick={() => imageUrl = ''}
                        class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black hover:bg-red-600 transition-all">
                        🗑 Remove
                    </button>
                </div>
            {:else}
                <div class="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center gap-3">
                    {#if isUploading}
                        <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p class="text-xs font-black text-indigo-600 uppercase animate-pulse">Uploading...</p>
                    {:else}
                        <span class="text-3xl">🏠</span>
                        <label class="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                            Upload Photo
                            <input type="file" accept="image/*" class="hidden" onchange={handleImageChange} />
                        </label>
                        <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest">Max 4MB · Optional</p>
                    {/if}
                </div>
            {/if}
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Property Info</h3>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Listing Title *</label>
                <input name="title" required placeholder="e.g. Charming 3BR Ranch on Quiet Cul-de-sac"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Property Type</label>
                <select name="propertyType" class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                    <option value="single_family">Single Family Home</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="land">Land / Lot</option>
                    <option value="commercial">Commercial</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Description <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea name="description" rows={4}
                    placeholder="Describe the property — features, recent updates, neighborhood highlights..."
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>
        </div>

        <!-- Property Details -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Property Details</h3>

            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Asking Price</label>
                    <div class="relative">
                        <span class="absolute left-3 top-3 text-slate-400 font-bold">$</span>
                        <input name="price" type="number" min="0" placeholder="285000"
                            class="w-full p-3 pl-7 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Year Built</label>
                    <input name="yearBuilt" type="number" min="1800" max="2026" placeholder="1998"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Bedrooms</label>
                    <input name="bedrooms" type="number" min="0" placeholder="3"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Bathrooms</label>
                    <input name="bathrooms" type="number" min="0" step="0.5" placeholder="2.5"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Square Feet</label>
                    <input name="sqFt" type="number" min="0" placeholder="1850"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Lot Size</label>
                    <input name="lotSize" placeholder="0.45 acres"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Location</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Property Address *</label>
                <input name="address" required placeholder="123 Main St, Sanford, NC 27330"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Google Maps Link <span class="text-slate-400 font-normal">(optional)</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-3.5 text-slate-400">📍</span>
                    <input name="locationPin" placeholder="Paste Google Maps link here"
                        class="w-full p-3 pl-9 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>
        </div>

        <!-- Open House Date & Time -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Open House Schedule</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Date *</label>
                <input name="openDate" type="date" required
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Start Time *</label>
                    <input name="startTime" type="time" required
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">End Time *</label>
                    <input name="endTime" type="time" required
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" style="color-scheme: light;" />
                </div>
            </div>
        </div>

        <!-- Agent / Contact -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Agent / Contact Info</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Agent Name *</label>
                    <input name="agentName" required placeholder="Jane Smith"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Company / Brokerage</label>
                    <input name="agentCompany" placeholder="Keller Williams, Coldwell Banker..."
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                    <input name="agentPhone" type="tel" placeholder="(910) 555-0123"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input name="agentEmail" type="email" placeholder="agent@realty.com"
                        class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
            </div>
        </div>

        <button type="submit" disabled={isSubmitting}
            class="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg transition-all disabled:opacity-50 text-lg">
            {isSubmitting ? 'Submitting...' : 'Submit for Review 🏠'}
        </button>

    </form>
</div>