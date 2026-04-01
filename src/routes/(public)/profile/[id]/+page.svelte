<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    const { profile, user, areaName, communityName, listing, isOwnProfile } = data;

    function getCategoryEmoji(category: string) {
        switch (category) {
            case 'food_truck': return '🚚';
            case 'farmer': return '👨‍🌾';
            case 'photographer': return '📸';
            case 'artist': return '🎨';
            default: return '⭐';
        }
    }

    let username = $derived(
        profile?.displayName || user?.email?.split('@')[0] || 'Member'
    );

    let memberSince = $derived(
        user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long', year: 'numeric'
              })
            : 'N/A'
    );
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Back Nav -->
    <div class="bg-white border-b">
        <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                ← Back to Community
            </a>
            {#if isOwnProfile}
                <a href="/profile/edit"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                    ✏️ Edit Profile
                </a>
            {/if}
        </div>
    </div>

    <div class="max-w-3xl mx-auto p-6 space-y-6">

        <!-- Profile Header -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm">

            <!-- Banner with Avatar -->
            <div class="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-3xl relative">
                {#if isOwnProfile}
                    <div class="absolute top-4 right-4">
                        <span class="px-3 py-1 bg-white/20 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                            Your Profile
                        </span>
                    </div>
                {/if}
                <!-- Avatar positioned at bottom of banner -->
                <div class="absolute -bottom-12 left-8">
                    {#if profile?.avatarUrl}
                        <img src={profile.avatarUrl} alt="Avatar"
                            class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
                    {:else}
                        <div class="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black border-4 border-white shadow-lg">
                            {username[0].toUpperCase()}
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Info -->
            <div class="px-8 pb-8">
                <div class="mt-14 mb-2"></div>

                <h1 class="text-2xl font-black text-slate-900 capitalize">{username}</h1>

                <div class="flex flex-wrap items-center gap-2 mt-3">
                    {#each (typeof user?.roles === 'string' ? JSON.parse(user.roles) : user?.roles ?? []) as role}
    <span class="px-3 py-1 text-xs font-black rounded-full uppercase tracking-widest border
        {role === 'vip' ? 'bg-amber-50 text-amber-600 border-amber-200' :
         role === 'superadmin' ? 'bg-rose-50 text-rose-600 border-rose-200' :
         role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
         'bg-slate-50 text-slate-500 border-slate-200'}">
        {#if role === 'vip'}⭐ {/if}
        {#if role === 'admin' || role === 'superadmin'}🛡️ {/if}
        {role}
    </span>
{/each}
                    <span class="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-full border border-slate-100">
                        Member since {memberSince}
                    </span>
                </div>

                {#if profile?.bio}
                    <p class="text-slate-600 mt-4 leading-relaxed">{profile.bio}</p>
                {/if}
            </div>
        </div>

        <!-- Community Location -->
        {#if areaName || communityName}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Community</h3>
                <div class="flex items-center gap-3">
                    <span class="text-2xl">📍</span>
                    <div>
                        {#if communityName}
                            <p class="font-black text-slate-900">{communityName}</p>
                        {/if}
                        {#if areaName}
                            <p class="text-sm text-slate-500">{areaName}, Lee County, NC</p>
                        {/if}
                    </div>
                </div>
            </div>
        {/if}

        <!-- Social Media -->
        {#if profile?.instagram || profile?.facebook || profile?.twitter || profile?.tiktok || profile?.website}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Follow</h3>
                <div class="flex flex-wrap gap-3">
                    {#if profile.instagram}
                        <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer"
                            class="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-black border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                            📸 @{profile.instagram}
                        </a>
                    {/if}
                    {#if profile.facebook}
                        <a href={profile.facebook} target="_blank" rel="noopener noreferrer"
                            class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-black border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
                            👤 Facebook
                        </a>
                    {/if}
                    {#if profile.twitter}
                        <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer"
                            class="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-black border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
                            🐦 @{profile.twitter}
                        </a>
                    {/if}
                    {#if profile.tiktok}
                        <a href={`https://tiktok.com/@${profile.tiktok}`} target="_blank" rel="noopener noreferrer"
                            class="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-black border border-slate-200 hover:bg-slate-900 hover:text-white transition-all">
                            🎵 @{profile.tiktok}
                        </a>
                    {/if}
                    {#if profile.website}
                        <a href={profile.website} target="_blank" rel="noopener noreferrer"
                            class="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-black border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all">
                            🌐 Website
                        </a>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- Their Listing -->
        {#if listing}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Community Listing</h3>
                <div class="flex items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="text-3xl bg-slate-50 p-3 rounded-2xl">
                            {getCategoryEmoji(listing.category)}
                        </div>
                        <div>
                            <h4 class="font-black text-slate-900">{listing.businessName}</h4>
                            <p class="text-sm text-slate-500">{listing.category.replace('_', ' ')}</p>
                            {#if listing.bio}
                                <p class="text-xs text-slate-400 mt-1 line-clamp-1 italic">"{listing.bio}"</p>
                            {/if}
                        </div>
                    </div>
                    <a href={`/listings/${listing.id}`}
                        class="flex-shrink-0 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                        View Listing
                    </a>
                </div>
            </div>
        {/if}

    </div>
</div>