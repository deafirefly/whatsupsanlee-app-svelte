<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let published = $derived(data.posts.filter(p => p.status === 'published'));
    let removed = $derived(data.posts.filter(p => p.status === 'removed'));
    let reported = $derived(data.posts.filter(p => p.reportCount > 0));

    let activeTab = $state<'all' | 'published' | 'removed' | 'reported'>('reported');

    let filtered = $derived(() => {
        switch (activeTab) {
            case 'published': return published;
            case 'removed': return removed;
            case 'reported': return reported;
            default: return data.posts;
        }
    });

    function formatDate(date: Date | null) {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }

    function getInitial(name: string | null, email: string) {
        return (name ?? email)[0].toUpperCase();
    }
</script>

<div class="max-w-5xl mx-auto p-6 space-y-6">

    <!-- Header -->
    <div>
        <h1 class="text-3xl font-black text-slate-900">Post Moderation</h1>
        <p class="text-slate-500 mt-1">Review and moderate community feed posts.</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p class="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
            <p class="text-3xl font-black text-slate-700">{data.posts.length}</p>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <p class="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Published</p>
            <p class="text-3xl font-black text-emerald-700">{published.length}</p>
        </div>
        <div class="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p class="text-xs font-black text-red-400 uppercase tracking-widest mb-1">Removed</p>
            <p class="text-3xl font-black text-red-700">{removed.length}</p>
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p class="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Reported</p>
            <p class="text-3xl font-black text-amber-700">{reported.length}</p>
        </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {#each [
            { value: 'reported', label: 'Reported' },
            { value: 'published', label: 'Published' },
            { value: 'removed', label: 'Removed' },
            { value: 'all', label: 'All' },
        ] as tab}
            <button
                onclick={() => activeTab = tab.value as typeof activeTab}
                class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all
                {activeTab === tab.value
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'}"
            >
                {tab.label}
                {#if tab.value === 'reported' && reported.length > 0}
                    <span class="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[10px]">
                        {reported.length}
                    </span>
                {/if}
            </button>
        {/each}
    </div>

    <!-- Posts List -->
    {#if filtered().length === 0}
        <div class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <span class="text-4xl block mb-4">📋</span>
            <h3 class="text-xl font-bold text-slate-900">No {activeTab} posts</h3>
            <p class="text-slate-500 text-sm mt-1">Nothing to review here right now.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each filtered() as post}
                <div class="bg-white border {post.reportCount > 0 ? 'border-amber-200' : 'border-slate-200'} rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">

                        <!-- Post Info -->
                        <div class="flex-1 min-w-0">
                            <!-- Author -->
                            <div class="flex items-center gap-3 mb-3">
                                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                    {getInitial(post.authorName, post.authorEmail)}
                                </div>
                                <div>
                                    <p class="font-black text-slate-900 text-sm">
                                        {post.authorName ?? post.authorEmail.split('@')[0]}
                                    </p>
                                    <p class="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
                                </div>
                                <!-- Badges -->
                                <div class="flex gap-2 flex-wrap ml-2">
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase
                                        {post.status === 'published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-500 border border-red-200'}">
                                        {post.status}
                                    </span>
                                    {#if post.isPinned}
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100">
                                            📌 Pinned
                                        </span>
                                    {/if}
                                    {#if post.reportCount > 0}
                                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-50 text-red-500 border border-red-200">
                                            🚩 {post.reportCount} {post.reportCount === 1 ? 'report' : 'reports'}
                                        </span>
                                    {/if}
                                </div>
                            </div>

                            <!-- Content -->
                            {#if post.content}
                                <p class="text-sm text-slate-700 leading-relaxed line-clamp-3 mb-2">{post.content}</p>
                            {/if}
                            {#if post.imageUrl}
                                <div class="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 mb-2">
                                    <img src={post.imageUrl} alt="Post" class="w-full h-full object-cover" />
                                </div>
                            {/if}
                            {#if post.linkUrl}
                                <p class="text-xs text-indigo-600 truncate">🔗 {post.linkUrl}</p>
                            {/if}
                        </div>

                        <!-- Actions -->
                        <div class="flex flex-wrap gap-2 md:flex-col md:items-end flex-shrink-0">

                            <!-- Pin/Unpin -->
                            <form method="POST" action="?/pinPost" use:enhance>
                                <input type="hidden" name="id" value={post.id} />
                                <input type="hidden" name="isPinned" value={post.isPinned} />
                                <button type="submit"
                                    class="px-4 py-2 text-xs font-black rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                                    {post.isPinned ? '📌 Unpin' : '📌 Pin'}
                                </button>
                            </form>

                            <!-- Remove/Restore -->
                            {#if post.status === 'published'}
                                <form method="POST" action="?/removePost" use:enhance>
                                    <input type="hidden" name="id" value={post.id} />
                                    <button type="submit"
                                        class="px-4 py-2 text-xs font-black rounded-xl bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-600 hover:text-white transition-all">
                                        🚫 Remove
                                    </button>
                                </form>
                            {:else}
                                <form method="POST" action="?/restorePost" use:enhance>
                                    <input type="hidden" name="id" value={post.id} />
                                    <button type="submit"
                                        class="px-4 py-2 text-xs font-black rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all">
                                        ✓ Restore
                                    </button>
                                </form>
                            {/if}

                            <!-- Delete -->
                            <form method="POST" action="?/deletePost" use:enhance
                                onsubmit={(e) => {
                                    if (!confirm('Permanently delete this post?')) e.preventDefault();
                                }}
                            >
                                <input type="hidden" name="id" value={post.id} />
                                <button type="submit"
                                    class="px-4 py-2 text-xs font-black rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                    🗑 Delete
                                </button>
                            </form>

                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

</div>