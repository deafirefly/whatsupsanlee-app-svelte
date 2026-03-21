<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Back Nav -->
    <div class="bg-white border-b">
        <div class="max-w-5xl mx-auto px-6 py-4">
            <a href="/" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                ← Back to Home
            </a>
        </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-16 space-y-16">

        <!-- Hero -->
        <div class="text-center space-y-6">
            <div class="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
                Sanford & Lee County, NC
            </div>
            <h1 class="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                What's Up <span class="text-indigo-600">SanLee!</span>
            </h1>
            <p class="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                A community platform built by locals, for locals — connecting the people, businesses, and events of Lee County, North Carolina.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="/register"
                    class="px-8 py-4 bg-indigo-600 text-white rounded-full font-black shadow-lg hover:scale-105 transition-all">
                    Join the Community →
                </a>
                <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                    class="px-8 py-4 bg-[#5865F2] text-white rounded-full font-black shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    Join our Discord
                </a>
            </div>
        </div>

        <!-- Mission -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-10">
            <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Our Mission</h2>
            <p class="text-2xl font-black text-slate-900 leading-snug mb-4">
                To bring the Lee County community together in one place.
            </p>
            <p class="text-slate-500 leading-relaxed">
                Whether you're a food truck owner wanting to share your daily location, a resident looking to discover a yard sale down the street, or someone who wants to know what's happening in their neighborhood today — WhatsUp SanLee is your go-to community hub for everything happening in Sanford and Lee County, NC.
            </p>
        </div>

        <!-- What We Offer -->
        <div>
            <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">What We Offer</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each [
                    { emoji: '🚚', title: 'Food Trucks & Local Businesses', desc: 'Discover local food trucks, farmers, photographers, artists and more — all in one place.' },
                    { emoji: '📅', title: 'Community Events', desc: 'From yard sales and open houses to farmer\'s markets and movies — see everything happening today in Lee County.' },
                    { emoji: '👥', title: 'Member Profiles', desc: 'Connect with your neighbors. Find out who lives in your community and what they\'re up to.' },
                    { emoji: '🏘', title: 'Neighborhood Communities', desc: 'Organized by Lee County areas and neighborhoods — find what\'s happening closest to you.' },
                    { emoji: '⭐', title: 'VIP Membership', desc: 'Unlock exclusive content and features with a VIP membership.' },
                    { emoji: '📱', title: 'Mobile App', desc: 'Available on iOS and Android — take WhatsUp SanLee with you everywhere you go.' },
                ] as feature}
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex gap-4">
                        <span class="text-3xl flex-shrink-0">{feature.emoji}</span>
                        <div>
                            <h3 class="font-black text-slate-900 mb-1">{feature.title}</h3>
                            <p class="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Lee County -->
        <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-10 text-white relative overflow-hidden">
            <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">
                🌟
            </div>
            <div class="relative z-10">
                <h2 class="text-xs font-black text-indigo-200 uppercase tracking-widest mb-4">About Lee County, NC</h2>
                <p class="text-2xl font-black leading-snug mb-4">
                    Home to Sanford, Broadway, Tramway and more.
                </p>
                <p class="text-indigo-200 leading-relaxed">
                    Lee County is a vibrant community in the heart of North Carolina. From the city of Sanford to the small towns and neighborhoods that make up our county — we're a community of hardworking, creative, and passionate people. WhatsUp SanLee was built to celebrate and connect all of us.
                </p>
            </div>
        </div>

        <!-- Join Discord -->
        <div class="bg-[#5865F2] rounded-3xl p-10 text-white text-center relative overflow-hidden">
            <div class="absolute -right-6 -top-6 text-white/10 text-[120px] font-black select-none leading-none">
                💬
            </div>
            <div class="relative z-10">
                <h2 class="text-2xl font-black mb-3">Join our Discord Community!</h2>
                <p class="text-indigo-200 mb-6 max-w-xl mx-auto">
                    Connect with other Lee County residents, share ideas, give feedback, and help shape the future of WhatsUp SanLee.
                </p>
                <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#5865F2] rounded-full font-black shadow-lg hover:scale-105 transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    Join WhatsUp SanLee on Discord
                </a>
            </div>
        </div>

        <!-- Built With Love -->
        <div class="text-center space-y-3">
            <p class="text-slate-400 text-sm">Built with ❤️ for the Sanford & Lee County community</p>
            <div class="flex justify-center gap-6 text-xs text-slate-400">
                <a href="/contact" class="hover:text-indigo-600 transition-colors font-bold">Contact Us</a>
                <a href="/privacy" class="hover:text-indigo-600 transition-colors font-bold">Privacy Policy</a>
                <a href="/terms" class="hover:text-indigo-600 transition-colors font-bold">Terms of Service</a>
            </div>
        </div>

    </div>
</div>