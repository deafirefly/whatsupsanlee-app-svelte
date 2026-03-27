<script lang="ts">
    const perks = [
        { emoji: '☕', amount: '$3', label: 'One Coffee', desc: 'Keeps the server running for a day!' },
        { emoji: '☕☕', amount: '$5', label: 'Two Coffees', desc: 'Helps pay for hosting & database costs.' },
        { emoji: '☕☕☕', amount: '$10', label: 'A Round of Coffees', desc: 'Funds new features for the community!' },
    ];
</script>

<div class="max-w-3xl mx-auto px-6 py-16 space-y-12">

    <!-- Header -->
    <div class="text-center space-y-4">
        <div class="text-6xl">☕</div>
        <h1 class="text-5xl font-black text-slate-900 tracking-tight">
            Support WhatsUp SanLee!
        </h1>
        <p class="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
            WhatsUp SanLee is a passion project built by a deaf developer 
            right here in Sanford, NC — for our community, by our community. 💙
        </p>
    </div>

    <!-- Story Card -->
    <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-white relative overflow-hidden">
        <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">💙</div>
        <div class="relative z-10 space-y-4">
            <h2 class="text-2xl font-black">Why your support matters</h2>
            <p class="text-indigo-200 leading-relaxed">
                WhatsUp SanLee started as a dream to connect the people of Sanford & Lee County — 
                to help local food trucks get discovered, neighbors stay informed, and our community 
                grow stronger together.
            </p>
            <p class="text-indigo-200 leading-relaxed">
                Every coffee you buy goes directly into keeping this platform alive and growing — 
                hosting costs, database fees, and building new features for YOU, our community!
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {#each [
                    { emoji: '🖥️', label: 'Server Hosting' },
                    { emoji: '🗄️', label: 'Database Costs' },
                    { emoji: '✨', label: 'New Features' },
                ] as item}
                    <div class="bg-white/10 rounded-2xl p-4 text-center">
                        <span class="text-3xl block mb-2">{item.emoji}</span>
                        <p class="text-sm font-black">{item.label}</p>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Coffee Tiers -->
    <div class="space-y-4">
        <h2 class="text-2xl font-black text-slate-900 text-center">Choose your support level</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {#each perks as perk}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center hover:border-amber-300 hover:shadow-md transition-all">
                    <span class="text-4xl block mb-3">{perk.emoji}</span>
                    <p class="text-2xl font-black text-amber-500">{perk.amount}</p>
                    <p class="font-black text-slate-900 mt-1">{perk.label}</p>
                    <p class="text-xs text-slate-400 mt-2 leading-relaxed">{perk.desc}</p>
                </div>
            {/each}
        </div>
    </div>

    <!-- Main CTA -->
    <div class="text-center space-y-4">
        <a href="https://buymeacoffee.com/whatsupsanlee" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-3 px-10 py-5 bg-amber-400 text-slate-900 rounded-2xl font-black text-xl hover:bg-amber-500 transition-all shadow-xl shadow-amber-200 active:scale-95">
            <span class="text-2xl">☕</span>
            Buy Me a Coffee
        </a>
        <p class="text-xs text-slate-400">
            Powered by Buy Me a Coffee · Secure payments via Stripe
        </p>
    </div>

    <!-- What you get -->
    <div class="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center space-y-4">
        <h3 class="text-xl font-black text-amber-900">What supporters get</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
            {#each [
                '☕ Our eternal gratitude',
                '🌟 Supporter shoutout on Discord',
                '🚀 Early access to new features',
                '💙 Warm fuzzy feelings knowing you helped!',
            ] as perk}
                <div class="flex items-center gap-2 text-sm text-amber-800 font-bold">
                    <span>{perk}</span>
                </div>
            {/each}
        </div>
    </div>

    <!-- Other ways to help -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center space-y-4">
        <h3 class="text-xl font-black text-slate-900">Other ways to help</h3>
        <p class="text-slate-500 text-sm">Can't donate? No worries! You can still help us grow:</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {#each [
                { emoji: '📣', label: 'Spread the word', desc: 'Tell your friends & neighbors about WhatsUp SanLee!' },
                { emoji: '💬', label: 'Join Discord', desc: 'Be part of our growing community and share feedback.' },
                { emoji: '🐛', label: 'Report bugs', desc: 'Help us improve by reporting any issues you find.' },
            ] as item}
                <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <span class="text-3xl block mb-2">{item.emoji}</span>
                    <p class="font-black text-slate-900 text-sm">{item.label}</p>
                    <p class="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
            {/each}
        </div>
        <div class="flex flex-wrap gap-3 justify-center mt-4">
            <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#5865F2] text-white rounded-xl text-sm font-black hover:opacity-90 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Join Discord
            </a>
            <a href="/contact"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-black hover:bg-slate-200 transition-all">
                📧 Contact Us
            </a>
        </div>
    </div>

</div>