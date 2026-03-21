<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    let { data } = $props();
    const { posts, allAreas, areaFilter, isLoggedIn, currentUserId } = data;

    // Local posts state for optimistic UI
    let localPosts = $state(posts);

    $effect(() => {
        localPosts = posts;
    });

    // Comments state
    let expandedComments = $state<Record<number, boolean>>({});
    let commentInputs = $state<Record<number, string>>({});
    let postComments = $state<Record<number, any[]>>({});
    let reportingPostId = $state<number | null>(null);
    let reportReason = $state('');

    function toggleComments(postId: number) {
        expandedComments[postId] = !expandedComments[postId];
        if (expandedComments[postId] && !postComments[postId]) {
            loadComments(postId);
        }
    }

    async function loadComments(postId: number) {
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (res.ok) {
            postComments[postId] = await res.json();
        }
    }

    function formatDate(date: Date | null) {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function getInitial(name: string | null, email: string) {
        return (name ?? email)[0].toUpperCase();
    }
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Header -->
    <div class="bg-white border-b sticky top-0 z-10">
        <div class="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a href="/" class="text-sm font-bold text-indigo-600 hover:text-indigo-700">← Home</a>
                <span class="text-slate-300">|</span>
                <h1 class="font-black text-slate-900">Community Feed</h1>
            </div>
            {#if isLoggedIn}
                <a href="/feed/create"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                    + Post
                </a>
            {:else}
                <a href="/login"
                    class="px-4 py-2 border border-indigo-200 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-50 transition-all">
                    Login to Post
                </a>
            {/if}
        </div>
    </div>

    <div class="max-w-2xl mx-auto px-6 py-6 space-y-6">

        <!-- Area Filter -->
<div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
    <span class="text-lg flex-shrink-0">📍</span>
    <select
        onchange={(e) => {
            const val = (e.target as HTMLSelectElement).value;
            window.location.href = val ? `/feed?area=${val}` : '/feed';
        }}
        class="flex-1 bg-transparent outline-none text-sm font-bold text-slate-700 cursor-pointer"
    >
        <option value="">🌍 All of Lee County</option>
        {#each allAreas as area}
            <option value={area.id} selected={areaFilter === area.id.toString()}>
                📍 {area.name}
            </option>
        {/each}
    </select>
</div>


        <!-- Posts -->
        {#if localPosts.length === 0}
            <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <span class="text-4xl block mb-4">📭</span>
                <h3 class="text-xl font-bold text-slate-900">No posts yet</h3>
                <p class="text-slate-500 text-sm mt-1">Be the first to post something!</p>
                {#if isLoggedIn}
                    <a href="/feed/create"
                        class="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                        + Create Post
                    </a>
                {/if}
            </div>
        {:else}
            {#each localPosts as post}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

                    <!-- Post Header -->
                    <div class="flex items-center justify-between p-5 pb-3">
                        <div class="flex items-center gap-3">
                            <!-- Avatar -->
                            {#if post.authorAvatar}
                                <img src={post.authorAvatar} alt="avatar"
                                    class="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                            {:else}
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm border-2 border-white shadow">
                                    {getInitial(post.authorName, post.authorEmail)}
                                </div>
                            {/if}
                            <div>
                                <p class="font-black text-slate-900 text-sm">
                                    {post.authorName ?? post.authorEmail.split('@')[0]}
                                </p>
                                <p class="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
                            </div>
                        </div>

                        <!-- Pin badge & Delete -->
                        <div class="flex items-center gap-2">
                            {#if post.isPinned}
                                <span class="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-100">
                                    📌 Pinned
                                </span>
                            {/if}
                            {#if isLoggedIn && (post.userId === currentUserId)}
                                <form method="POST" action="?/deletePost" use:enhance
                                    onsubmit={(e) => {
                                        if (!confirm('Delete this post?')) e.preventDefault();
                                    }}
                                >
                                    <input type="hidden" name="postId" value={post.id} />
                                    <button type="submit" class="text-slate-300 hover:text-red-500 transition-colors text-xs font-black">
                                        🗑
                                    </button>
                                </form>
                            {/if}
                        </div>
                    </div>

                    <!-- Post Content -->
                    <div class="px-5 pb-3">
                        {#if post.content}
                            <p class="text-slate-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        {/if}

                        {#if post.imageUrl}
                            <div class="mt-3 rounded-2xl overflow-hidden bg-slate-100">
                                <img src={post.imageUrl} alt="Post image" class="w-full object-cover max-h-96" />
                            </div>
                        {/if}

                        {#if post.linkUrl}
                            <a href={post.linkUrl} target="_blank" rel="noopener noreferrer"
                                class="mt-3 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                                <span class="text-xl flex-shrink-0">🔗</span>
                                <div class="min-w-0">
                                    {#if post.linkTitle}
                                        <p class="font-bold text-slate-900 text-sm truncate">{post.linkTitle}</p>
                                    {/if}
                                    <p class="text-xs text-indigo-600 truncate">{post.linkUrl}</p>
                                </div>
                            </a>
                        {/if}
                    </div>

                    <!-- Post Actions -->
                    <div class="px-5 py-3 border-t border-slate-100 flex items-center gap-4">

                        <!-- Like -->
                        <form method="POST" action="?/like" use:enhance={() => {
                            // Optimistic UI
                            localPosts = localPosts.map(p => {
                                if (p.id === post.id) {
                                    return {
                                        ...p,
                                        userLiked: !p.userLiked,
                                        likeCount: p.userLiked ? p.likeCount - 1 : p.likeCount + 1
                                    };
                                }
                                return p;
                            });
                            return async ({ update }) => { await update({ reset: false }); };
                        }}>
                            <input type="hidden" name="postId" value={post.id} />
                            <button
                                type="submit"
                                disabled={!isLoggedIn}
                                class="flex items-center gap-1.5 text-sm font-bold transition-colors
                                {post.userLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}
                                disabled:cursor-not-allowed"
                            >
                                {post.userLiked ? '❤️' : '🤍'} {post.likeCount}
                            </button>
                        </form>

                        <!-- Comment -->
                        <button
                            onclick={() => toggleComments(post.id)}
                            class="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            💬 {post.commentCount}
                        </button>

                        <!-- Share -->
                        <button
                            onclick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/feed#post-${post.id}`);
                                alert('Link copied!');
                            }}
                            class="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            🔗 Share
                        </button>

                        <!-- Report -->
                        {#if isLoggedIn && post.userId !== currentUserId}
                            <button
                                onclick={() => reportingPostId = post.id}
                                class="ml-auto flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-red-400 transition-colors"
                            >
                                🚩 Report
                            </button>
                        {/if}
                    </div>

                    <!-- Comments Section -->
                    {#if expandedComments[post.id]}
                        <div class="px-5 pb-5 space-y-3 border-t border-slate-100 pt-3">

                            <!-- Existing Comments -->
                            {#if postComments[post.id]}
                                {#each postComments[post.id] as comment}
                                    <div class="flex gap-3">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                                            {getInitial(comment.authorName, comment.authorEmail)}
                                        </div>
                                        <div class="flex-1 bg-slate-50 rounded-2xl px-4 py-2">
                                            <p class="font-black text-xs text-slate-900">{comment.authorName ?? comment.authorEmail.split('@')[0]}</p>
                                            <p class="text-sm text-slate-700 mt-0.5">{comment.content}</p>
                                        </div>
                                    </div>
                                {/each}
                            {:else}
                                <p class="text-xs text-slate-400 text-center">Loading comments...</p>
                            {/if}

                            <!-- Add Comment -->
                            {#if isLoggedIn}
                                <form method="POST" action="?/comment" use:enhance={() => {
                                    return async ({ update }) => {
                                        await update({ reset: false });
                                        commentInputs[post.id] = '';
                                        await loadComments(post.id);
                                    };
                                }} class="flex gap-2 mt-2">
                                    <input type="hidden" name="postId" value={post.id} />
                                    <input
                                        name="content"
                                        bind:value={commentInputs[post.id]}
                                        placeholder="Write a comment..."
                                        class="flex-1 p-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                                    />
                                    <button type="submit"
                                        disabled={!commentInputs[post.id]?.trim()}
                                        class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all disabled:opacity-50">
                                        Post
                                    </button>
                                </form>
                            {:else}
                                <p class="text-xs text-slate-400 text-center">
                                    <a href="/login" class="text-indigo-600 font-bold hover:underline">Log in</a> to comment
                                </p>
                            {/if}
                        </div>
                    {/if}

                </div>
            {/each}
        {/if}
    </div>
</div>

<!-- Report Modal -->
{#if reportingPostId}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
            <h3 class="font-black text-slate-900 text-lg mb-4">Report Post</h3>
            <form method="POST" action="?/report" use:enhance={() => {
                return async ({ update }) => {
                    await update();
                    reportingPostId = null;
                    reportReason = '';
                };
            }}>
                <input type="hidden" name="postId" value={reportingPostId} />
                <div class="space-y-3 mb-6">
                    {#each ['Spam', 'Inappropriate content', 'Misinformation', 'Harassment', 'Other'] as reason}
                        <label class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all">
                            <input type="radio" name="reason" value={reason} bind:group={reportReason} class="accent-indigo-600" />
                            <span class="text-sm font-bold text-slate-700">{reason}</span>
                        </label>
                    {/each}
                </div>
                <div class="flex gap-3">
                    <button type="button" onclick={() => reportingPostId = null}
                        class="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-50 transition-all">
                        Cancel
                    </button>
                    <button type="submit" disabled={!reportReason}
                        class="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-sm hover:bg-red-700 transition-all disabled:opacity-50">
                        Submit Report
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}