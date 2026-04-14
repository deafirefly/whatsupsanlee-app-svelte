<!-- src/lib/components/ShareBar.svelte -->
<script lang="ts">
    interface Props {
        title: string;       // e.g. "Deafirefly Art"
        description?: string; // optional subtitle
        url?: string;        // defaults to current page URL
    }

    let { title, description = '', url }: Props = $props();

    let copied = $state(false);
    let shareUrl = $state('');

    // Build full URL on mount (needs browser)
    import { onMount } from 'svelte';
    onMount(() => {
        shareUrl = url ?? window.location.href;
    });

    function getShareUrl() {
        return shareUrl || (typeof window !== 'undefined' ? window.location.href : '');
    }

    function getText() {
        const base = title;
        const desc = description ? ` — ${description}` : '';
        return `${base}${desc} | WhatsUp SanLee`;
    }

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(getShareUrl());
            copied = true;
            setTimeout(() => copied = false, 2000);
        } catch {
            // fallback
        }
    }

    function shareNative() {
        if (navigator.share) {
            navigator.share({
                title: getText(),
                url: getShareUrl(),
            }).catch(() => {});
        }
    }

    function openFacebook() {
        const u = encodeURIComponent(getShareUrl());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, '_blank', 'width=600,height=400');
    }

    function openTwitter() {
        const u = encodeURIComponent(getShareUrl());
        const t = encodeURIComponent(getText());
        window.open(`https://twitter.com/intent/tweet?url=${u}&text=${t}`, '_blank', 'width=600,height=400');
    }

    function openBluesky() {
        const t = encodeURIComponent(`${getText()} ${getShareUrl()}`);
        window.open(`https://bsky.app/intent/compose?text=${t}`, '_blank', 'width=600,height=400');
    }

    let hasNativeShare = $state(false);
    onMount(() => {
        hasNativeShare = !!navigator.share;
    });
</script>

<div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Share</h4>

    <div class="flex flex-wrap gap-2">

        <!-- Copy Link -->
        <button onclick={copyLink}
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all
            {copied
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'}">
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </button>

        <!-- Facebook -->
        <button onclick={openFacebook}
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black bg-[#1877F2] text-white hover:opacity-90 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
        </button>

        <!-- X / Twitter -->
        <button onclick={openTwitter}
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black bg-slate-900 text-white hover:opacity-90 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.516-8.6L1.924 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
        </button>

        <!-- Bluesky -->
        <button onclick={openBluesky}
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black bg-[#0085FF] text-white hover:opacity-90 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.299-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/>
            </svg>
            Bluesky
        </button>

        <!-- Native Share (mobile only) -->
        {#if hasNativeShare}
            <button onclick={shareNative}
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
                📤 Share
            </button>
        {/if}

    </div>
</div>