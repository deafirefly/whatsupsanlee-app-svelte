<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let unread = $derived(data.allMessages.filter(m => m.status === 'unread'));
    let read = $derived(data.allMessages.filter(m => m.status === 'read'));

    let activeTab = $state<'unread' | 'read' | 'all'>('unread');

    let filtered = $derived(
        activeTab === 'all'
            ? data.allMessages
            : data.allMessages.filter(m => m.status === activeTab)
    );

    function formatDate(date: Date | null) {
        if (!date) return '—';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit'
        });
    }

    let expandedId = $state<number | null>(null);

    function toggleExpand(id: number) {
        expandedId = expandedId === id ? null : id;
    }
</script>

<div class="max-w-4xl mx-auto p-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-black text-slate-900">Contact Messages</h1>
            <p class="text-slate-500 mt-1">Messages submitted via the contact form.</p>
        </div>
        {#if unread.length > 0}
            <span class="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-black border border-red-200">
                {unread.length} unread
            </span>
        {/if}
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p class="text-xs font-black text-red-500 uppercase tracking-widest mb-1">Unread</p>
            <p class="text-3xl font-black text-red-700">{unread.length}</p>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <p class="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Read</p>
            <p class="text-3xl font-black text-emerald-700">{read.length}</p>
        </div>
        <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p class="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Total</p>
            <p class="text-3xl font-black text-slate-700">{data.allMessages.length}</p>
        </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {#each ['unread', 'read', 'all'] as tab}
            <button
                onclick={() => activeTab = tab as typeof activeTab}
                class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all
                {activeTab === tab
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'}"
            >
                {tab}
                {#if tab === 'unread' && unread.length > 0}
                    <span class="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px]">
                        {unread.length}
                    </span>
                {/if}
            </button>
        {/each}
    </div>

    <!-- Messages List -->
    {#if filtered.length === 0}
        <div class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <span class="text-4xl block mb-4">📭</span>
            <h3 class="text-xl font-bold text-slate-900">No {activeTab} messages</h3>
            <p class="text-slate-500 text-sm mt-1">Nothing here right now.</p>
        </div>
    {:else}
        <div class="space-y-3">
            {#each filtered as msg}
                <div class="bg-white rounded-3xl border {msg.status === 'unread' ? 'border-indigo-200 shadow-md' : 'border-slate-200 shadow-sm'} overflow-hidden transition-all">

                    <!-- Message Header -->
                    <button
                        onclick={() => toggleExpand(msg.id)}
                        class="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                    >
                        <div class="flex items-center gap-4">
                            <!-- Avatar -->
                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                                {msg.name[0].toUpperCase()}
                            </div>
                            <div class="text-left">
                                <div class="flex items-center gap-2">
                                    <p class="font-black text-slate-900">{msg.name}</p>
                                    {#if msg.status === 'unread'}
                                        <span class="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
                                    {/if}
                                </div>
                                <p class="text-xs text-slate-400">{msg.email} · {formatDate(msg.createdAt)}</p>
                            </div>
                        </div>
                        <span class="text-slate-400 font-black text-lg transition-transform {expandedId === msg.id ? 'rotate-45' : ''}">
                            +
                        </span>
                    </button>

                    <!-- Message Body -->
                    {#if expandedId === msg.id}
                        <div class="px-6 pb-6 space-y-4">
                            <div class="p-4 bg-slate-50 rounded-2xl">
                                <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            </div>

                            <div class="flex gap-3">
                                <a href={`mailto:${msg.email}`}
                                    class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
                                    ✉️ Reply via Email
                                </a>

                                {#if msg.status === 'unread'}
                                    <form method="POST" action="?/markRead" use:enhance>
                                        <input type="hidden" name="id" value={msg.id} />
                                        <button type="submit"
                                            class="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all">
                                            ✓ Mark as Read
                                        </button>
                                    </form>
                                {/if}

                                <form method="POST" action="?/delete" use:enhance
                                    onsubmit={(e) => {
                                        if (!confirm('Delete this message?')) e.preventDefault();
                                    }}
                                >
                                    <input type="hidden" name="id" value={msg.id} />
                                    <button type="submit"
                                        class="px-4 py-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                        🗑 Delete
                                    </button>
                                </form>
                            </div>
                        </div>
                    {/if}

                </div>
            {/each}
        </div>
    {/if}

</div>