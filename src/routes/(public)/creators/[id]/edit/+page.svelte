<!-- src/routes/(member)/creators/[id]/edit/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';

    let { data, form } = $props();
    const { creator } = data;

    let isSubmitting = $state(false);
    let imageUrl = $state(creator.imageUrl ?? '');
    let isUploading = $state(false);
    let uploader: any = null;
    let selectedCategories = $state<string[]>(creator.contentCategories ?? []);

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
        } catch { isUploading = false; }
    }
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <div class="mb-8">
        <a href="/creators/{creator.id}" class="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 mb-4">
            ← Back to Profile
        </a>
        <h1 class="text-3xl font-black text-slate-900">Edit Creator Profile 📱</h1>
        <p class="text-slate-500 mt-1">Make your changes and resubmit for review.</p>
    </div>

    {#if creator.status === 'rejected'}
        <div class="mb-6 flex items-center gap-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl p-4">
            <span class="text-lg">❌</span>
            <p class="font-bold">This profile was rejected. Edit and resubmit below.</p>
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
        <input type="hidden" name="contentCategories" value={JSON.stringify(selectedCategories)} />

        <!-- Profile Photo -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-violet-600 uppercase tracking-widest">Profile Photo</h3>
            {#if imageUrl}
                <div class="flex items-center gap-4">
                    <img src={imageUrl} alt="Preview" class="w-24 h-24 rounded-full object-cover border-4 border-violet-100" />
                    <button type="button" onclick={() => imageUrl = ''}
                        class="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black hover:bg-red-100">🗑 Remove</button>
                </div>
            {:else}
                <div class="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex flex-col items-center gap-3">
                    {#if isUploading}
                        <div class="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                    {:else}
                        <span class="text-3xl">📸</span>
                        <label class="cursor-pointer bg-violet-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-700">
                            Upload Photo
                            <input type="file" accept="image/*" class="hidden" onchange={handleImageChange} />
                        </label>
                    {/if}
                </div>
            {/if}
        </div>

        <!-- About You -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-violet-600 uppercase tracking-widest">About You</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Creator Name *</label>
                <input name="name" required value={creator.name}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Tagline</label>
                <input name="tagline" value={creator.tagline ?? ''}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Bio</label>
                <textarea name="bio" rows={4}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none">{creator.bio ?? ''}</textarea>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Area</label>
                <input name="area" value={creator.area ?? ''}
                    class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
        </div>

        <!-- Content Categories -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-violet-600 uppercase tracking-widest">Content Categories *</h3>
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
        </div>

        <!-- Platform Links -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-violet-600 uppercase tracking-widest">Your Platforms *</h3>
            <div class="space-y-3">
                {#each [
                    { key: 'youtube', emoji: '▶️', label: 'YouTube', placeholder: 'Channel URL or @handle', statsKey: 'youtubeSubs', statsPlaceholder: 'Subs (e.g. 1.2K)' },
                    { key: 'tiktok', emoji: '🎵', label: 'TikTok', placeholder: '@handle', statsKey: 'tiktokFollowers', statsPlaceholder: 'Followers' },
                    { key: 'instagram', emoji: '📸', label: 'Instagram', placeholder: '@handle', statsKey: 'instagramFollowers', statsPlaceholder: 'Followers' },
                    { key: 'twitch', emoji: '🎮', label: 'Twitch', placeholder: 'Username', statsKey: 'twitchFollowers', statsPlaceholder: 'Followers' },
                    { key: 'podcast', emoji: '🎙️', label: 'Podcast', placeholder: 'URL (Spotify, Apple...)', statsKey: 'podcastListeners', statsPlaceholder: 'Listeners' },
                ] as p}
                    <div class="flex items-center gap-3">
                        <span class="text-2xl w-8 text-center">{p.emoji}</span>
                        <input name={p.key} value={(creator as any)[p.key] ?? ''} placeholder={p.placeholder}
                            class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                        <input name={p.statsKey} value={(creator as any)[p.statsKey] ?? ''} placeholder={p.statsPlaceholder}
                            class="w-28 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                {/each}
                {#each [
                    { key: 'facebook', emoji: '👤', placeholder: 'Facebook page URL' },
                    { key: 'twitter', emoji: '🐦', placeholder: 'X / Twitter @handle' },
                    { key: 'bluesky', emoji: '🦋', placeholder: 'Bluesky @handle' },
                    { key: 'website', emoji: '🌐', placeholder: 'Personal website URL' },
                ] as p}
                    <div class="flex items-center gap-3">
                        <span class="text-2xl w-8 text-center">{p.emoji}</span>
                        <input name={p.key} value={(creator as any)[p.key] ?? ''} placeholder={p.placeholder}
                            class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                    </div>
                {/each}
            </div>
        </div>

        <button type="submit" disabled={isSubmitting || selectedCategories.length === 0}
            class="w-full py-4 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 shadow-lg transition-all disabled:opacity-50 text-lg">
            {isSubmitting ? 'Saving...' : 'Save & Resubmit for Review 📱'}
        </button>

    </form>
</div>