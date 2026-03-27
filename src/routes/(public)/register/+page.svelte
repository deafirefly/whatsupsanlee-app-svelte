<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
    let isSubmitting = $state(false);
</script>

<div class="min-h-[80vh] flex items-center justify-center px-6 py-16">
    <div class="w-full max-w-md space-y-6">

        <!-- Header -->
        <div class="text-center space-y-2">
            <h1 class="text-4xl font-black text-slate-900">Join the Community!</h1>
            <p class="text-slate-500">Create your free WhatsUp SanLee account.</p>
        </div>

        <!-- What you get -->
        <div class="grid grid-cols-3 gap-3">
            {#each [
                { emoji: '📣', label: 'Community Feed' },
                { emoji: '📅', label: 'Local Events' },
                { emoji: '🚚', label: 'Local Listings' },
            ] as perk}
                <div class="bg-indigo-50 rounded-2xl p-3 text-center border border-indigo-100">
                    <span class="text-2xl block mb-1">{perk.emoji}</span>
                    <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{perk.label}</p>
                </div>
            {/each}
        </div>

        <!-- Card -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-4">

            <!-- Error Message -->
            {#if form?.message}
    <div class="p-4 {form.message.includes('closed') ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'} border rounded-2xl">
        <p class="{form.message.includes('closed') ? 'text-amber-700' : 'text-red-700'} font-bold text-sm">
            {form.message.includes('closed') ? '🔒' : '⚠'} {form.message}
        </p>
    </div>
{/if}

            <form
                method="POST"
                use:enhance={() => {
                    isSubmitting = true;
                    return async ({ update }) => {
                        await update();
                        isSubmitting = false;
                    };
                }}
                class="space-y-4"
            >
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                    />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="Min. 6 characters"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    class="w-full py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
                >
                    {isSubmitting ? 'Creating account...' : 'Create Free Account →'}
                </button>
            </form>

            <p class="text-[11px] text-slate-400 text-center leading-relaxed">
                By creating an account you agree to our
                <a href="/terms" class="text-indigo-600 hover:underline">Terms of Service</a>
                and
                <a href="/privacy" class="text-indigo-600 hover:underline">Privacy Policy</a>.
            </p>
        </div>

        <!-- Login Link -->
        <p class="text-center text-sm text-slate-500">
            Already have an account?
            <a href="/login" class="text-indigo-600 font-black hover:underline">Sign In →</a>
        </p>

        <!-- Discord -->
        <div class="text-center">
            <p class="text-xs text-slate-400 mb-2">Join our community</p>
            <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] text-white rounded-xl text-xs font-black hover:opacity-90 transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Join WhatsUp SanLee on Discord
            </a>
        </div>

    </div>
</div>