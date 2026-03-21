<script lang="ts">
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    const { allAreas, allCommunities } = data;

    let imageUrl = $state('');
    let isUploading = $state(false);
    let isSubmitting = $state(false);
    let selectedAreaId = $state('');
    let postType = $state<'text' | 'photo' | 'link'>('text');
    let uploader: any = null;

    let filteredCommunities = $derived(
        selectedAreaId
            ? allCommunities.filter((c: any) => c.areaId === Number(selectedAreaId))
            : []
    );

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

<div class="max-w-2xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-8">
        <a href="/feed" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            ← Back to Feed
        </a>
        <h1 class="text-3xl font-black text-slate-900 mt-4">Create Post</h1>
        <p class="text-slate-500 mt-1">Share something with the Lee County community!</p>
    </div>

    <!-- Error -->
    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
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
        class="space-y-6"
    >

        <!-- Post Type -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Post Type</h3>
            <div class="grid grid-cols-3 gap-3">
                {#each [
                    { value: 'text', label: 'Text', emoji: '📝' },
                    { value: 'photo', label: 'Photo', emoji: '📸' },
                    { value: 'link', label: 'Link', emoji: '🔗' }
                ] as type}
                    <button
                        type="button"
                        onclick={() => postType = type.value as typeof postType}
                        class="p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all
                        {postType === type.value
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-slate-100 hover:border-slate-200'}"
                    >
                        <span class="text-2xl">{type.emoji}</span>
                        <span class="text-xs font-black text-slate-700">{type.label}</span>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Content</h3>

            <!-- Text -->
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">
                    {postType === 'photo' ? 'Caption (optional)' : 'What\'s on your mind?'}
                </label>
                <textarea
                    name="content"
                    rows={4}
                    placeholder="Share something with the Lee County community..."
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm resize-none"
                ></textarea>
            </div>

            <!-- Photo Upload -->
            {#if postType === 'photo'}
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">Photo *</label>
                    {#if imageUrl}
                        <div class="relative rounded-2xl overflow-hidden bg-slate-100 mb-2">
                            <img src={imageUrl} alt="Preview" class="w-full object-cover max-h-64" />
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
                                <span class="text-3xl">📸</span>
                                <label class="cursor-pointer bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                                    Choose Photo
                                    <input type="file" accept="image/*" class="hidden" onchange={handleImageChange} />
                                </label>
                            {/if}
                        </div>
                    {/if}
                    <input type="hidden" name="imageUrl" value={imageUrl} />
                </div>
            {/if}

            <!-- Link -->
            {#if postType === 'link'}
                <div class="space-y-3">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Link URL *</label>
                        <input
                            name="linkUrl"
                            type="url"
                            placeholder="https://example.com"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Link Title <span class="text-slate-400 font-normal">(optional)</span></label>
                        <input
                            name="linkTitle"
                            placeholder="Describe the link..."
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                        />
                    </div>
                </div>
            {/if}
        </div>

        <!-- Area & Community -->
        {#if allAreas.length > 0}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
                <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Post to Area <span class="text-slate-400 font-normal normal-case text-[11px]">(optional)</span></h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Area</label>
                        <select
                            name="areaId"
                            bind:value={selectedAreaId}
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none bg-white text-sm"
                        >
                            <option value="">All of Lee County</option>
                            {#each allAreas as area}
                                <option value={area.id}>{area.name}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Community</label>
                        <select
                            name="communityId"
                            disabled={filteredCommunities.length === 0}
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none bg-white text-sm disabled:opacity-50"
                        >
                            <option value="">{selectedAreaId ? 'All communities' : 'Select area first'}</option>
                            {#each filteredCommunities as community}
                                <option value={community.id}>{community.name}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Submit -->
        <button
            type="submit"
            disabled={isSubmitting || isUploading}
            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 text-lg"
        >
            {isSubmitting ? 'Posting...' : 'Post to Community →'}
        </button>

    </form>
</div>