<script lang="ts">
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    const { listing, isVip, photos, savedSuccess } = data;

    let currentSlug = $state(listing.slug ?? '');

    console.log('listing.slug from server:', listing.slug);
console.log('currentSlug state:', currentSlug);

    let imageUrl = $state(listing.imageUrl || '');
    let isUploading = $state(false);
    let isUploadingGallery = $state(false);
    let isSaving = $state(false);
    let showSuccess = $state(savedSuccess ?? false);
    if (showSuccess) setTimeout(() => showSuccess = false, 3000);

    let uploader: any = null;
    let newPhotoUrl = $state('');
    let QRCode: any = null;

    async function handleGalleryChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file || !uploader) return;
        try {
            isUploadingGallery = true;
            const res = await uploader.uploadFiles('listingImage', { files: [file] });
            if (res?.[0]) newPhotoUrl = res[0].url;
            isUploadingGallery = false;
        } catch (err: any) {
            isUploadingGallery = false;
            console.error('Gallery upload failed:', err);
        }
    }

    onMount(async () => {
        try {
            const { genUploader } = await import("uploadthing/client");
            uploader = genUploader({ url: "/api/uploadthing" });
        } catch (err) {
            console.error("Initialization error:", err);
        }

        if (currentSlug) {
            try {
                const qr = await import('qrcode');
                QRCode = qr.default;
                generateQR();
            } catch (err) {
                console.error('QR code library error:', err);
            }
        }
    });

    async function generateQR() {
        if (!QRCode || !currentSlug) return;
        const url = `${window.location.origin}/${currentSlug}`;
        const container = document.getElementById('qr-container');
        if (!container) return;
        container.innerHTML = '';
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, url, { width: 200, margin: 2 });
        container.appendChild(canvas);
    }

    async function downloadQR(format: 'png' | 'svg') {
        if (!QRCode || !currentSlug) return;
        const url = `${window.location.origin}/${currentSlug}`;

        if (format === 'png') {
            const dataUrl = await QRCode.toDataURL(url, { width: 400, margin: 2 });
            const link = document.createElement('a');
            link.download = `${currentSlug}-qrcode.png`;
            link.href = dataUrl;
            link.click();
        } else {
            const svg = await QRCode.toString(url, { type: 'svg', width: 400, margin: 2 });
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const link = document.createElement('a');
            link.download = `${currentSlug}-qrcode.svg`;
            link.href = URL.createObjectURL(blob);
            link.click();
        }
    }

    async function handleFileChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file || !uploader) return;
        try {
            isUploading = true;
            const res = await uploader.uploadFiles("listingImage", { files: [file] });
            if (res?.[0]) imageUrl = res[0].url;
            isUploading = false;
        } catch (err: any) {
            isUploading = false;
            console.error("Upload failed:", err);
        }
    }
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <!-- Header -->
    <header class="mb-8">
        <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900 mt-4">Edit Your Listing</h1>
        <p class="text-slate-500 mt-1">Keep your community profile up to date.</p>
    </header>

    <!-- Success Toast -->
    {#if showSuccess}
        <div class="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div class="flex items-center gap-3">
                <span class="text-xl">✅</span>
                <p class="text-emerald-800 font-bold text-sm">Changes saved successfully!</p>
            </div>
            <button onclick={() => showSuccess = false} class="text-emerald-400 hover:text-emerald-600 font-bold">✕</button>
        </div>
    {/if}

    <!-- Error Message -->
    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
        </div>
    {/if}

    <form
        method="POST"
        action="?/updateListing"

        use:enhance={() => {
    isSaving = true;
    return async ({ update }) => {
        isSaving = false;
        await update();
    };
}}



        class="space-y-6"
    >
        <input type="hidden" name="id" value={listing.id} />

        <!-- Cover Photo -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Cover Photo</h3>
            {#if imageUrl}
                <div class="relative group w-full h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={imageUrl} alt="Business Preview" class="w-full h-full object-cover" />
                    <button
                        type="submit"
                        formaction="?/deleteImage"
                        class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black hover:bg-red-600 transition-all shadow-lg"
                        use:enhance={() => {
    isSaving = true;
    return async ({ result }) => {
        isSaving = false;
        if (result.type === 'success') {
            showSavedToast();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };
}}
                    >
                        🗑 Remove
                    </button>
                </div>
            {:else}
                <div class="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center justify-center gap-4">
                    {#if isUploading}
                        <div class="flex flex-col items-center gap-2">
                            <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p class="text-xs font-black text-indigo-600 uppercase animate-pulse">Uploading...</p>
                        </div>
                    {:else}
                        <span class="text-3xl">📸</span>
                        <label class="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md inline-block">
                            Choose Photo
                            <input type="file" accept="image/*" class="hidden" onchange={handleFileChange} />
                        </label>
                        <p class="text-[10px] text-slate-400 uppercase font-black tracking-widest">Max 4MB</p>
                    {/if}
                </div>
            {/if}
            <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Basic Info</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Business Name *</label>
                    <input name="businessName" value={listing.businessName} required
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none transition-all text-sm" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Contact Person *</label>
                    <input name="contactPerson" value={listing.contactPerson} required
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none transition-all text-sm" />
                </div>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Category</label>
                <select name="category" class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none bg-white text-sm">
                    <option value="food_truck" selected={listing.category === 'food_truck'}>Food Truck</option>
                    <option value="farmer" selected={listing.category === 'farmer'}>Farmer</option>
                    <option value="photographer" selected={listing.category === 'photographer'}>Photographer</option>
                    <option value="artist" selected={listing.category === 'artist'}>Artist</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Bio / Story</label>
                <textarea name="bio" rows={4}
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none transition-all text-sm resize-none"
                >{listing.bio}</textarea>
            </div>
        </div>

        <!-- Contact Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Contact Info</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                    <input name="phone" type="tel" value={listing.phone ?? ''}
                        placeholder="(910) 555-0123"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Email</label>
                    <input name="email" type="email" value={listing.email ?? ''}
                        placeholder="hello@yourbusiness.com"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Website</label>
                <input name="website" type="url" value={listing.website ?? ''}
                    placeholder="https://yourbusiness.com"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
            </div>
        </div>

        <!-- Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Location</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Address / Area</label>
                <input name="address" value={listing.address ?? ''}
                    placeholder="e.g. 123 Main St or Downtown Sanford Area"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Google Maps Pin <span class="text-slate-400 font-normal">(optional)</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-3.5 text-slate-400">📍</span>
                    <input name="locationPin" value={listing.locationPin ?? ''}
                        placeholder="Paste Google Maps link here"
                        class="w-full p-3 pl-9 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
            </div>
        </div>

        <!-- Schedule -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Schedule</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Schedule Summary</label>
                <input name="scheduleSummary" value={listing.scheduleSummary ?? ''}
                    placeholder="e.g. Mon, Wed, Fri | 10:00-15:00"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                <p class="text-[11px] text-slate-400 mt-1">This shows on your public listing card.</p>
            </div>
        </div>


        <!-- Vanity URL -->
<div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
    <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Your Vanity URL</h3>
    <p class="text-xs text-slate-400">Customize your listing URL. Auto-generated from your business name if left blank.</p>
    
    <div class="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <span class="text-xs text-slate-400 font-bold flex-shrink-0">whatsupsanlee.com/</span>
        <input
            name="slug"
            bind:value={currentSlug}
            placeholder="your-business-name"
            class="flex-1 bg-transparent outline-none text-sm font-bold text-indigo-600"
        />
    </div>
    <p class="text-[11px] text-slate-400">Only lowercase letters, numbers and hyphens allowed.</p>

    {#if currentSlug}
        <!-- QR Code Section -->
        <div class="mt-4 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-center space-y-4">
            <p class="text-xs font-black text-indigo-600 uppercase tracking-widest">Your QR Code</p>
            <div id="qr-container" class="flex justify-center"></div>
            <p class="text-xs text-slate-500">
                Scan to visit: <span class="font-black text-indigo-600">whatsupsanlee.com/{currentSlug}</span>
            </p>
            <div class="flex gap-3 justify-center">
                <button
                    type="button"
                    onclick={() => downloadQR('png')}
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                    ⬇ Download PNG
                </button>
                <button
                    type="button"
                    onclick={() => downloadQR('svg')}
                    class="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-xl text-xs font-black hover:bg-indigo-50 transition-all">
                    ⬇ Download SVG
                </button>
            </div>
        </div>
    {:else}
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <p class="text-xs text-slate-400">Save your listing to generate your QR code!</p>
        </div>
    {/if}
</div>

        <!-- Social Media -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Social Media</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">📸 Instagram</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 font-bold text-sm">@</span>
                        <input name="instagram" value={listing.instagram ?? ''}
                            placeholder="yourhandle"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">👤 Facebook</label>
                    <input name="facebook" value={listing.facebook ?? ''}
                        placeholder="facebook.com/yourpage"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">🐦 X / Twitter</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 font-bold text-sm">@</span>
                        <input name="twitter" value={listing.twitter ?? ''}
                            placeholder="yourhandle"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">🎵 TikTok</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 font-bold text-sm">@</span>
                        <input name="tiktok" value={listing.tiktok ?? ''}
                            placeholder="yourhandle"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                    </div>
                </div>
            </div>
        </div>

        <!-- VIP Photo Gallery -->
{#if isVip}
    <div class="bg-white rounded-3xl border border-amber-200 shadow-sm p-8 space-y-4">
        <div class="flex items-center gap-2">
            <h3 class="text-xs font-black text-amber-600 uppercase tracking-widest">⭐ VIP Photo Gallery</h3>
            <span class="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {photos.length}/4 photos
            </span>
        </div>
        <p class="text-xs text-slate-400">Add up to 4 additional photos to your listing gallery.</p>

        <!-- Existing Gallery Photos -->
        {#if photos.length > 0}
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                {#each photos as photo}
                    <div class="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                        <img src={photo.url} alt={photo.altText ?? ''} class="w-full h-full object-cover" />
                        <form method="POST" action="?/deletePhoto" use:enhance={() => {
                            return async ({ update }) => { await update(); };
                        }}
                            class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        >
                            <input type="hidden" name="photoId" value={photo.id} />
                            <input type="hidden" name="url" value={photo.url} />
                            <button type="submit"
                                class="bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black hover:bg-red-600 transition-all">
                                🗑 Remove
                            </button>
                        </form>
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Add New Photo -->
        {#if photos.length < 4}
            {#if newPhotoUrl}
                <div class="space-y-3">
                    <div class="relative rounded-2xl overflow-hidden border border-amber-200 aspect-video bg-slate-100">
                        <img src={newPhotoUrl} alt="Preview" class="w-full h-full object-cover" />
                    </div>
                    <form method="POST" action="?/addPhoto" use:enhance={() => {
                        return async ({ update }) => {
                            await update();
                            newPhotoUrl = '';
                        };
                    }} class="flex gap-3">
                        <input type="hidden" name="listingId" value={listing.id} />
                        <input type="hidden" name="url" value={newPhotoUrl} />
                        <button type="submit"
                            class="flex-1 py-3 bg-amber-500 text-white rounded-xl font-black text-sm hover:bg-amber-600 transition-all">
                            ✓ Add to Gallery
                        </button>
                        <button type="button" onclick={() => newPhotoUrl = ''}
                            class="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-200 transition-all">
                            Cancel
                        </button>
                    </form>
                </div>
            {:else}
                <div class="p-6 border-2 border-dashed border-amber-200 rounded-2xl bg-amber-50 flex flex-col items-center gap-3">
                    {#if isUploadingGallery}
                        <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                        <p class="text-xs font-black text-amber-600 uppercase animate-pulse">Uploading...</p>
                    {:else}
                        <span class="text-3xl">📸</span>
                        <label class="cursor-pointer bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-all">
                            Add Gallery Photo
                            <input type="file" accept="image/*" class="hidden" onchange={handleGalleryChange} />
                        </label>
                        <p class="text-[10px] text-amber-500 uppercase font-black tracking-widest">Max 4MB · {4 - photos.length} slots remaining</p>
                    {/if}
                </div>
            {/if}
        {:else}
            <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                <p class="text-xs font-black text-amber-700">Gallery full! Remove a photo to add another.</p>
            </div>
        {/if}
    </div>
{:else}
    <!-- Non-VIP upgrade prompt -->
    <div class="bg-amber-50 rounded-3xl border border-amber-200 shadow-sm p-6 text-center space-y-3">
        <span class="text-3xl block">⭐</span>
        <h3 class="font-black text-amber-900">VIP Photo Gallery</h3>
        <p class="text-sm text-amber-600">Upgrade to VIP to add up to 4 additional photos to your listing!</p>
        <a href="/subscribe"
            class="inline-block px-6 py-3 bg-amber-500 text-white rounded-xl font-black text-sm hover:bg-amber-600 transition-all">
            Upgrade to VIP →
        </a>
    </div>
{/if}

<!-- Save Button -->
<button
    type="submit"
    disabled={isSaving}

            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
            {isSaving ? 'Saving...' : 'Save Changes →'}
        </button>

    </form>
</div>