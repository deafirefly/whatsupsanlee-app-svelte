
<script lang="ts">
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';

    let { data } = $props();
    const { listing } = data;

    let imageUrl = $state(listing.imageUrl || '');
    let isUploading = $state(false);
    let uploader: any = null;

    onMount(async () => {
        console.log("1. onMount started...");
        try {
            // We use the core 'uploadthing/client' instead of the Svelte wrapper
            const { genUploader } = await import("uploadthing/client");
            console.log("2. Core SDK imported");

            // Create a manual uploader linked to your API route
            uploader = genUploader({
                url: "/api/uploadthing",
            });
            console.log("5. Manual Uploader is READY with Token!");
        } catch (err) {
            console.error("Initialization error:", err);
        }
    });

    async function handleFileChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file || !uploader) return;

        try {
            isUploading = true;
            console.log("3. Starting manual upload for:", file.name);

            // Directly trigger the upload to the 'listingImage' endpoint
            const res = await uploader.uploadFiles("listingImage", {
                files: [file],
            });

            if (res?.[0]) {
                imageUrl = res[0].url;
                console.log("4. SUCCESS!", res[0].url);
                alert("Upload Complete!");
            }
            isUploading = false;
        } catch (err: any) {
            isUploading = false;
            console.error("Upload failed:", err);
            alert(`Upload failed: ${err.message}`);
        }
    }
</script>





<div class="max-w-3xl mx-auto p-6">
    <header class="mb-8">
        <a href="/dashboard" data-sveltekit-reload class="text-sm font-bold text-indigo-600 hover:underline">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900 mt-4">Edit Your Listing</h1>
    </header>

    <form 
        method="POST" 
        action="?/updateListing" 
        use:enhance={() => {
            return async ({ result, update }) => {
                if (result.type === 'success') {
                    // This prevents the "blank field" issue after saving
                    await update({ reset: false }); 
                    alert("Changes saved successfully!");
                }
            };
        }}
        class="space-y-6 bg-white p-8 rounded-3xl border shadow-sm">
        <input type="hidden" name="id" value={listing.id} />


        <div class="space-y-4">
    <label class="text-xs font-black uppercase text-slate-400 ml-1">Business Cover Photo</label>
    
    {#if imageUrl}
        <div class="relative group w-full h-56 rounded-3xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
            <img src={imageUrl} alt="Business Preview" class="w-full h-full object-cover" />
            <button 
    type="submit" 
    formaction="?/deleteImage"
    class="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-xl hover:bg-red-600 transition-all z-10"
    use:enhance={({ cancel }) => {
        //  Confirmation check
        if (!confirm("Are you sure you want to delete this image?")) return cancel();
    
        return async ({ result, update }) => {
            if (result.type === 'success') {
                imageUrl = ''; // Clear the preview
                
                // CRITICAL: This line tells SvelteKit NOT to reset the form inputs
                // It keeps your Business Name, Bio, and Schedule safe!
                await update({ reset: false }); 
                
                alert('Image removed! Don\'t forget to click "Save Changes" to lock it in.');
            }
        };
    }}
>
    ✕
</button>

        </div>
    {:else}
        <div class="p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center justify-center gap-4">
            {#if isUploading}
                <div class="flex flex-col items-center gap-2">
                    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p class="text-xs font-black text-indigo-600 uppercase animate-pulse">Uploading...</p>
                </div>
            {:else}
                <div class="text-center">
                    <span class="text-3xl block mb-2">📸</span>
                    <label class="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md inline-block">
                        Choose Photo
                        <input type="file" accept="image/*" class="hidden" onchange={handleFileChange} />
                    </label>
                    <p class="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">Max 4MB</p>
                </div>
            {/if}
        </div>
    {/if}

    <input type="hidden" name="imageUrl" value={imageUrl} />
</div>









        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
                <label class="text-xs font-black uppercase text-slate-400 ml-1">Business Name</label>
                <input name="businessName" value={listing.businessName} required class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none transition-all" />
            </div>

            <div class="space-y-2">
                <label class="text-xs font-black uppercase text-slate-400 ml-1">Category</label>
                <select name="category" value={listing.category} class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none bg-white">
                    <option value="food_truck">Food Truck</option>
                    <option value="farmer">Farmer</option>
                    <option value="photographer">Photographer</option>
                    <option value="artist">Artist</option>
                </select>
            </div>
        </div>

        <div class="space-y-2">
            <label class="text-xs font-black uppercase text-slate-400 ml-1">Bio / Description</label>
            <textarea name="bio" rows="4" class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none transition-all">{listing.bio}</textarea>
        </div>

        <div class="space-y-2">
            <label class="text-xs font-black uppercase text-slate-400 ml-1">Schedule (e.g. Mon-Fri | 9am-5pm)</label>
            <input name="scheduleSummary" value={listing.scheduleSummary} class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none" />
        </div>
        
        <button type="submit" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-lg transition-all active:scale-95">
            Save Changes
        </button>
    </form>
</div>