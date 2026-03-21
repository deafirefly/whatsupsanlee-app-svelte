<script lang="ts">
    import { enhance } from '$app/forms';

    let { data, form } = $props();

    let newAreaName = $state('');
    let editingId = $state<number | null>(null);
    let editingName = $state('');
    let isAdding = $state(false);

    function startEdit(area: { id: number; name: string }) {
        editingId = area.id;
        editingName = area.name;
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
            <h1 class="text-3xl font-black text-slate-900">Areas</h1>
            <p class="text-slate-500 mt-1">Manage Lee County areas. <a href="/communities" class="text-indigo-600 font-bold hover:underline">Manage Communities →</a></p>
        </div>
        <span class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-black border border-indigo-100">
            {data.areas.length} areas
        </span>
    </div>

    <!-- Error/Success Message -->
    {#if form?.message}
        <div class="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
        </div>
    {/if}

    <!-- Add New Area -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Add New Area</h3>
        <form
            method="POST"
            action="?/addArea"
            use:enhance={() => {
                isAdding = true;
                return async ({ update }) => {
                    await update();
                    isAdding = false;
                    newAreaName = '';
                };
            }}
            class="flex gap-3"
        >
            <input
                name="name"
                bind:value={newAreaName}
                placeholder="e.g. Tramway, Broadway, Sanford..."
                required
                class="flex-1 p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
            />
            <button
                type="submit"
                disabled={isAdding || !newAreaName.trim()}
                class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
                {isAdding ? 'Adding...' : '+ Add Area'}
            </button>
        </form>
    </div>

    <!-- Areas List -->
    {#if data.areas.length === 0}
        <div class="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <span class="text-4xl block mb-4">📍</span>
            <h3 class="text-xl font-bold text-slate-900">No areas yet</h3>
            <p class="text-slate-500 text-sm mt-1">Add your first Lee County area above.</p>
        </div>
    {:else}
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="divide-y divide-slate-100">
                {#each data.areas as area}
                    <div class="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">

                        {#if editingId === area.id}
                            <!-- Edit Mode -->
                            <form
                                method="POST"
                                action="?/editArea"
                                use:enhance={() => {
                                    return async ({ update }) => {
                                        await update();
                                        cancelEdit();
                                    };
                                }}
                                class="flex-1 flex gap-3"
                            >
                                <input type="hidden" name="id" value={area.id} />
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
                                <p class="font-black text-slate-900">{area.name}</p>
                                <p class="text-xs text-slate-400 mt-0.5">
                                    {area.communityCount} {area.communityCount === 1 ? 'community' : 'communities'}
                                </p>
                            </div>

                            <div class="flex gap-2">
                                <button
                                    onclick={() => startEdit(area)}
                                    class="px-3 py-1.5 text-xs font-black rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all">
                                    ✏️ Edit
                                </button>

                                <form method="POST" action="?/deleteArea" use:enhance
                                    onsubmit={(e) => {
                                        if (!confirm(`Delete "${area.name}"? This will also delete all its communities!`)) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <input type="hidden" name="id" value={area.id} />
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

</div>