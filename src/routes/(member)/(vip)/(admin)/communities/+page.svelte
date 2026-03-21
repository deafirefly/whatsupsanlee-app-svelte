<script lang="ts">
    import { enhance } from '$app/forms';

    let { data, form } = $props();

    let selectedAreaId = $state('');
    let newCommunityName = $state('');
    let editingId = $state<number | null>(null);
    let editingName = $state('');
    let isAdding = $state(false);

    function startEdit(community: { id: number; name: string }) {
        editingId = community.id;
        editingName = community.name;
    }

    function cancelEdit() {
        editingId = null;
        editingName = '';
    }
</script>

<div class="max-w-3xl mx-auto p-6 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-black text-slate-900">Communities</h1>
            <p class="text-slate-500 mt-1">Manage neighborhoods per area. <a href="/areas" class="text-indigo-600 font-bold hover:underline">Manage Areas →</a></p>
        </div>
        <span class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-black border border-indigo-100">
            {data.communitiesByArea.reduce((sum, a) => sum + a.communities.length, 0)} communities
        </span>
    </div>

    <!-- Error Message -->
    {#if form?.message}
        <div class="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
        </div>
    {/if}

    <!-- Add New Community -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Add New Community</h3>

        {#if data.allAreas.length === 0}
            <div class="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <p class="text-sm text-amber-700 font-bold">⚠ No areas yet. <a href="/areas" class="underline">Add areas first →</a></p>
            </div>
        {:else}
            <form
                method="POST"
                action="?/addCommunity"
                use:enhance={() => {
                    isAdding = true;
                    return async ({ update }) => {
                        await update();
                        isAdding = false;
                        newCommunityName = '';
                    };
                }}
                class="space-y-3"
            >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Area</label>
                        <select
                            name="areaId"
                            bind:value={selectedAreaId}
                            required
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none bg-white text-sm"
                        >
                            <option value="">Select an area...</option>
                            {#each data.allAreas as area}
                                <option value={area.id}>{area.name}</option>
                            {/each}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1">Community Name</label>
                        <input
                            name="name"
                            bind:value={newCommunityName}
                            placeholder="e.g. Reserve at Carthage Colonies"
                            required
                            class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isAdding || !newCommunityName.trim() || !selectedAreaId}
                    class="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                    {isAdding ? 'Adding...' : '+ Add Community'}
                </button>
            </form>
        {/if}
    </div>

    <!-- Communities grouped by Area -->
    {#if data.communitiesByArea.length === 0}
        <div class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <span class="text-4xl block mb-4">🏘</span>
            <h3 class="text-xl font-bold text-slate-900">No communities yet</h3>
            <p class="text-slate-500 text-sm mt-1">Add areas first, then add communities.</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each data.communitiesByArea as area}
                {#if area.communities.length > 0}
                    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <!-- Area Header -->
                        <div class="px-6 py-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="text-lg">📍</span>
                                <h3 class="font-black text-indigo-900">{area.name}</h3>
                            </div>
                            <span class="text-xs font-black text-indigo-400 uppercase tracking-widest">
                                {area.communities.length} {area.communities.length === 1 ? 'community' : 'communities'}
                            </span>
                        </div>

                        <!-- Communities List -->
                        <div class="divide-y divide-slate-100">
                            {#each area.communities as community}
                                <div class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">

                                    {#if editingId === community.id}
                                        <!-- Edit Mode -->
                                        <form
                                            method="POST"
                                            action="?/editCommunity"
                                            use:enhance={() => {
                                                return async ({ update }) => {
                                                    await update();
                                                    cancelEdit();
                                                };
                                            }}
                                            class="flex-1 flex gap-3"
                                        >
                                            <input type="hidden" name="id" value={community.id} />
                                            <input
                                                name="name"
                                                bind:value={editingName}
                                                required
                                                class="flex-1 p-2 rounded-xl border border-indigo-300 focus:border-indigo-600 outline-none text-sm"
                                            />
                                            <button type="submit"
                                                class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all">
                                                Save
                                            </button>
                                            <button type="button" onclick={cancelEdit}
                                                class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all">
                                                Cancel
                                            </button>
                                        </form>
                                    {:else}
                                        <!-- View Mode -->
                                        <div class="flex-1">
                                            <p class="font-bold text-slate-900 text-sm">{community.name}</p>
                                        </div>
                                        <div class="flex gap-2">
                                            <button
                                                onclick={() => startEdit(community)}
                                                class="px-3 py-1.5 text-xs font-black rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all">
                                                ✏️ Edit
                                            </button>
                                            <form method="POST" action="?/deleteCommunity" use:enhance
                                                onsubmit={(e) => {
                                                    if (!confirm(`Delete "${community.name}"?`)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                <input type="hidden" name="id" value={community.id} />
                                                <button type="submit"
                                                    class="px-3 py-1.5 text-xs font-black rounded-xl bg-red-50 text-red-500 border border-red-200 hover:bg-red-600 hover:text-white transition-all">
                                                    🗑 Delete
                                                </button>
                                            </form>
                                        </div>
                                    {/if}

                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    {/if}

</div>