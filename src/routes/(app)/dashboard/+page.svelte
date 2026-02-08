<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    
    // Now TypeScript knows that 'user' exists because it 
    // looks at what your +layout.server.ts or +page.server.ts returns.
    const user = data.user; 
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="p-6 border rounded-xl bg-white shadow-sm">
        <h3 class="font-bold text-lg">Community Feed</h3>
        <p class="text-sm text-gray-500">See what other members are posting.</p>
    </div>

    {#if user.role === 'vip' || user.role === 'admin' || user.role === 'super-admin'}
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