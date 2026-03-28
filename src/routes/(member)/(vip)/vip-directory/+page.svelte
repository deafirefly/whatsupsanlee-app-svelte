<script lang="ts">
    let { data } = $props();
    let searchQuery = $state('');

    let filtered = $derived(
        data.vipMembers.filter(m =>
            m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.areaName?.toLowerCase().includes(searchQuery.toLowerCase()) || false
        )
    );
</script>

<div class="max-w-4xl mx-auto p-6 pb-20 space-y-6">

    <!-- Header -->
    <div class="text-center space-y-2">
        <div class="inline-block px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-200">
            ⭐ VIP Members Only
        </div>
        <h1 class="text-3xl font-black text-slate-900">VIP Member Directory</h1>
        <p class="text-slate-500">Connect with other VIP members of the WhatsUp SanLee community!</p>
    </div>

    <!-- Search -->
    <div class="relative">
        <span class="absolute left-4 top-3.5 text-slate-400">🔍</span>
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search VIP members..."
            class="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-400 outline-none text-sm bg-white"
        />
    </div>

    <!-- Members Grid -->
    {#if filtered.length === 0}
        <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <span class="text-4xl block mb-4">⭐</span>
            <h3 class="text-xl font-bold text-slate-900">No VIP members found</h3>
            <p class="text-slate-500 text-sm mt-1">Try a different search term</p>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each filtered as member}
                <a href={`/profile/${member.id}`}
                    class="bg-white rounded-3xl border border-amber-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all p-5 flex items-center gap-4 group">

                    <!-- Avatar -->
                    {#if member.avatarUrl}
                        <img src={member.avatarUrl} alt={member.displayName}
                            class="w-14 h-14 rounded-full object-cover border-2 border-amber-200 flex-shrink-0" />
                    {:else}
                        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white text-xl font-black border-2 border-amber-200 flex-shrink-0">
                            {member.displayName[0].toUpperCase()}
                        </div>
                    {/if}

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                            <p class="font-black text-slate-900 truncate">{member.displayName}</p>
                            <span class="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full border border-amber-200 flex-shrink-0">
                                ⭐ VIP
                            </span>
                        </div>
                        {#if member.bio}
                            <p class="text-xs text-slate-500 mt-1 line-clamp-1">{member.bio}</p>
                        {/if}
                        {#if member.areaName}
                            <p class="text-xs text-slate-400 mt-1">📍 {member.communityName ?? member.areaName}, Lee County</p>
                        {/if}
                    </div>

                    <span class="text-slate-300 group-hover:text-amber-400 transition-colors font-black">→</span>
                </a>
            {/each}
        </div>
    {/if}

    <!-- Count -->
    <p class="text-center text-xs text-slate-400">
        {filtered.length} VIP {filtered.length === 1 ? 'member' : 'members'} in the directory
    </p>
</div>