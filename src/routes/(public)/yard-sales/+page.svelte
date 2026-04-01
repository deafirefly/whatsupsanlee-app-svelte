<script lang="ts">
    let { data } = $props();

    function formatDate(dateStr: string) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }

    function formatTime(t: string) {
        const [h, m] = t.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
    }
</script>

<div class="max-w-4xl mx-auto p-6 pb-20">

    <!-- Header -->
    <div class="mb-10 text-center">
        <div class="text-5xl mb-3">🏷️</div>
        <h1 class="text-4xl font-black text-slate-900">Yard Sales</h1>
        <p class="text-slate-500 mt-2">Find treasures right in your neighborhood!</p>
        <a
            href="/yard-sales/create"
            class="mt-4 inline-block px-6 py-3 bg-indigo-600 text-white font-black rounded-full shadow-lg hover:scale-105 transition-all text-sm"
        >
            + Post Your Yard Sale
        </a>
    </div>

    <!-- Upcoming Sales -->
    <section class="mb-12">
        <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">
            Upcoming Sales ({data.upcoming.length})
        </h2>

        {#if data.upcoming.length === 0}
            <div class="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <span class="text-4xl block mb-3">🔍</span>
                <p class="font-bold text-slate-600">No upcoming yard sales yet.</p>
                <p class="text-slate-400 text-sm mt-1">Be the first to post one!</p>
            </div>
        {:else}
            <div class="space-y-4">
                {#each data.upcoming as sale}
                    <a href="/yard-sales/{sale.id}" class="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 block">
                        <div class="flex flex-col md:flex-row md:items-start gap-4">

                            <!-- Date badge -->
                            <div class="flex-shrink-0 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center min-w-[80px]">
                                <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                    {new Date(sale.saleDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                                </p>
                                <p class="text-3xl font-black text-indigo-600 leading-tight">
                                    {new Date(sale.saleDate + 'T00:00:00').getDate()}
                                </p>
                                <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                    {new Date(sale.saleDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                                </p>
                            </div>

                            <!-- Content -->
                            <div class="flex-1">
                                <div class="flex items-start justify-between gap-2 flex-wrap">
                                    <div>
                                        <h3 class="font-black text-slate-900 text-lg leading-tight">{sale.title}</h3>
                                        <p class="text-sm text-slate-500 mt-0.5">by {sale.contactName}</p>
                                    </div>
                                    {#if sale.isFeatured}
                                        <span class="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest">✨ Featured</span>
                                    {/if}
                                </div>

                                <!-- Time & Location -->
                                <div class="mt-3 space-y-1.5">
                                    <div class="flex items-center gap-2 text-sm text-slate-600">
                                        <span>🕐</span>
                                        <span class="font-bold">{formatTime(sale.startTime)} – {formatTime(sale.endTime)}</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-sm text-slate-600">
                                        <span>📍</span>
                                        <span>{sale.address}</span>
                                        {#if sale.locationPin}
                                            <a href={sale.locationPin} target="_blank" rel="noopener noreferrer"
                                                class="text-indigo-500 font-bold text-xs hover:underline">Map →</a>
                                        {/if}
                                    </div>
                                    {#if sale.phone}
                                        <div class="flex items-center gap-2 text-sm text-slate-600">
                                            <span>📞</span>
                                            <a href="tel:{sale.phone}" class="hover:text-indigo-600 transition-colors">{sale.phone}</a>
                                        </div>
                                    {/if}
                                </div>

                                {#if sale.description}
                                    <p class="mt-3 text-sm text-slate-500 leading-relaxed">{sale.description}</p>
                                {/if}

                                <!-- Items -->
                                {#if sale.items?.length > 0}
                                    <div class="mt-3 flex flex-wrap gap-1.5">
                                        {#each sale.items as item}
                                            <span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                                                {item}
                                            </span>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </section>

    <!-- Past Sales -->
    {#if data.past.length > 0}
        <section>
            <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Past Sales
            </h2>
            <div class="space-y-3 opacity-60">
                {#each data.past as sale}
                    <a href="/yard-sales/{sale.id}" class="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:bg-slate-50 transition-all">
                        <div class="text-2xl">🏷️</div>
                        <div class="flex-1">
                            <p class="font-black text-slate-600">{sale.title}</p>
                            <p class="text-xs text-slate-400">{formatDate(sale.saleDate)} · {sale.address}</p>
                        </div>
                    </a>
                {/each}
            </div>
        </section>
    {/if}

</div>