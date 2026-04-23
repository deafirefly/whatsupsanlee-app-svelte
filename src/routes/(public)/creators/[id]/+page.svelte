<!-- src/routes/(public)/creators/[id]/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import ShareBar from '$lib/components/ShareBar.svelte';

    let { data } = $props();
    const { creator, currentUserId, isAdmin } = data;

    const platformConfig: Record<string, {
        emoji: string; label: string;
        color: string; bgColor: string;
        getUrl: (val: string) => string;
        getDisplay: (val: string) => string;
    }> = {
        youtube:   {
            emoji: '▶️', label: 'YouTube',
            color: 'text-red-600', bgColor: 'bg-red-50 border-red-100 hover:bg-red-100',
            getUrl: v => v.startsWith('http') ? v : `https://youtube.com/@${v}`,
            getDisplay: v => v.startsWith('http') ? 'YouTube Channel' : `@${v}`,
        },
        tiktok:    {
            emoji: '🎵', label: 'TikTok',
            color: 'text-slate-900', bgColor: 'bg-slate-100 border-slate-200 hover:bg-slate-200',
            getUrl: v => v.startsWith('http') ? v : `https://tiktok.com/@${v}`,
            getDisplay: v => v.startsWith('@') ? v : `@${v}`,
        },
        instagram: {
            emoji: '📸', label: 'Instagram',
            color: 'text-pink-600', bgColor: 'bg-pink-50 border-pink-100 hover:bg-pink-100',
            getUrl: v => v.startsWith('http') ? v : `https://instagram.com/${v.replace('@', '')}`,
            getDisplay: v => v.startsWith('@') ? v : `@${v}`,
        },
        twitch:    {
            emoji: '🎮', label: 'Twitch',
            color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-100 hover:bg-purple-100',
            getUrl: v => v.startsWith('http') ? v : `https://twitch.tv/${v}`,
            getDisplay: v => v,
        },
        podcast:   {
            emoji: '🎙️', label: 'Podcast',
            color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-100 hover:bg-amber-100',
            getUrl: v => v,
            getDisplay: v => 'Listen Now',
        },
        facebook:  {
            emoji: '👤', label: 'Facebook',
            color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-100 hover:bg-blue-100',
            getUrl: v => v.startsWith('http') ? v : `https://facebook.com/${v}`,
            getDisplay: v => 'Facebook Page',
        },
        twitter:   {
            emoji: '🐦', label: 'X / Twitter',
            color: 'text-slate-700', bgColor: 'bg-slate-50 border-slate-200 hover:bg-slate-100',
            getUrl: v => v.startsWith('http') ? v : `https://x.com/${v.replace('@', '')}`,
            getDisplay: v => v.startsWith('@') ? v : `@${v}`,
        },
        bluesky:   {
            emoji: '🦋', label: 'Bluesky',
            color: 'text-sky-600', bgColor: 'bg-sky-50 border-sky-100 hover:bg-sky-100',
            getUrl: v => v.startsWith('http') ? v : `https://bsky.app/profile/${v.replace('@', '')}`,
            getDisplay: v => v.startsWith('@') ? v : `@${v}`,
        },
        website:   {
            emoji: '🌐', label: 'Website',
            color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100',
            getUrl: v => v,
            getDisplay: v => 'Visit Website',
        },
    };

    const statsMap: Record<string, { label: string; value: string | null }> = {
        youtube:   { label: 'Subscribers',  value: creator.youtubeSubs },
        tiktok:    { label: 'Followers',    value: creator.tiktokFollowers },
        instagram: { label: 'Followers',    value: creator.instagramFollowers },
        twitch:    { label: 'Followers',    value: creator.twitchFollowers },
        podcast:   { label: 'Listeners',    value: creator.podcastListeners },
    };

    const activePlatforms = ['youtube', 'tiktok', 'instagram', 'twitch', 'podcast', 'facebook', 'twitter', 'bluesky', 'website']
        .filter(p => (creator as any)[p]);
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Back Nav -->
    <div class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/creators" class="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1">
                ← Back to Creators
            </a>
            <div class="flex items-center gap-2">
                {#if currentUserId === creator.userId || isAdmin}
                    <form method="POST" action="?/delete" use:enhance>
                        <button onclick={(e) => { if (!confirm('Delete this creator profile?')) e.preventDefault(); }}
                            class="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-black hover:bg-red-100 transition-all">
                            🗑 Delete
                        </button>
                    </form>
                {/if}
                <a href="/creators/create"
                    class="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-black hover:bg-violet-700 transition-all">
                    + Submit Profile
                </a>
            </div>
        </div>
    </div>

    <div class="max-w-3xl mx-auto px-6 py-8 space-y-6">

        <!-- Hero -->
        <div class="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">📱</div>
            <div class="relative z-10 flex items-center gap-6 flex-wrap">
                <!-- Avatar -->
                {#if creator.imageUrl}
                    <img src={creator.imageUrl} alt={creator.name}
                        class="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-xl flex-shrink-0" />
                {:else}
                    <div class="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 shadow-xl flex items-center justify-center text-4xl font-black flex-shrink-0">
                        {creator.name[0].toUpperCase()}
                    </div>
                {/if}

                <div class="flex-1">
                    <div class="flex flex-wrap gap-2 mb-2">
                        {#if creator.isFeatured}
                            <span class="px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-black">✨ Featured</span>
                        {/if}
                        {#if creator.status === 'pending'}
                            <span class="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-black">⏳ Pending Review</span>
                        {/if}
                    </div>
                    <h1 class="text-3xl font-black">{creator.name}</h1>
                    {#if creator.tagline}
                        <p class="text-violet-200 mt-1 italic">{creator.tagline}</p>
                    {/if}
                    {#if creator.area}
                        <p class="text-violet-300 text-sm mt-1">📍 {creator.area}</p>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Stats bar (platforms with follower counts) -->
        {#if activePlatforms.some(p => statsMap[p]?.value)}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Audience</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {#each activePlatforms.filter(p => statsMap[p]?.value) as platform}
                        {@const config = platformConfig[platform]}
                        {@const stat = statsMap[platform]}
                        <div class="bg-slate-50 rounded-2xl p-4 text-center">
                            <p class="text-2xl">{config.emoji}</p>
                            <p class="text-xl font-black text-slate-900 mt-1">{stat.value}</p>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{config.label}</p>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- About -->
        {#if creator.bio}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">About</h2>
                <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{creator.bio}</p>
            </div>
        {/if}

        <!-- Content Categories -->
        {#if creator.contentCategories.length > 0}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Content</h2>
                <div class="flex flex-wrap gap-2">
                    {#each creator.contentCategories as cat}
                        <span class="px-4 py-2 bg-violet-50 border border-violet-100 text-violet-700 rounded-full text-sm font-black">
                            {cat}
                        </span>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Platform Links -->
        {#if activePlatforms.length > 0}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Find Me On</h2>
                <div class="space-y-3">
                    {#each activePlatforms as platform}
                        {@const config = platformConfig[platform]}
                        {@const val = (creator as any)[platform]}
                        <a href={config.getUrl(val)} target="_blank" rel="noopener noreferrer"
                            class="flex items-center justify-between p-4 rounded-2xl border transition-all {config.bgColor}">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">{config.emoji}</span>
                                <div>
                                    <p class="font-black text-slate-900 text-sm">{config.label}</p>
                                    <p class="text-xs text-slate-500">{config.getDisplay(val)}</p>
                                </div>
                            </div>
                            {#if statsMap[platform]?.value}
                                <span class="text-xs font-black text-slate-500 bg-white/80 px-3 py-1 rounded-full border border-slate-200">
                                    {statsMap[platform].value} {statsMap[platform].label}
                                </span>
                            {:else}
                                <span class="text-xs font-black {config.color}">Visit →</span>
                            {/if}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Share -->
        <ShareBar title={creator.name} description={creator.tagline ?? 'Local Creator — Lee County'} />

    </div>
</div>