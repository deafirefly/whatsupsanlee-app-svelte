<script lang="ts">
    import { onMount } from 'svelte';
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    const { profile, allAreas, allCommunities, user } = data;

    let avatarUrl = $state(profile?.avatarUrl || '');
    let isUploading = $state(false);
    let isSaving = $state(false);
    let showSuccess = $state(false);
    let selectedAreaId = $state(profile?.areaId?.toString() || '');
    let uploader: any = null;

    // Filter communities based on selected area
    let filteredCommunities = $derived(
        selectedAreaId
            ? allCommunities.filter(c => c.areaId === Number(selectedAreaId))
            : []
    );

    // Username fallback
    let username = $derived(profile?.displayName || user?.email?.split('@')[0] || 'Member');

    onMount(async () => {
        try {
            const { genUploader } = await import('uploadthing/client');
            uploader = genUploader({ url: '/api/uploadthing' });
        } catch (err) {
            console.error('Uploadthing init error:', err);
        }
    });

    async function handleAvatarChange(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file || !uploader) return;

        try {
            isUploading = true;
            const res = await uploader.uploadFiles('listingImage', { files: [file] });
            if (res?.[0]) avatarUrl = res[0].url;
            isUploading = false;
        } catch (err: any) {
            isUploading = false;
            console.error('Upload failed:', err);
        }
    }

    function showToast() {
        showSuccess = true;
        setTimeout(() => showSuccess = false, 3000);
    }
</script>

<div class="max-w-3xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-8">
        <a href="/profile" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            ← Back to Profile
        </a>
        <h1 class="text-3xl font-black text-slate-900 mt-4">Edit Profile</h1>
        <p class="text-slate-500 mt-1">Customize how the community sees you.</p>
    </div>

    <!-- Success Toast -->
    {#if showSuccess}
        <div class="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span>✅</span>
                <p class="text-emerald-800 font-bold text-sm">Profile saved successfully!</p>
            </div>
            <button onclick={() => showSuccess = false} class="text-emerald-400 hover:text-emerald-600 font-bold">✕</button>
        </div>
    {/if}

    <!-- Error -->
    {#if form?.message}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
        </div>
    {/if}

    <form
        method="POST"
        action="?/saveProfile"
        use:enhance={() => {
            isSaving = true;
            return async ({ result, update }) => {
                isSaving = false;
                if (result.type === 'redirect') return;
                await update({ reset: false });
                showToast();
            };
        }}
        class="space-y-6"
    >

        <!-- Avatar -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Profile Photo</h3>
            <div class="flex items-center gap-6">
                <!-- Avatar Preview -->
                <div class="flex-shrink-0">
                    {#if avatarUrl}
                        <img src={avatarUrl} alt="Avatar"
                            class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                    {:else}
                        <div class="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                            {username[0].toUpperCase()}
                        </div>
                    {/if}
                </div>

                <!-- Upload Controls -->
                <div class="flex-1 space-y-3">
                    {#if isUploading}
                        <div class="flex items-center gap-2">
                            <div class="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <p class="text-xs font-black text-indigo-600 uppercase animate-pulse">Uploading...</p>
                        </div>
                    {:else}
                        <label class="cursor-pointer inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md">
                            {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                            <input type="file" accept="image/*" class="hidden" onchange={handleAvatarChange} />
                        </label>
                    {/if}

                    {#if avatarUrl}
                        <button
                            type="submit"
                            formaction="?/deleteAvatar"
                            class="block text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                            use:enhance={({ cancel }) => {
                                if (!confirm('Remove profile photo?')) return cancel();
                                return async ({ result, update }) => {
                                    if (result.type === 'success') {
                                        avatarUrl = '';
                                        await update({ reset: false });
                                    }
                                };
                            }}
                        >
                            🗑 Remove photo
                        </button>
                    {/if}
                    <p class="text-[11px] text-slate-400">Max 4MB. JPG, PNG or WEBP.</p>
                </div>
            </div>
            <input type="hidden" name="avatarUrl" value={avatarUrl} />
        </div>

        <!-- Basic Info -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Basic Info</h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Display Name</label>
                <input
                    name="displayName"
                    value={profile?.displayName ?? ''}
                    placeholder="How should we call you?"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                />
                <p class="text-[11px] text-slate-400 mt-1">Leave blank to use your email username.</p>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Bio</label>
                <textarea
                    name="bio"
                    rows={3}
                    placeholder="Tell the San Lee community a little about yourself..."
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm resize-none"
                >{profile?.bio ?? ''}</textarea>
            </div>
        </div>

        <!-- Community Location -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Your Community</h3>
            <p class="text-xs text-slate-400 mb-4">Select your area and neighborhood in Lee County.</p>
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <span class="text-lg flex-shrink-0">💡</span>
                <div>
                    <p class="text-xs font-bold text-amber-700">Don't see your area or community?</p>
                    <p class="text-xs text-amber-600 mt-0.5 leading-relaxed">
                        Send us a message and we'll add it for you!
                        <a href="/contact" class="font-black underline hover:text-amber-800 transition-colors">Contact us →</a>
                        or join our 
                        <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer" class="font-black underline hover:text-amber-800 transition-colors">Discord →</a>
                    </p>
                </div>
            </div>

            {#if allAreas.length === 0}
                <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <p class="text-sm text-amber-700 font-bold">⚠ No areas added yet. Ask your admin to add Lee County areas and communities.</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Area</label>
                        <select
                            name="areaId"
                            bind:value={selectedAreaId}
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none bg-white text-sm"
                        >
                            <option value="">Select an area...</option>
                            {#each allAreas as area}
                                <option value={area.id.toString()} selected={profile?.areaId === area.id}>
                                    {area.name}
                                </option>
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Community / Neighborhood</label>
                        <select
                            name="communityId"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none bg-white text-sm"
                            disabled={filteredCommunities.length === 0}
                        >
                            <option value="">
                                {selectedAreaId ? 'Select a community...' : 'Select an area first'}
                            </option>
                            {#each filteredCommunities as community}
                                <option value={community.id} selected={profile?.communityId === community.id}>
                                    {community.name}
                                </option>
                            {/each}
                        </select>
                        {#if selectedAreaId && filteredCommunities.length === 0}
                            <p class="text-[11px] text-amber-500 mt-1">
                                No communities added for this area yet. 
                                <a href="/contact" class="font-black underline hover:text-amber-700">Request one →</a>
                            </p>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>

        <!-- Privacy -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Privacy</h3>
            <p class="text-xs text-slate-400">Control who can see your profile.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                {#each [
                    { value: 'public', label: 'Public', desc: 'Anyone can view', emoji: '🌐' },
                    { value: 'members', label: 'Members Only', desc: 'Logged in members only', emoji: '👥' },
                    { value: 'private', label: 'Private', desc: 'Only you can see', emoji: '🔒' }
                ] as option}
                    <label class="cursor-pointer">
                        <input type="radio" name="visibility" value={option.value}
                            checked={profile?.visibility === option.value || (!profile && option.value === 'public')}
                            class="sr-only peer" />
                        <div class="p-4 rounded-2xl border-2 border-slate-100 peer-checked:border-indigo-600 peer-checked:bg-indigo-50 transition-all text-center hover:border-slate-200">
                            <span class="text-2xl block mb-1">{option.emoji}</span>
                            <p class="font-black text-sm text-slate-900">{option.label}</p>
                            <p class="text-[11px] text-slate-400 mt-0.5">{option.desc}</p>
                        </div>
                    </label>
                {/each}
            </div>
        </div>

        <!-- Social Media -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">
            <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">Social Media <span class="text-slate-400 font-normal normal-case text-[11px]">(all optional)</span></h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">📸 Instagram</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 font-bold text-sm">@</span>
                        <input name="instagram" value={profile?.instagram ?? ''}
                            placeholder="yourhandle"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">👤 Facebook</label>
                    <input name="facebook" value={profile?.facebook ?? ''}
                        placeholder="facebook.com/yourpage"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">🐦 X / Twitter</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 font-bold text-sm">@</span>
                        <input name="twitter" value={profile?.twitter ?? ''}
                            placeholder="yourhandle"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">🎵 TikTok</label>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 font-bold text-sm">@</span>
                        <input name="tiktok" value={profile?.tiktok ?? ''}
                            placeholder="yourhandle"
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                    </div>
                </div>
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">🌐 Website</label>
                <input name="website" type="url" value={profile?.website ?? ''}
                    placeholder="https://yourwebsite.com"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
            </div>
        </div>

        <!-- Save -->
        <button
            type="submit"
            disabled={isSaving}
            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 text-lg"
        >
            {isSaving ? 'Saving...' : 'Save Profile →'}
        </button>

    </form>
</div>