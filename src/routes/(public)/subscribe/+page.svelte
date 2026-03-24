<script lang="ts">
    let billing = $state<'monthly' | 'yearly'>('monthly');

    const plans = [
        {
            name: 'Free',
            emoji: '🌱',
            description: 'Perfect for community members who want to stay connected.',
            monthlyPrice: 0,
            yearlyPrice: 0,
            color: 'border-slate-200',
            buttonClass: 'bg-slate-900 text-white hover:bg-slate-700',
            buttonText: 'Get Started Free',
            href: '/register',
            features: [
                'Browse community listings',
                'View local events calendar',
                'Read community feed',
                'Create a member profile',
                'Join the Discord community',
            ],
            notIncluded: [
                'Post to community feed',
                'Submit business listing',
                'Post events',
                'VIP Lounge access',
            ]
        },
        {
            name: 'VIP Member',
            emoji: '⭐',
            description: 'For active community members who want to engage and share.',
            monthlyPrice: 5,
            yearlyPrice: 49,
            color: 'border-amber-400',
            featured: true,
            buttonClass: 'bg-amber-500 text-white hover:bg-amber-600',
            buttonText: 'Become VIP',
            href: '/register',
            features: [
                'Everything in Free',
                'Post to community feed',
                'Like & comment on posts',
                'VIP Lounge access',
                'VIP badge on profile',
                'Priority support',
            ],
            notIncluded: [
                'Business listing',
                'Post events',
            ]
        },
        {
            name: 'Business',
            emoji: '🚚',
            description: 'For local businesses, food trucks, farmers, and creators.',
            monthlyPrice: 10,
            yearlyPrice: 99,
            color: 'border-indigo-400',
            buttonClass: 'bg-indigo-600 text-white hover:bg-indigo-700',
            buttonText: 'List Your Business',
            href: '/register',
            features: [
                'Everything in VIP',
                'Create a business listing',
                'Daily location updates',
                'Menu/product showcase',
                'Photo gallery',
                'Schedule & hours display',
                'Google Maps integration',
                'Social media links',
            ],
            notIncluded: []
        },
        {
            name: 'Event Host',
            emoji: '🎉',
            description: 'For individuals and organizations who host community events.',
            monthlyPrice: 8,
            yearlyPrice: 79,
            color: 'border-purple-400',
            buttonClass: 'bg-purple-600 text-white hover:bg-purple-700',
            buttonText: 'Start Hosting',
            href: '/register',
            features: [
                'Everything in VIP',
                'Post unlimited events',
                'Multi-day event support',
                'Event photo uploads',
                'Map pin for events',
                'Area & community targeting',
                'Event management dashboard',
            ],
            notIncluded: []
        },
    ];

    function getPrice(plan: typeof plans[0]) {
        if (plan.monthlyPrice === 0) return 'Free';
        const price = billing === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
        return `$${price}/mo`;
    }

    function getSavings(plan: typeof plans[0]) {
        if (plan.monthlyPrice === 0) return null;
        const monthlyCost = plan.monthlyPrice * 12;
        const savings = monthlyCost - plan.yearlyPrice;
        return savings;
    }
</script>

<div class="max-w-6xl mx-auto px-6 py-16 space-y-12">

    <!-- Header -->
    <div class="text-center space-y-4">
        <div class="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
            Pricing
        </div>
        <h1 class="text-5xl font-black text-slate-900 tracking-tight">
            Simple, transparent pricing
        </h1>
        <p class="text-xl text-slate-500 max-w-xl mx-auto">
            Join the WhatsUp SanLee community for free, or upgrade for more features.
        </p>

        <!-- Billing Toggle -->
        <div class="flex items-center justify-center gap-4 mt-6">
            <span class="text-sm font-bold {billing === 'monthly' ? 'text-slate-900' : 'text-slate-400'}">Monthly</span>
            <button
    onclick={() => billing = billing === 'monthly' ? 'yearly' : 'monthly'}
    aria-label="Toggle billing period"
    class="relative w-14 h-7 rounded-full transition-colors {billing === 'yearly' ? 'bg-indigo-600' : 'bg-slate-200'}"
>
                <span class="absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all {billing === 'yearly' ? 'left-8' : 'left-1'}"></span>
            </button>
            <span class="text-sm font-bold {billing === 'yearly' ? 'text-slate-900' : 'text-slate-400'}">
                Yearly
                <span class="ml-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100">
                    Save up to 20%
                </span>
            </span>
        </div>
    </div>

    <!-- Pricing Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each plans as plan}
            <div class="bg-white rounded-3xl border-2 {plan.color} shadow-sm hover:shadow-lg transition-all flex flex-col {plan.featured ? 'ring-2 ring-amber-400 ring-offset-2' : ''}">

                {#if plan.featured}
                    <div class="bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest text-center py-2 rounded-t-2xl">
                        Most Popular
                    </div>
                {/if}

                <div class="p-6 flex flex-col flex-1">
                    <!-- Plan Header -->
                    <div class="mb-6">
                        <span class="text-3xl block mb-2">{plan.emoji}</span>
                        <h3 class="font-black text-slate-900 text-lg">{plan.name}</h3>
                        <p class="text-xs text-slate-400 mt-1 leading-relaxed">{plan.description}</p>
                    </div>

                    <!-- Price -->
                    <div class="mb-6">
                        <div class="flex items-baseline gap-1">
                            <span class="text-4xl font-black text-slate-900">{getPrice(plan)}</span>
                        </div>
                        {#if billing === 'yearly' && plan.monthlyPrice > 0}
                            <p class="text-xs text-slate-400 mt-1">
                                ${plan.yearlyPrice}/year
                                {#if getSavings(plan)}
                                    <span class="text-emerald-600 font-bold ml-1">Save ${getSavings(plan)}!</span>
                                {/if}
                            </p>
                        {:else if plan.monthlyPrice > 0}
                            <p class="text-xs text-slate-400 mt-1">billed monthly</p>
                        {/if}
                    </div>

                    <!-- CTA Button -->
                    <a href={plan.href}
                        class="w-full py-3 rounded-xl font-black text-sm text-center transition-all mb-6 {plan.buttonClass}">
                        {plan.buttonText}
                    </a>

                    <!-- Features -->
                    <div class="space-y-2 flex-1">
                        {#each plan.features as feature}
                            <div class="flex items-start gap-2 text-sm">
                                <span class="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                                <span class="text-slate-700">{feature}</span>
                            </div>
                        {/each}
                        {#each plan.notIncluded as feature}
                            <div class="flex items-start gap-2 text-sm">
                                <span class="text-slate-300 flex-shrink-0 mt-0.5">✕</span>
                                <span class="text-slate-300">{feature}</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Coming Soon Note -->
    <div class="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-center">
        <span class="text-3xl block mb-3">🚀</span>
        <h3 class="font-black text-indigo-900 text-lg mb-2">Payments Coming Soon!</h3>
        <p class="text-indigo-600 text-sm max-w-xl mx-auto leading-relaxed">
            We're currently in beta and all features are free while we build out the platform.
            Paid plans will be activated when we officially launch. Join now and lock in early access!
        </p>
        <a href="/register"
            class="mt-6 inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Join Free During Beta →
        </a>
    </div>

    <!-- Sponsorship Section -->
<div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-white relative overflow-hidden">
    <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">
        🤝
    </div>
    <div class="relative z-10">
        <div class="inline-block px-4 py-2 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Sponsorships
        </div>
        <h2 class="text-3xl font-black mb-3">Sponsor WhatsUp SanLee</h2>
        <p class="text-indigo-200 leading-relaxed max-w-xl mb-2">
            Are you a local business, church, school, nonprofit, sports team, or community organization? Partner with WhatsUp SanLee and get your own dedicated page plus ad placements across the platform — reaching the entire Lee County community!
        </p>

        <!-- Who can sponsor -->
        <div class="flex flex-wrap gap-2 mb-6">
            {#each ['🚚 Food Trucks', '🏪 Businesses', '⛪ Churches', '🏫 Schools', '🏆 Sports Teams', '🌱 Nonprofits', '🎨 Artists', '👥 Organizations'] as tag}
                <span class="px-3 py-1 bg-white/20 rounded-full text-xs font-black">
                    {tag}
                </span>
            {/each}
        </div>

        <!-- What you get -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {#each [
                {
                    emoji: '📄',
                    title: 'Your Own Dedicated Page',
                    desc: 'Get a custom page on WhatsUp SanLee showcasing your organization, events, photos, and contact info.'
                },
                {
                    emoji: '📢',
                    title: 'Ad Placements',
                    desc: 'Your banner or logo appears on sponsored pages — Events, Feed, Listings, and more — linking directly to your page.'
                },
                {
                    emoji: '📍',
                    title: 'Area Targeting',
                    desc: 'Target specific Lee County areas and neighborhoods to reach your most relevant local audience.'
                },
                {
                    emoji: '⭐',
                    title: 'Featured Highlights',
                    desc: 'Get featured listings, pinned posts, and priority placement across the platform.'
                },
            ] as perk}
                <div class="bg-white/10 rounded-2xl p-4 flex gap-3">
                    <span class="text-2xl flex-shrink-0">{perk.emoji}</span>
                    <div>
                        <p class="font-black text-white text-sm">{perk.title}</p>
                        <p class="text-indigo-200 text-xs mt-0.5 leading-relaxed">{perk.desc}</p>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Example sponsor pages -->
        <div class="bg-white/10 rounded-2xl p-5 mb-8">
            <p class="text-xs font-black uppercase tracking-widest text-indigo-200 mb-3">How it works</p>
            <div class="flex flex-col gap-2 text-sm">
                <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black flex-shrink-0">1</span>
                    <p class="text-indigo-100">You get a dedicated page at <span class="font-black text-white">whatsupsanlee.com/sponsors/your-name</span></p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black flex-shrink-0">2</span>
                    <p class="text-indigo-100">Your ad appears on your chosen pages with a link back to your page</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-black flex-shrink-0">3</span>
                    <p class="text-indigo-100">The Lee County community discovers you and visits your page!</p>
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div class="flex flex-wrap gap-4">
            <a href="/contact"
                class="px-8 py-4 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all shadow-lg">
                Get in Touch →
            </a>
            <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                class="px-8 py-4 bg-white/20 text-white rounded-xl font-black text-sm hover:bg-white/30 transition-all flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Chat on Discord
            </a>
        </div>

        <p class="text-indigo-300 text-xs mt-4">
            Sponsorship packages are currently being finalized. Contact us to discuss custom options for your business or organization!
        </p>
    </div>
</div>

    <!-- FAQ -->
    <div class="max-w-2xl mx-auto space-y-4">
        <h2 class="text-2xl font-black text-slate-900 text-center mb-6">Pricing FAQ</h2>
        {#each [
            {
                q: 'Is it really free to join?',
                a: 'Yes! Basic membership is completely free and always will be. You can browse listings, view events, and read the community feed without paying anything.'
            },
            {
                q: 'When will paid plans be activated?',
                a: 'We are currently in beta. All features are free while we build and test the platform. Paid plans will be activated at official launch.'
            },
            {
                q: 'Can I change my plan later?',
                a: 'Yes! You can upgrade or downgrade your plan at any time from your account settings.'
            },
            {
                q: 'Is there a free trial for paid plans?',
                a: 'Since we\'re in beta, everything is currently free. When paid plans launch, we\'ll offer a free trial period.'
            },
            {
                q: 'What payment methods will you accept?',
                a: 'We plan to accept all major credit cards, debit cards, and potentially PayPal when payments launch.'
            },
        ] as faq}
            <div class="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 class="font-black text-slate-900 text-sm mb-2">{faq.q}</h3>
                <p class="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
        {/each}
    </div>

</div>