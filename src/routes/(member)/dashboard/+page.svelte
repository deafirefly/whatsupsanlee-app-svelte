<script lang="ts">
    import { page } from '$app/state';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    const user = data.user;
    const { userListing } = data;

    // URL message (e.g. after submitting a listing)
    let showMessage = $state(!!page.url.searchParams.get('message'));
    let messageText = page.url.searchParams.get('message');

    function closeMessage() {
        showMessage = false;
        window.history.replaceState({}, '', window.location.pathname);
    }

    // Role helpers
    let isVip = $derived(
        user?.roles?.includes('vip') ||
        user?.roles?.includes('admin') ||
        user?.roles?.includes('superadmin')
    );

    // Category emoji helper
    function getCategoryEmoji(category: string) {
        switch (category) {
            case 'food_truck': return '🚚';
            case 'farmer': return '👨‍🌾';
            case 'photographer': return '📸';
            case 'artist': return '🎨';
            default: return '⭐';
        }
    }

    // Member since formatted
    let memberSince = $derived(
        user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'N/A'
    );

    // Username from email
    let username = $derived(user?.email?.split('@')[0] ?? 'Member');
</script>

<div class="space-y-8 pb-20">

    <!-- URL Success Message -->
    {#if showMessage && messageText}
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div class="flex items-center gap-3">
                <span class="text-xl">✨</span>
                <p class="text-emerald-800 font-bold text-sm">{messageText}</p>
            </div>
            <button onclick={closeMessage} class="text-emerald-400 hover:text-emerald-600 font-bold">✕</button>
        </div>
    {/if}

    <!-- Welcome Header -->
    <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">
            👋
        </div>
        <div class="relative z-10">
            <p class="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-1">Welcome back</p>
            <h1 class="text-3xl font-black capitalize">{username}!</h1>
            <p class="text-indigo-200 text-sm mt-2">{user?.email}</p>
            <div class="flex items-center gap-2 mt-4">
                <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                    {user?.roles?.[0] ?? 'member'}
                </span>
                <span class="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-indigo-200">
                    Member since {memberSince}
                </span>
            </div>
        </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Listing</p>
            <p class="text-2xl font-black text-slate-900">{userListing ? '1' : '0'}</p>
            <p class="text-xs text-slate-400 mt-0.5">active listing</p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <p class="text-lg font-black {userListing?.status === 'approved' ? 'text-emerald-600' : userListing?.status === 'pending' ? 'text-amber-500' : 'text-slate-400'}">
                {userListing?.status ?? 'none'}
            </p>
            <p class="text-xs text-slate-400 mt-0.5">listing status</p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
            <p class="text-lg font-black {isVip ? 'text-amber-500' : 'text-slate-600'}">
                {isVip ? 'VIP ⭐' : 'Member'}
            </p>
            <p class="text-xs text-slate-400 mt-0.5">current plan</p>
        </div>
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Since</p>
            <p class="text-lg font-black text-slate-900">{memberSince}</p>
            <p class="text-xs text-slate-400 mt-0.5">member since</p>
        </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#if userListing?.status === 'approved'}
            <a href={`/listings/${userListing.id}`}
                class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col items-center gap-3 hover:border-indigo-300 hover:shadow-md transition-all group">
                <span class="text-2xl group-hover:scale-110 transition-transform">👁</span>
                <span class="text-xs font-black text-slate-700 uppercase tracking-widest text-center">View Profile</span>
            </a>
        {/if}
        <a href="/account-settings"
            class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col items-center gap-3 hover:border-indigo-300 hover:shadow-md transition-all group">
            <span class="text-2xl group-hover:scale-110 transition-transform">⚙️</span>
            <span class="text-xs font-black text-slate-700 uppercase tracking-widest text-center">Account Settings</span>
        </a>
        <a href="/profile"
            class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col items-center gap-3 hover:border-indigo-300 hover:shadow-md transition-all group">
            <span class="text-2xl group-hover:scale-110 transition-transform">👤</span>
            <span class="text-xs font-black text-slate-700 uppercase tracking-widest text-center">My Profile</span>
        </a>
        <a href="/profile/edit"
            class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col items-center gap-3 hover:border-indigo-300 hover:shadow-md transition-all group">
            <span class="text-2xl group-hover:scale-110 transition-transform">✏️</span>
            <span class="text-xs font-black text-slate-700 uppercase tracking-widest text-center">Edit Profile</span>
        </a>
    </div>

    <!-- Community Presence -->
    <div>
        <h2 class="text-lg font-black text-slate-900 mb-4">Your Community Presence</h2>

        {#if userListing}
            <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div class="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div class="flex items-center gap-4">
                        <div class="text-4xl bg-slate-50 p-4 rounded-2xl">
                            {getCategoryEmoji(userListing.category)}
                        </div>
                        <div>
                            <h3 class="font-black text-xl text-slate-900">{userListing.businessName}</h3>
                            <p class="text-sm text-slate-500 mt-0.5">{userListing.category.replace('_', ' ')}</p>
                            <span class="text-xs font-black uppercase tracking-widest mt-1 inline-block
                                {userListing.status === 'approved' ? 'text-emerald-500' :
                                 userListing.status === 'pending' ? 'text-amber-500' : 'text-red-400'}">
                                ● {userListing.status}
                            </span>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        {#if userListing.status === 'approved'}
                            <a href={`/listings/${userListing.id}`}
                                class="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                                View Profile
                            </a>
                        {/if}
                        <a href="/dashboard/edit-listing"
                            class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                            Edit Listing
                        </a>
                    </div>
                </div>

                {#if userListing.status === 'pending'}
                    <div class="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3 text-sm text-amber-600 bg-amber-50 rounded-2xl p-4">
                        <span class="text-lg">⏳</span>
                        <p class="font-bold">Your listing is pending admin approval. We'll notify you once it's live!</p>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-3xl p-12 text-center">
                <span class="text-4xl block mb-4">🏪</span>
                <p class="text-indigo-900 font-black text-lg mb-2">No listing yet!</p>
                <p class="text-indigo-500 text-sm mb-6">Share your business or craft with the San Lee community.</p>
                <a href="/listings/create"
                    class="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full font-black shadow-lg hover:scale-105 transition-all">
                    Create Your Listing
                </a>
            </div>
        {/if}
    </div>

    <!-- Community Feed & VIP -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Community Feed Placeholder -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div class="flex items-center gap-3 mb-3">
                <span class="text-2xl">📣</span>
                <h3 class="font-black text-slate-900">Community Feed</h3>
            </div>
            <p class="text-sm text-slate-500">See what other members are posting.</p>
            <div class="mt-4 p-4 bg-slate-50 rounded-2xl text-center">
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Coming Soon</p>
            </div>
        </div>

        <!-- VIP Lounge -->
        {#if isVip}
            <div class="bg-gradient-to-br from-amber-500 to-yellow-400 rounded-3xl p-6 text-white shadow-lg">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-2xl">⭐</span>
                    <h3 class="font-black">VIP Lounge</h3>
                </div>
                <p class="text-sm text-amber-100">Your exclusive benefits are ready.</p>
                <a href="/vip-lounge"
                    class="mt-4 inline-block bg-white text-amber-600 px-5 py-2.5 rounded-xl font-black text-sm hover:bg-amber-50 transition-all shadow-md">
                    Enter Now →
                </a>
            </div>
        {:else}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                    <div class="flex items-center gap-3 mb-3">
                        <span class="text-2xl">🔒</span>
                        <h3 class="font-black text-slate-400">VIP Lounge</h3>
                    </div>
                    <p class="text-sm text-slate-400 italic">Upgrade your plan to unlock exclusive content.</p>
                </div>
                <a href="/subscribe"
                    class="mt-4 text-center bg-indigo-600 text-white px-5 py-3 rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                    Upgrade to VIP →
                </a>
            </div>
        {/if}
    </div>

</div>