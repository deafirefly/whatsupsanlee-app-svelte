<!-- src/routes/(member)/creators/create/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';

    let { form } = $props();

    let isSubmitting = $state(false);
    let imageUrl = $state('');
    let isUploading = $state(false);
    let uploader: any = null;
    let selectedCategories = $state<string[]>([]);

    const allCategories = [
        'Gaming', 'Food', 'Music', 'Art', 'Local News', 'Podcast',
        'Comedy', 'Education', 'Sports', 'Lifestyle', 'Tech', 'Faith', 'Family', 'Other'
    ];

    function toggleCategory(cat: string) {
        selectedCategories = selectedCategories.includes(cat)
            ? selectedCategories.filter(c => c !== cat)
            : [...selectedCategories, cat];
    }

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
        <a href="/dashboard" class="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 mb-4">
            ← Back to Dashboard
        </a>
        <h1 class="text-3xl font-black text-slate-900">Submit Your Creator Profile 📱</h1>
        <p class="text-slate-500 mt-1">Get discovered by the Lee County community!</p>
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
        <input type="hidden" name="contentCategories" value={JSON.stringify(selectedCategories)} />

        <!-- Profile Photo -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-violet-600 uppercase tracking-widest">Profile Photo</h3>
            {#if imageUrl}
                <div class="flex items-center gap-4">
                    <img src={imageUrl} alt="Preview" class="w-24 h-24 rounded-full object-cover border-4 border-violet-100" />
                    <button type="button" onclick={() => imageUrl = ''}
                        class="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
                        🗑 Remove
                    </button>
                </div>
            {:else}
                <div class="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center gap-3">
                    {#if isUploading}
                        <div class="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                        <p class="text-xs font-black text-violet-600 uppercase animate-pulse">Uploading...</p>
                    {:else}
                        <span class="text-3xl">📸</span>
                        <label class="cursor-pointer bg-violet-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-violet-700 transition-all">
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
            <h3 class="text-xs font-black text-violet-600 uppercase tracking-widest">About You</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Creator Name / Channel Name *</label>
                <input name="name" required placeholder="e.g. SanLee Eats, Rodney Creates..."
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Tagline <span class="text-slate-400 font-normal">(optional)</span></label>
                <input name="tagline" placeholder="e.g. Exploring the best eats in Lee County"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Bio <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea name="bio" rows={4}
                    placeholder="Tell the community about yourself and your content..."
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none"></textarea>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Area <span class="text-slate-400 font-normal">(optional)</span></label>
                <input name="area" placeholder="e.g. Sanford, Broadway, Lee County"
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
        </div>

        <!-- Content Categories -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-violet-600 uppercase tracking-widest">Content Categories *</h3>
            <p class="text-xs text-slate-400">Select all that apply — helps people find you!</p>
            <div class="flex flex-wrap gap-2">
                {#each allCategories as cat}
                    <button type="button" onclick={() => toggleCategory(cat)}
                        class="px-3 py-1.5 text-xs font-bold rounded-full border-2 transition-all
                        {selectedCategories.includes(cat)
                            ? 'border-violet-600 bg-violet-600 text-white'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-violet-300'}">
                        {selectedCategories.includes(cat) ? '✓ ' : '+ '}{cat}
                    </button>
                {/each}
            </div>
            {#if selectedCategories.length > 0}
                <p class="text-xs text-violet-600 font-bold">✓ {selectedCategories.length} selected</p>
            {/if}
        </div>

        <!-- Platform Links -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-violet-600 uppercase tracking-widest">Your Platforms *</h3>
            <p class="text-xs text-slate-400">Add at least one platform where people can find you.</p>

            <div class="space-y-3">
                <!-- YouTube -->
                <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">▶️</span>
                    <div class="flex-1">
                        <input name="youtube" placeholder="YouTube channel URL or @handle"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                    <input name="youtubeSubs" placeholder="Subs (e.g. 1.2K)" class="w-28 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>

                <!-- TikTok -->
                <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">🎵</span>
                    <div class="flex-1">
                        <input name="tiktok" placeholder="TikTok @handle"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                    <input name="tiktokFollowers" placeholder="Followers" class="w-28 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>

                <!-- Instagram -->
                <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">📸</span>
                    <div class="flex-1">
                        <input name="instagram" placeholder="Instagram @handle"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                    <input name="instagramFollowers" placeholder="Followers" class="w-28 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>

                <!-- Twitch -->
                <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">🎮</span>
                    <div class="flex-1">
                        <input name="twitch" placeholder="Twitch username"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                    <input name="twitchFollowers" placeholder="Followers" class="w-28 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>

                <!-- Podcast -->
                <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">🎙️</span>
                    <div class="flex-1">
                        <input name="podcast" placeholder="Podcast URL (Spotify, Apple, RSS...)"
                            class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                    <input name="podcastListeners" placeholder="Listeners" class="w-28 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>

                <!-- Facebook -->
                <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">👤</span>
                    <input name="facebook" placeholder="Facebook page URL"
                        class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>

                <!-- X/Twitter -->
                <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">🐦</span>
                    <input name="twitter" placeholder="X / Twitter @handle"
                        class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>

                <!-- Bluesky -->
                <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">🦋</span>
                    <input name="bluesky" placeholder="Bluesky @handle"
                        class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>

                <!-- Website -->
                <div class="flex items-center gap-3">
                    <span class="text-2xl w-8 text-center">🌐</span>
                    <input name="website" type="url" placeholder="Personal website URL"
                        class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                </div>
            </div>
        </div>

        <button type="submit" disabled={isSubmitting}
            class="w-full py-4 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 shadow-lg transition-all disabled:opacity-50 text-lg">
            {isSubmitting ? 'Submitting...' : 'Submit for Review 📱'}
        </button>

    </form>
</div>