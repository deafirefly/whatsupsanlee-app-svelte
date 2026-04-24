<!-- src/routes/(member)/dashboard/+page.svelte -->
<script lang="ts">
    import { page } from '$app/state';
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';

    let { data }: { data: PageData } = $props();

    const user = data.user;
    const { userListing, onboardingSteps, onboardingComplete, onboardingDismissed, onboardingProgress, totalSteps } = data;

    let showMessage = $state(!!page.url.searchParams.get('message'));
    let messageText = page.url.searchParams.get('message');

    function closeMessage() {
        showMessage = false;
        window.history.replaceState({}, '', window.location.pathname);
    }

    let isVip = $derived(
        user?.roles?.includes('vip') ||
        user?.roles?.includes('admin') ||
        user?.roles?.includes('superadmin')
    );

    function getCategoryEmoji(category: string) {
        switch (category) {
            case 'food_truck': return '🚚';
            case 'farmer': return '👨‍🌾';
            case 'photographer': return '📸';
            case 'artist': return '🎨';
            default: return '⭐';
        }
    }

    let memberSince = $derived(
        user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : 'N/A'
    );

    let username = $derived(user?.displayName || user?.email?.split('@')[0] || 'Member');

    // Total listings count across all types
    let totalListings = $derived(
        (userListing ? 1 : 0) +
        (data.myFarmerListings?.length ?? 0) +
        (data.myYardSales?.length ?? 0)
    );
</script>

<div class="space-y-8 pb-20">

    <!-- URL Success Message -->
    {#if showMessage && messageText}
        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-xl">✨</span>
                <p class="text-emerald-800 font-bold text-sm">{messageText}</p>
            </div>
            <button onclick={closeMessage} class="text-emerald-400 hover:text-emerald-600 font-bold">✕</button>
        </div>
    {/if}

    <!-- Welcome Header -->
    <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">👋</div>
        <div class="relative z-10">
            <p class="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-1">Welcome back</p>
            <h1 class="text-3xl font-black capitalize">{username}!</h1>
            <p class="text-indigo-200 text-sm mt-2">{user?.email}</p>
            <div class="flex items-center gap-2 mt-4 flex-wrap">
                <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                    {user?.roles?.[0] ?? 'member'}
                </span>
                <span class="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-indigo-200">
                    Member since {memberSince}
                </span>
                {#if isVip}
                    <span class="px-3 py-1 bg-amber-400 text-slate-900 rounded-full text-xs font-black">⭐ VIP</span>
                {/if}
            </div>
        </div>
    </div>

    <!-- Onboarding Checklist -->
    {#if !onboardingDismissed}
        <div class="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-black text-slate-900">Getting Started 🚀</h3>
                    <p class="text-xs text-slate-400 mt-0.5">Complete these steps to get the most out of WhatsUp SanLee!</p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-black text-indigo-600">{onboardingProgress}/{totalSteps}</p>
                    <p class="text-[10px] text-slate-400 uppercase tracking-widest">complete</p>
                </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2">
                <div class="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style="width: {Math.round((onboardingProgress / totalSteps) * 100)}%"></div>
            </div>
            <div class="space-y-2">
                {#each onboardingSteps as step}
                    <div class="flex items-center gap-3 p-3 rounded-2xl {step.done ? 'bg-emerald-50' : 'bg-slate-50'} transition-all">
                        <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                            {step.done ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200'}">
                            {#if step.done}<span class="text-xs font-black">✓</span>{/if}
                        </div>
                        <p class="flex-1 text-sm font-bold {step.done ? 'text-emerald-700 line-through opacity-60' : 'text-slate-700'}">
                            {step.label}
                        </p>
                        {#if !step.done && step.href}
                            <a href={step.href} class="flex-shrink-0 px-3 py-1 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                                Go →
                            </a>
                        {/if}
                    </div>
                {/each}
            </div>
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                {#if onboardingComplete}
                    <p class="text-xs text-emerald-600 font-bold">🎉 All steps complete! You're all set!</p>
                {:else}
                    <p class="text-xs text-slate-400">You can dismiss this anytime</p>
                {/if}
                <form method="POST" action="?/dismissOnboarding" use:enhance>
                    <button type="submit" class="px-4 py-2 text-xs font-black rounded-xl transition-all
                        {onboardingComplete ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}">
                        {onboardingComplete ? '🎉 Done! Dismiss' : 'Dismiss'}
                    </button>
                </form>
            </div>
        </div>
    {/if}

    <!-- ═══════════════════════════════════ -->
    <!-- SECTION 1: STATUS                  -->
    <!-- ═══════════════════════════════════ -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Status</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-slate-50 rounded-2xl p-4 text-center">
                <p class="text-2xl font-black text-slate-900">{totalListings}</p>
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Total Listings</p>
            </div>
            <div class="bg-slate-50 rounded-2xl p-4 text-center">
                <p class="text-lg font-black {isVip ? 'text-amber-500' : 'text-slate-600'}">
                    {isVip ? 'VIP ⭐' : 'Member'}
                </p>
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Plan</p>
            </div>
            <div class="bg-slate-50 rounded-2xl p-4 text-center">
                <p class="text-lg font-black {userListing?.status === 'approved' ? 'text-emerald-600' : userListing?.status === 'pending' ? 'text-amber-500' : 'text-slate-400'}">
                    {userListing?.status ?? 'none'}
                </p>
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Business</p>
            </div>
            <div class="bg-slate-50 rounded-2xl p-4 text-center">
                <p class="text-lg font-black text-slate-900">{memberSince}</p>
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Member Since</p>
            </div>
        </div>
    </div>

    <!-- ═══════════════════════════════════ -->
    <!-- SECTION 2: PROFILE                 -->
    <!-- ═══════════════════════════════════ -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Profile</h2>
        <div class="grid grid-cols-3 gap-3">
            <a href="/profile" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group">
                <span class="text-2xl group-hover:scale-110 transition-transform">👤</span>
                <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">My Profile</span>
            </a>
            <a href="/profile/edit" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group">
                <span class="text-2xl group-hover:scale-110 transition-transform">✏️</span>
                <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Edit Profile</span>
            </a>
            <a href="/account-settings" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group">
                <span class="text-2xl group-hover:scale-110 transition-transform">⚙️</span>
                <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Settings</span>
            </a>
        </div>
    </div>

    <!-- ═══════════════════════════════════ -->
    <!-- SECTION 3: COMMUNITY               -->
    <!-- ═══════════════════════════════════ -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Community</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/feed/create" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group">
                <span class="text-2xl group-hover:scale-110 transition-transform">📣</span>
                <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Post to Feed</span>
            </a>
            <a href="/events/create" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group">
                <span class="text-2xl group-hover:scale-110 transition-transform">📅</span>
                <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Post Event</span>
            </a>
            <a href="/yard-sales/create" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group">
                <span class="text-2xl group-hover:scale-110 transition-transform">🏷️</span>
                <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Post Yard Sale</span>
            </a>
            <a href="/farmers/create" class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group">
                <span class="text-2xl group-hover:scale-110 transition-transform">🌾</span>
                <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">List Your Farm</span>
            </a>
        </div>

        <!-- VIP section inside community -->
        {#if isVip}
            <div class="mt-4 pt-4 border-t border-slate-100">
                <a href="/vip-lounge" class="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 hover:border-amber-300 transition-all group">
                    <span class="text-3xl group-hover:scale-110 transition-transform">⭐</span>
                    <div>
                        <p class="font-black text-amber-900 text-sm">VIP Lounge</p>
                        <p class="text-xs text-amber-600 mt-0.5">Your exclusive benefits are ready</p>
                    </div>
                    <span class="ml-auto text-amber-400 font-black">→</span>
                </a>
            </div>
        {:else}
            <div class="mt-4 pt-4 border-t border-slate-100">
                <a href="/subscribe" class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
                    <span class="text-3xl group-hover:scale-110 transition-transform">🔒</span>
                    <div>
                        <p class="font-black text-slate-700 text-sm">Upgrade to VIP</p>
                        <p class="text-xs text-slate-400 mt-0.5">Unlock exclusive content and features</p>
                    </div>
                    <span class="ml-auto text-indigo-400 font-black">→</span>
                </a>
            </div>
        {/if}
    </div>

    <!-- ═══════════════════════════════════ -->
    <!-- SECTION 4: YOUR COMMUNITY PRESENCE -->
    <!-- ═══════════════════════════════════ -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Your Community Presence</h2>

        <div class="space-y-4">

            <!-- Business Listing -->
            <div>
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Business Listing</p>
                {#if userListing}
                    <div class="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl flex-wrap">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">{getCategoryEmoji(userListing.category)}</span>
                            <div>
                                <p class="font-black text-slate-900">{userListing.businessName}</p>
                                <p class="text-xs text-slate-500">{userListing.category.replace('_', ' ')}</p>
                                <span class="text-[10px] font-black uppercase tracking-widest
                                    {userListing.status === 'approved' ? 'text-emerald-500' :
                                     userListing.status === 'pending' ? 'text-amber-500' : 'text-red-400'}">
                                    ● {userListing.status}
                                </span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            {#if userListing.status === 'approved'}
                                <a href="/listings/{userListing.id}" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all">
                                    View
                                </a>
                            {/if}
                            <a href="/dashboard/edit-listing" class="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all">
                                Edit
                            </a>
                            {#if userListing.category === 'food_truck'}
                                <a href="/dashboard/schedule" class="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all">
                                    📅 Schedule
                                </a>
                            {/if}
                            <a href="/dashboard/bookings" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all">
                                Bookings
                            </a>
                        </div>
                    </div>
                    {#if userListing.status === 'pending'}
                        <div class="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl p-3">
                            <span>⏳</span>
                            <p class="font-bold">Pending admin approval — we'll notify you once it's live!</p>
                        </div>
                    {/if}
                {:else}
                    <a href="/listings/create" class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
                        <span class="text-2xl group-hover:scale-110 transition-transform">🏪</span>
                        <div>
                            <p class="font-black text-slate-700 text-sm">Create a Business Listing</p>
                            <p class="text-xs text-slate-400">Food truck, artist, photographer, farmer...</p>
                        </div>
                        <span class="ml-auto text-slate-400 font-black">→</span>
                    </a>
                {/if}
            </div>

            <!-- Farm Listings -->
            <div class="pt-4 border-t border-slate-100">
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Farm Listings ({data.myFarmerListings?.length ?? 0})</p>
                {#if data.myFarmerListings?.length > 0}
                    <div class="space-y-2">
                        {#each data.myFarmerListings as farm}
                            <div class="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl flex-wrap">
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl">🌾</span>
                                    <div>
                                        <p class="font-black text-slate-900">{farm.farmName}</p>
                                        <p class="text-xs text-slate-500">{farm.contactName}</p>
                                        <span class="text-[10px] font-black uppercase tracking-widest
                                            {farm.status === 'approved' ? 'text-emerald-500' :
                                             farm.status === 'pending' ? 'text-amber-500' : 'text-red-400'}">
                                            ● {farm.status}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <a href="/farmers/{farm.id}" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all">
                                        View
                                    </a>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <a href="/farmers/create" class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all group">
                        <span class="text-2xl group-hover:scale-110 transition-transform">🌾</span>
                        <div>
                            <p class="font-black text-slate-700 text-sm">List Your Farm</p>
                            <p class="text-xs text-slate-400">Share your produce with the community</p>
                        </div>
                        <span class="ml-auto text-slate-400 font-black">→</span>
                    </a>
                {/if}
            </div>

            <!-- Yard Sales -->
            <div class="pt-4 border-t border-slate-100">
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Yard Sales ({data.myYardSales?.length ?? 0})</p>
                {#if data.myYardSales?.length > 0}
                    <div class="space-y-2">
                        {#each data.myYardSales as sale}
                            <div class="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl flex-wrap">
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl">🏷️</span>
                                    <div>
                                        <p class="font-black text-slate-900">{sale.title}</p>
                                        <p class="text-xs text-slate-500">📅 {sale.saleDate}</p>
                                        <span class="text-[10px] font-black uppercase tracking-widest
                                            {sale.status === 'approved' ? 'text-emerald-500' :
                                             sale.status === 'pending' ? 'text-amber-500' : 'text-red-400'}">
                                            ● {sale.status}
                                        </span>
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <a href="/yard-sales/{sale.id}" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all">
                                        View
                                    </a>
                                </div>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <a href="/yard-sales/create" class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
                        <span class="text-2xl group-hover:scale-110 transition-transform">🏷️</span>
                        <div>
                            <p class="font-black text-slate-700 text-sm">Post a Yard Sale</p>
                            <p class="text-xs text-slate-400">Let neighbors know what you're selling</p>
                        </div>
                        <span class="ml-auto text-slate-400 font-black">→</span>
                    </a>
                {/if}
            </div>

            <!-- Open Houses -->
<div class="pt-4 border-t border-slate-100">
    <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Open Houses ({data.myOpenHouses?.length ?? 0})</p>
    {#if data.myOpenHouses?.length > 0}
        <div class="space-y-2">
            {#each data.myOpenHouses as house}
                <div class="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl flex-wrap">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🏠</span>
                        <div>
                            <p class="font-black text-slate-900">{house.title}</p>
                            <p class="text-xs text-slate-500">{house.openDate}</p>
                            <span class="text-[10px] font-black uppercase tracking-widest
                                {house.status === 'approved' ? 'text-emerald-500' :
                                 house.status === 'pending' ? 'text-amber-500' : 'text-red-400'}">
                                ● {house.status}
                            </span>
                        </div>
                    </div>
                    <a href="/open-houses/{house.id}" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all">
                        View
                    </a>
                </div>
            {/each}
        </div>
    {:else}
        <a href="/open-houses/create" class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
            <span class="text-2xl">🏠</span>
            <div>
                <p class="font-black text-slate-700 text-sm">Post an Open House</p>
                <p class="text-xs text-slate-400">Let buyers know about your open house</p>
            </div>
            <span class="ml-auto text-slate-400 font-black">→</span>
        </a>
    {/if}
</div>

<!-- Creators -->
            <div class="pt-4 border-t border-slate-100">
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Creator Profiles ({data.myCreators?.length ?? 0})</p>
                {#if data.myCreators?.length > 0}
                    <div class="space-y-2">
                        {#each data.myCreators as creator}
                            <div class="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl flex-wrap">
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl">📱</span>
                                    <div>
                                        <p class="font-black text-slate-900">{creator.name}</p>
                                        {#if creator.tagline}
                                            <p class="text-xs text-slate-500">{creator.tagline}</p>
                                        {/if}
                                        <span class="text-[10px] font-black uppercase tracking-widest
                                            {creator.status === 'approved' ? 'text-emerald-500' :
                                             creator.status === 'pending' ? 'text-amber-500' : 'text-red-400'}">
                                            ● {creator.status}
                                        </span>
                                    </div>
                                </div>
                                <a href="/creators/{creator.id}" class="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all">
                                    View
                                </a>
                            </div>
                        {/each}
                    </div>
                {:else}
                    <a href="/creators/create" class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-all group">
                        <span class="text-2xl group-hover:scale-110 transition-transform">📱</span>
                        <div>
                            <p class="font-black text-slate-700 text-sm">Submit Your Creator Profile</p>
                            <p class="text-xs text-slate-400">Get discovered by the Lee County community</p>
                        </div>
                        <span class="ml-auto text-slate-400 font-black">→</span>
                    </a>
                {/if}
            </div>

        </div>
    </div>

</div>