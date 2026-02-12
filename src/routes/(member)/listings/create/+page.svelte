<script lang="ts">
    import { enhance } from '$app/forms';

    let category = $state('food_truck');
    let scheduleType = $state('weekly'); // 'weekly' or 'event'

    let selectedDays = $state(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    let startTime = $state('09:00');
    let endTime = $state('17:00');

    let specificDates = $state('');

    let scheduleSummary = $derived(
        scheduleType === 'weekly' 
            ? `${selectedDays.join(', ')} | ${startTime}-${endTime}`
            : specificDates
    );
</script>

<div class="max-w-3xl mx-auto p-6">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-indigo-600">Create Community Listing</h1>
        <p class="text-muted-foreground">Share your business or craft with the neighborhood.</p>
    </div>

    <form method="POST" use:enhance class="space-y-8 bg-card border rounded-xl p-8 shadow-sm">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            {#each ['food_truck', 'farmer', 'photographer', 'artist'] as cat}
                <button 
                    type="button"
                    onclick={() => category = cat}
                    class="p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all duration-200 w-full 
                    {category === cat 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'}"
                >
                    <span class="text-2xl transition-transform {category === cat ? 'scale-110' : 'scale-100'}">
                        {#if cat === 'food_truck'}🚚{:else if cat === 'farmer'}👨‍🌾{:else if cat === 'photographer'}📸{:else}🎨{/if}
                    </span>
                    <span class="text-xs font-bold capitalize">{cat.replace('_', ' ')}</span>
                </button>
            {/each}
            <input type="hidden" name="category" value={category} />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            <section class="space-y-4">
                <div class="flex justify-between items-center border-b pb-2">
                <h3 class="font-semibold text-indigo-600 border-b pb-2">Operating Schedule</h3>
                

                <div class="flex bg-slate-100 p-1 rounded-lg">
            <button 
                type="button" 
                onclick={() => scheduleType = 'weekly'}
                class="px-3 py-1 text-[10px] font-bold rounded-md transition-all 
                {scheduleType === 'weekly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}">
                WEEKLY
            </button>
            <button 
                type="button" 
                onclick={() => scheduleType = 'event'}
                class="px-3 py-1 text-[10px] font-bold rounded-md transition-all 
                {scheduleType === 'event' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}">
                DATES/EVENTS
            </button>
        </div>
        </div>


       {#if scheduleType === 'weekly'}
        <div class="space-y-4 animate-in fade-in duration-300">
            <p class="text-[11px] text-muted-foreground italic">When can the community find you?</p>
            <div class="flex flex-wrap gap-2">
                {#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as day}
                    <button 
                        type="button"
                        onclick={() => {
                            if (selectedDays.includes(day)) {
                                selectedDays = selectedDays.filter(d => d !== day);
                            } else {
                                selectedDays = [...selectedDays, day];
                            }
                        }}
                        class="w-10 h-10 rounded-full border-2 font-bold text-[10px] transition-all
                        {selectedDays.includes(day) 
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-md' 
                            : 'border-slate-200 bg-white text-slate-400 hover:border-indigo-300'}">
                        {day}
                    </button>
                {/each}
            </div>
            <div class="grid grid-cols-2 gap-4">
                <input type="time" bind:value={startTime} class="w-full p-2 border rounded-md text-sm" />
                <input type="time" bind:value={endTime} class="w-full p-2 border rounded-md text-sm" />
            </div>
        </div>
    {:else}
        <div class="space-y-2 animate-in fade-in duration-300">
            <label class="block text-sm font-medium">Event Dates or Seasonal Info</label>
            <textarea 
                bind:value={specificDates}
                placeholder="e.g. 'Opening Gala: Feb 20th, 6pm-9pm' or 'Every first Saturday at the Art Walk'" 
                class="w-full p-3 border rounded-md text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
            <p class="text-[10px] text-muted-foreground">Best for pop-up galleries, workshops, or seasonal markets.</p>
        </div>
    {/if} 








                <input type="hidden" name="scheduleSummary" value={scheduleSummary} />
            </section>

            <div class="space-y-8">
                <section class="space-y-4">
                    <h3 class="font-semibold text-indigo-600 border-b pb-2">Basic Info</h3>
                    <div>
                        <label class="block text-sm font-medium mb-1">Business Name</label>
                        <input name="businessName" required class="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Contact Person</label>
                        <input name="contactPerson" required class="w-full p-2 border rounded-md" />
                    </div>
                </section>

                <section class="space-y-4 pt-4">
    <h3 class="font-semibold text-indigo-600 border-b pb-2">Location</h3>
    <div>
        <label class="block text-sm font-medium mb-1">Physical Address / Area</label>
        <input 
            name="address" 
            placeholder="e.g. 123 Main St or 'Downtown Area'" 
            required 
            class="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
        />
    </div>
    <div>
        <label class="block text-sm font-medium mb-1">Google Maps Pin (Optional)</label>
        <div class="relative">
            <input 
                name="locationPin" 
                placeholder="Paste Google Maps link here" 
                class="w-full p-2 border rounded-md text-sm pl-8 focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
            <span class="absolute left-2 top-2.5 text-slate-400">📍</span>
        </div>
        <p class="text-[10px] text-muted-foreground mt-1">
            Tip: Drop a pin in Google Maps and click "Share" to get the link.
        </p>
    </div>
</section>

                <section class="space-y-4">
                    <h3 class="font-semibold text-indigo-600 border-b pb-2">Social Presence</h3>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-sm">@</span>
                        <input name="instagram" placeholder="Instagram" class="w-full p-2 border rounded-md text-sm" />
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400 text-sm italic">fb.com/</span>
                        <input name="facebook" placeholder="Facebook Page" class="w-full p-2 border rounded-md text-sm" />
                    </div>
                </section>
            </div>
        </div>

        <button type="submit" class="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">
            Submit for Approval
        </button>
    </form>
</div>