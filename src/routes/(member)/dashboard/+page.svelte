<script lang="ts">
    import { page } from '$app/state';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    const user = data.user; 

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