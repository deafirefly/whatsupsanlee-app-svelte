<script lang="ts">
    const roadmapItems = [
        {
            phase: 'Phase 1',
            label: 'Foundation',
            status: 'complete',
            emoji: '✅',
            items: [
                'Member registration & profiles',
                'Business & food truck listings',
                'Community events calendar',
                'Community feed & posts',
                'Admin dashboard & moderation',
                'Lee County areas & communities',
            ]
        },
        {
            phase: 'Phase 2',
            label: 'Growth',
            status: 'current',
            emoji: '🚧',
            items: [
                'VIP membership features',
                'Sponsor & organization pages',
                'QR codes for businesses',
                'Social login (Google, Facebook)',
                'Email notifications',
                'Mobile app (iOS & Android)',
                'Event ticketing & RSVPs',
                'Booking system for service businesses',
            ]
        },
        {
            phase: 'Phase 3',
            label: 'Community',
            status: 'planned',
            emoji: '🔮',
            items: [
                'Community groups & clubs',
                'Local deals & coupons',
                'Job board for Lee County',
                'Lost & found board',
                'Community polls & voting',
                'Neighborhood watch alerts',
                'Local business reviews',
            ]
        },
        {
            phase: 'Phase 4',
            label: 'Platform',
            status: 'planned',
            emoji: '🌟',
            items: [
                'Payment processing for bookings',
                'Advanced analytics for businesses',
                'API for third party integrations',
                'Multi-county expansion',
                'Community radio/podcast integration',
                'Live event streaming',
            ]
        },
    ];
</script>

<div class="max-w-4xl mx-auto px-6 py-16 space-y-12">

    <!-- Header -->
    <div class="text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-200">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block"></span>
            Beta v0.3.0
        </div>
        <h1 class="text-5xl font-black text-slate-900 tracking-tight">
            We're just getting started! 🚀
        </h1>
        <p class="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            WhatsUp SanLee is currently in <strong class="text-amber-600">public beta</strong>. 
            We're building something special for the Sanford & Lee County community — 
            and we need your help to make it great!
        </p>
    </div>

    <!-- What is Beta -->
    <div class="bg-amber-50 border border-amber-200 rounded-3xl p-8">
        <h2 class="text-xl font-black text-amber-900 mb-4">⚠️ What does Beta mean?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {#each [
                { emoji: '🐛', title: 'Bugs may exist', desc: 'You might encounter issues. Please report them so we can fix them!' },
                { emoji: '🔄', title: 'Things may change', desc: 'Features, designs, and layouts may change as we improve the platform.' },
                { emoji: '📣', title: 'Your feedback matters', desc: 'Your input directly shapes the future of WhatsUp SanLee!' },
            ] as item}
                <div class="bg-white rounded-2xl p-4 border border-amber-100">
                    <span class="text-3xl block mb-2">{item.emoji}</span>
                    <p class="font-black text-amber-900 text-sm mb-1">{item.title}</p>
                    <p class="text-xs text-amber-700 leading-relaxed">{item.desc}</p>
                </div>
            {/each}
        </div>
    </div>

    <!-- Roadmap -->
    <div class="space-y-6">
        <div class="text-center">
            <h2 class="text-3xl font-black text-slate-900">Roadmap</h2>
            <p class="text-slate-500 mt-2">Here's what we've built and what's coming next!</p>
        </div>

        <div class="space-y-4">
            {#each roadmapItems as phase}
                <div class="bg-white rounded-3xl border {phase.status === 'complete' ? 'border-emerald-200' : phase.status === 'current' ? 'border-indigo-200' : 'border-slate-200'} shadow-sm overflow-hidden">
                    <!-- Phase Header -->
                    <div class="p-5 flex items-center gap-4 border-b {phase.status === 'complete' ? 'bg-emerald-50 border-emerald-100' : phase.status === 'current' ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}">
                        <span class="text-2xl">{phase.emoji}</span>
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <h3 class="font-black text-slate-900">{phase.phase} — {phase.label}</h3>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                    {phase.status === 'complete' ? 'bg-emerald-100 text-emerald-700' :
                                     phase.status === 'current' ? 'bg-indigo-100 text-indigo-700' :
                                     'bg-slate-200 text-slate-500'}">
                                    {phase.status === 'complete' ? 'Complete' : phase.status === 'current' ? 'In Progress' : 'Planned'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Phase Items -->
                    <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {#each phase.items as item}
                            <div class="flex items-center gap-2 text-sm">
                                <span class="{phase.status === 'complete' ? 'text-emerald-500' : phase.status === 'current' ? 'text-indigo-400' : 'text-slate-300'} flex-shrink-0">
                                    {phase.status === 'complete' ? '✓' : phase.status === 'current' ? '◎' : '○'}
                                </span>
                                <span class="{phase.status === 'complete' ? 'text-slate-600' : phase.status === 'current' ? 'text-slate-700' : 'text-slate-400'}">
                                    {item}
                                </span>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Discord CTA -->
    <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-white text-center relative overflow-hidden">
        <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">💬</div>
        <div class="relative z-10">
            <h2 class="text-3xl font-black mb-3">Join the conversation!</h2>
            <p class="text-indigo-200 max-w-xl mx-auto leading-relaxed mb-6">
                Have ideas, feedback, or found a bug? Join our Discord community to share your thoughts, 
                vote on upcoming features, and help shape the future of WhatsUp SanLee!
            </p>
            <div class="flex flex-wrap gap-4 justify-center">
                <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-8 py-4 bg-[#5865F2] text-white rounded-xl font-black hover:opacity-90 transition-all shadow-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    Join Discord Community
                </a>
                <a href="/contact"
                    class="inline-flex items-center gap-2 px-8 py-4 bg-white/20 text-white rounded-xl font-black hover:bg-white/30 transition-all">
                    📧 Send Feedback
                </a>
            </div>
        </div>
    </div>

    <!-- Report a Bug -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center">
        <span class="text-4xl block mb-3">🐛</span>
        <h3 class="text-xl font-black text-slate-900 mb-2">Found a bug?</h3>
        <p class="text-slate-500 text-sm mb-4 max-w-md mx-auto">
            Help us improve by reporting any issues you find. Every bug report makes WhatsUp SanLee better for everyone!
        </p>
        <a href="/contact"
            class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
            Report a Bug →
        </a>
    </div>

</div>