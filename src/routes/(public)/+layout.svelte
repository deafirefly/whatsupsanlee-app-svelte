<script lang="ts">
    import type { LayoutProps } from './$types';

    interface ExtendedProps extends LayoutProps {
        data: LayoutProps['data'] & {
            user: { id: number; email: string; roles: string[] } | null;
        };
    }

    let { data, children }: ExtendedProps = $props();
    let menuOpen = $state(false);

    const today = new Date().toISOString().split('T')[0];
</script>

<!-- Main Nav -->
<header class="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-50 shadow-sm">
    <div class="flex flex-col">
    <a href="/" class="font-bold text-xl text-indigo-600 tracking-tight">What's Up SanLee!</a>
    {#if data.betaMode}
    <a href="/beta" class="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-amber-600 transition-colors">Beta →</a>
{/if}
</div>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex gap-2 items-center">
        <a href="/feed" class="px-4 py-2 text-slate-600 font-bold text-sm hover:text-indigo-600 transition-colors">
            📣 Feed
        </a>
        <a href={`/events/${today}`} class="px-4 py-2 text-slate-600 font-bold text-sm hover:text-indigo-600 transition-colors">
            📅 Events
        </a>
        <a href="/family" class="px-4 py-2 text-slate-600 font-bold text-sm hover:text-indigo-600 transition-colors">
            👨‍👩‍👧 Family
        </a>
        <a href="/about" class="px-4 py-2 text-slate-600 font-bold text-sm hover:text-indigo-600 transition-colors">
            About
        </a>
        <a href="/contact" class="px-4 py-2 text-slate-600 font-bold text-sm hover:text-indigo-600 transition-colors">
            Contact
        </a>
        <div class="w-px h-5 bg-slate-200 mx-1"></div>
        {#if data.user}
            <a href="/dashboard"
                class="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                Dashboard →
            </a>
        {:else}
            <a href="/login"
                class="px-4 py-2 text-indigo-600 font-bold text-sm hover:text-indigo-800 transition-colors">
                Login
            </a>
            <a href="/register"
                class="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all">
                Get Started
            </a>
        {/if}
    </nav>

    <!-- Mobile Menu Button -->
    <button class="md:hidden p-2 font-bold text-slate-600" onclick={() => menuOpen = !menuOpen}>
        {menuOpen ? '✕' : '☰'}
    </button>

    <!-- Mobile Menu -->
    {#if menuOpen}
        <div class="absolute top-full left-0 w-full bg-white border-b flex flex-col p-4 md:hidden shadow-xl z-50">
            <a href="/feed" onclick={() => menuOpen = false} class="py-3 border-b border-slate-50 font-bold text-slate-700">📣 Feed</a>
            <a href={`/events/${today}`} onclick={() => menuOpen = false} class="py-3 border-b border-slate-50 font-bold text-slate-700">📅 Events</a>
            <a href="/about" onclick={() => menuOpen = false} class="py-3 border-b border-slate-50 font-bold text-slate-700">About</a>
            <a href="/contact" onclick={() => menuOpen = false} class="py-3 border-b border-slate-50 font-bold text-slate-700">Contact</a>
            {#if data.user}
                <a href="/dashboard" onclick={() => menuOpen = false} class="mt-3 text-center bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold">
                    Dashboard →
                </a>
            {:else}
                <a href="/login" onclick={() => menuOpen = false} class="py-3 border-b border-slate-50 font-bold text-indigo-600">Login</a>
                <a href="/register" onclick={() => menuOpen = false} class="mt-3 text-center bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold">
                    Get Started
                </a>
            {/if}
        </div>
    {/if}
</header>

{@render children()}

<footer class="p-8 border-t mt-auto">
    <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex flex-col gap-1">
        <p class="text-xs text-muted-foreground">Built with ❤️ for the Sanford & Lee County community</p>
        <p class="text-xs text-muted-foreground">&copy; 2026 WhatsUp SanLee. All rights reserved. <span class="text-slate-300">v0.3.5</span></p>
    </div>
        <div class="flex items-center gap-6 text-xs">
            <a href="/about" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">About</a>
            <a href="/contact" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">Contact</a>
            <a href="/privacy" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">Privacy</a>
            <a href="/terms" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">Terms</a>
            <a href="/support" class="text-slate-500 hover:text-amber-500 font-bold transition-colors">☕ Support Us</a>
            <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-[#5865F2] text-white rounded-lg font-black hover:opacity-90 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.030z"/>
                </svg>
                Discord
            </a>
        </div>
    </div>
</footer>
