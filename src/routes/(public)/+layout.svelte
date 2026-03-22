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
    <a href="/" class="font-bold text-xl text-indigo-600 tracking-tight">What's Up SanLee!</a>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex gap-2 items-center">
        <a href="/feed" class="px-4 py-2 text-slate-600 font-bold text-sm hover:text-indigo-600 transition-colors">
            📣 Feed
        </a>
        <a href={`/events/${today}`} class="px-4 py-2 text-slate-600 font-bold text-sm hover:text-indigo-600 transition-colors">
            📅 Events
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
