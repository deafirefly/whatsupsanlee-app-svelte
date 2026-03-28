<script lang="ts">
    let { data } = $props();
</script>

<div class="max-w-4xl mx-auto p-6 pb-20 space-y-8">

    <!-- Header -->
    <div class="bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl p-10 text-white relative overflow-hidden">
        <div class="absolute -right-6 -top-6 text-white/20 text-[120px] font-black select-none leading-none">⭐</div>
        <div class="relative z-10">
            <div class="inline-block px-4 py-2 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                VIP Lounge
            </div>
            <h1 class="text-4xl font-black mb-2">Welcome, VIP Member! ⭐</h1>
            <p class="text-amber-100 text-lg">
                You're part of an exclusive group of supporters helping build WhatsUp SanLee!
            </p>
        </div>
    </div>

    <!-- VIP Status -->
{#if data.vipExpiresAt}
    {@const expiry = new Date(data.vipExpiresAt)}
    {@const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
    <div class="bg-white rounded-2xl border {daysLeft < 7 ? 'border-red-200' : 'border-amber-200'} p-5 flex items-center gap-4">
        <span class="text-3xl">{daysLeft < 7 ? '⚠️' : '⏳'}</span>
        <div class="flex-1">
            <p class="font-black text-slate-900">VIP Membership Expires</p>
            <p class="text-sm {daysLeft < 7 ? 'text-red-600' : 'text-slate-500'}">
                {expiry.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                ({daysLeft} {daysLeft === 1 ? 'day' : 'days'} left)
            </p>
        </div>
        <a href="/support" class="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-black hover:bg-amber-600 transition-all">
            Renew →
        </a>
    </div>
{:else}
    <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4">
        <span class="text-3xl">♾️</span>
        <div>
            <p class="font-black text-emerald-900">Lifetime VIP Membership</p>
            <p class="text-sm text-emerald-600">Your VIP membership never expires!</p>
        </div>
    </div>
{/if}

    <!-- VIP Benefits -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each [
            { emoji: '⭐', title: 'VIP Badge', desc: 'Your profile shows a special VIP badge visible to the community.' },
            { emoji: '📸', title: 'Photo Gallery', desc: 'Upload up to 5 photos on your listing instead of just 1.' },
            { emoji: '🔝', title: 'Priority Placement', desc: 'Your listing appears higher in search results.' },
            { emoji: '👥', title: 'VIP Directory', desc: 'Featured in the exclusive VIP member directory.' },
            { emoji: '🚀', title: 'Early Access', desc: 'Get early access to new features before anyone else.' },
            { emoji: '💬', title: 'VIP Discord', desc: 'Access to exclusive VIP channels on our Discord server.' },
        ] as benefit}
            <div class="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 flex gap-4">
                <span class="text-3xl flex-shrink-0">{benefit.emoji}</span>
                <div>
                    <p class="font-black text-slate-900">{benefit.title}</p>
                    <p class="text-sm text-slate-500 mt-0.5 leading-relaxed">{benefit.desc}</p>
                </div>
            </div>
        {/each}
    </div>

    <!-- Early Access Features -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <h2 class="text-xl font-black text-slate-900 mb-2">🚀 Coming Soon — Early Access</h2>
        <p class="text-slate-500 text-sm mb-6">As a VIP member you'll get these features first!</p>
        <div class="space-y-3">
            {#each [
                { emoji: '📱', title: 'Mobile App', desc: 'iOS & Android app — VIPs get beta access first!' },
                { emoji: '🎟️', title: 'Event Ticketing', desc: 'RSVP and ticket system for community events.' },
                { emoji: '💳', title: 'Member Card', desc: 'Digital VIP membership card with QR code.' },
                { emoji: '📊', title: 'Business Analytics', desc: 'See how many people viewed your listing.' },
            ] as feature}
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span class="text-2xl flex-shrink-0">{feature.emoji}</span>
                    <div class="flex-1">
                        <p class="font-black text-slate-900 text-sm">{feature.title}</p>
                        <p class="text-xs text-slate-500">{feature.desc}</p>
                    </div>
                    <span class="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100 uppercase tracking-widest">
                        Coming Soon
                    </span>
                </div>
            {/each}
        </div>
    </div>

    <!-- VIP Discord -->
    <div class="bg-[#5865F2] rounded-3xl p-8 text-white text-center space-y-4">
        <span class="text-4xl block">💬</span>
        <h3 class="text-2xl font-black">Join the VIP Discord Channel</h3>
        <p class="text-indigo-200 max-w-md mx-auto">
            Connect with other VIP members, get exclusive updates, and chat directly with the WhatsUp SanLee team!
        </p>
        <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#5865F2] rounded-xl font-black hover:bg-indigo-50 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Join VIP Channel →
        </a>
    </div>

    <!-- Thank You -->
    <div class="text-center p-8 bg-amber-50 border border-amber-100 rounded-3xl">
        <span class="text-4xl block mb-3">💙</span>
        <h3 class="text-xl font-black text-amber-900">Thank you for supporting WhatsUp SanLee!</h3>
        <p class="text-amber-700 text-sm mt-2 max-w-md mx-auto">
            Your support helps keep this platform running and growing for the entire Sanford & Lee County community.
        </p>
    </div>
</div>