<script lang="ts">
    import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center px-6">
    <div class="max-w-md w-full text-center space-y-6">

        <!-- Big 404 -->
        <div class="relative">
            <p class="text-[150px] font-black text-indigo-100 leading-none select-none">
                {$page.status}
            </p>
            <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-6xl">
                    {#if $page.status === 404}🔍
                    {:else if $page.status === 403}🔒
                    {:else if $page.status === 500}💥
                    {:else}😕
                    {/if}
                </span>
            </div>
        </div>

        <!-- Message -->
        <div class="space-y-2">
            <h1 class="text-3xl font-black text-slate-900">
                {#if $page.status === 404}Page Not Found
                {:else if $page.status === 403}Access Denied
                {:else if $page.status === 500}Server Error
                {:else}Something Went Wrong
                {/if}
            </h1>
            <p class="text-slate-500 leading-relaxed">
                {#if $page.status === 404}
                    Oops! We couldn't find that page. It may have been moved or doesn't exist.
                {:else if $page.status === 403}
                    You don't have permission to view this page.
                {:else if $page.status === 500}
                    Something went wrong on our end. We're working on it!
                {:else}
                    {$page.error?.message || 'An unexpected error occurred.'}
                {/if}
            </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/"
                class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                🏠 Go Home
            </a>
            <button
                onclick={() => history.back()}
                class="px-6 py-3 bg-white text-slate-700 rounded-xl font-black hover:bg-slate-50 transition-all border border-slate-200">
                ← Go Back
            </button>
        </div>

        <!-- Discord -->
        <div class="pt-4 border-t border-slate-200">
            <p class="text-xs text-slate-400 mb-3">Need help? Join our community!</p>
            <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] text-white rounded-xl text-xs font-black hover:opacity-90 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Join WhatsUp SanLee on Discord
            </a>
        </div>

        <!-- Branding -->
        <p class="text-xs text-slate-300">
            WhatsUp SanLee · Sanford & Lee County, NC
        </p>

    </div>
</div>