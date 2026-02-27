<script lang="ts">
    import { page } from '$app/state';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    const user = data.user; 

    const  { userListing } = data;

    // 1. Create a local 'visible' state
    // We initialize it based on whether the URL has a message
    let showMessage = $state(!!page.url.searchParams.get('message'));
    
    // 2. Grab the actual text
    let messageText = page.url.searchParams.get('message');

    function closeMessage() {
        showMessage = false;
        // Optional: Clean up the URL so if they refresh, the message stays gone
        window.history.replaceState({}, '', window.location.pathname);
    }
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">
   
    {#if showMessage && messageText}
        <div class="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
            <div class="flex items-center gap-3">
                <span class="text-xl">✨</span>
                <p class="text-emerald-800 font-medium">{messageText}</p>
            </div>
        
            <button 
                onclick={closeMessage} 
                class="text-emerald-400 hover:text-emerald-600 font-bold px-2 py-1 transition-colors"
                aria-label="Close message"
            >
                ✕
            </button>
        </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 border rounded-xl bg-white shadow-sm">
            <h3 class="font-bold text-lg">Community Feed</h3>
            <p class="text-sm text-gray-500">See what other members are posting.</p>
        </div>

        {#if user.role === 'vip' || user.role === 'admin' || user.role === 'superadmin'}
            <div class="p-6 border-2 border-yellow-500 rounded-xl bg-yellow-50 shadow-md">
                <h3 class="font-bold text-lg text-yellow-800">✨ VIP Lounge</h3>
                <p class="text-sm text-yellow-700">Your exclusive benefits are ready.</p>
                <a href="/dashboard/vip-lounge" class="mt-4 inline-block bg-yellow-600 text-white px-4 py-2 rounded font-bold text-sm">Enter Now</a>
            </div>
        {:else}
            <div class="p-6 border rounded-xl bg-gray-50 flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-lg text-gray-400">Locked: VIP Lounge</h3>
                    <p class="text-sm text-gray-400 italic">Upgrade your plan to unlock exclusive content.</p>
                </div>
                <a href="/subscribe" class="mt-4 text-center bg-indigo-600 text-white px-4 py-2 rounded font-bold text-sm">Upgrade to VIP</a>
            </div>
        {/if}
    </div>
</div>

<div class="space-y-8">
    <section>
        <h2 class="text-2xl font-black text-slate-900 mb-4">Your Community Presence</h2>
        
        {#if userListing}
            <div class="bg-white border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="flex items-center gap-4">
                    <div class="text-4xl bg-slate-50 p-4 rounded-2xl">
                        {userListing.category === 'food_truck' ? '🚚' : '🎨'}
                    </div>
                    <div>
                        <h3 class="font-bold text-xl">{userListing.businessName}</h3>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold uppercase tracking-widest {userListing.status === 'approved' ? 'text-emerald-500' : 'text-amber-500'}">
                                ● {userListing.status}
                            </span>
                        </div>
                    </div>
                </div>
                
                <a href="/dashboard/edit-listing" class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                    Edit Listing Details
                </a>
            </div>
        {:else}
            <div class="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-3xl p-12 text-center">
                <p class="text-indigo-900 font-bold mb-4">You haven't created a listing yet!</p>
                <a href="/dashboard/create-listing" class="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full font-black shadow-lg hover:scale-105 transition-all">
                    Create Your Listing
                </a>
            </div>
        {/if}
    </section>
</div>