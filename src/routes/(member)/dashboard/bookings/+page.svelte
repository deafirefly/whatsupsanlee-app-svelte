<script lang="ts">
    import { enhance } from '$app/forms';

    let { data } = $props();

    let pending = $derived(data.bookings.filter(b => b.status === 'pending'));
    let confirmed = $derived(data.bookings.filter(b => b.status === 'confirmed'));
    let declined = $derived(data.bookings.filter(b => b.status === 'declined'));

    let activeTab = $state<'pending' | 'confirmed' | 'declined' | 'all'>('pending');

    let filtered = $derived(
        activeTab === 'all' ? data.bookings :
        data.bookings.filter(b => b.status === activeTab)
    );


    let respondingId = $state<number | null>(null);
let vendorNotes = $state('');
let editingId = $state<number | null>(null);

    function formatDate(date: string) {
        return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
        });
    }

    function formatTime(time: string | null) {
        if (!time) return '';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
    }

    function formatCreated(date: Date | null) {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
        });
    }
</script>

<div class="max-w-4xl mx-auto p-6 pb-20 space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <a href="/dashboard" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-2">
                ← Back to Dashboard
            </a>
            <h1 class="text-3xl font-black text-slate-900">Bookings</h1>
            <p class="text-slate-500 mt-1">Manage booking requests for {data.listing.businessName}.</p>
        </div>
        <a href="/dashboard/availability"
            class="px-4 py-2 border border-indigo-200 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-50 transition-all">
            ⚙️ Set Availability
        </a>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p class="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Pending</p>
            <p class="text-3xl font-black text-amber-700">{pending.length}</p>
        </div>
        <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <p class="text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">Confirmed</p>
            <p class="text-3xl font-black text-emerald-700">{confirmed.length}</p>
        </div>
        <div class="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p class="text-xs font-black text-red-400 uppercase tracking-widest mb-1">Declined</p>
            <p class="text-3xl font-black text-red-700">{declined.length}</p>
        </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        {#each ['pending', 'confirmed', 'declined', 'all'] as tab}
            <button
                onclick={() => activeTab = tab as typeof activeTab}
                class="px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all
                {activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}"
            >
                {tab}
                {#if tab === 'pending' && pending.length > 0}
                    <span class="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[10px]">
                        {pending.length}
                    </span>
                {/if}
            </button>
        {/each}
    </div>

    <!-- Bookings List -->
    {#if filtered.length === 0}
        <div class="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <span class="text-4xl block mb-4">📅</span>
            <h3 class="text-xl font-bold text-slate-900">No {activeTab} bookings</h3>
            <p class="text-slate-500 text-sm mt-1">
                {activeTab === 'pending' ? 'No new booking requests yet.' : 'Nothing here right now.'}
            </p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each filtered as booking}
                <div class="bg-white rounded-3xl border {booking.status === 'pending' ? 'border-amber-200' : 'border-slate-200'} shadow-sm p-6">

                    <!-- Booking Header -->
                    <div class="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h3 class="font-black text-slate-900 text-lg">{booking.clientName}</h3>
                                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase
                                    {booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                     booking.status === 'declined' ? 'bg-red-50 text-red-500 border border-red-200' :
                                     'bg-amber-50 text-amber-600 border border-amber-200'}">
                                    {booking.status}
                                </span>
                            </div>
                            <p class="text-xs text-slate-400">Requested {formatCreated(booking.createdAt)}</p>
                        </div>
                    </div>

                    <!-- Booking Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div class="bg-slate-50 rounded-2xl p-4 space-y-2">
                            <div class="flex items-center gap-2 text-sm">
                                <span>📅</span>
                                <span class="font-bold text-slate-700">{formatDate(booking.date)}</span>
                            </div>
                            {#if booking.startTime}
                                <div class="flex items-center gap-2 text-sm">
                                    <span>🕐</span>
                                    <span class="font-bold text-indigo-600">
                                        {formatTime(booking.startTime)}
                                        {#if booking.endTime} – {formatTime(booking.endTime)}{/if}
                                    </span>
                                </div>
                            {/if}
                            {#if booking.serviceType}
                                <div class="flex items-center gap-2 text-sm">
                                    <span>📸</span>
                                    <span class="font-bold text-slate-700">{booking.serviceType}</span>
                                </div>
                            {/if}
                        </div>

                        <div class="bg-slate-50 rounded-2xl p-4 space-y-2">
                            <div class="flex items-center gap-2 text-sm">
                                <span>✉️</span>
                                <a href={`mailto:${booking.clientEmail}`}
                                    class="font-bold text-indigo-600 hover:underline truncate">
                                    {booking.clientEmail}
                                </a>
                            </div>
                            {#if booking.clientPhone}
                                <div class="flex items-center gap-2 text-sm">
                                    <span>📞</span>
                                    <a href={`tel:${booking.clientPhone}`}
                                        class="font-bold text-indigo-600 hover:underline">
                                        {booking.clientPhone}
                                    </a>
                                </div>
                            {/if}
                        </div>
                    </div>

                    {#if booking.notes}
                        <div class="bg-indigo-50 rounded-2xl p-4 mb-4">
                            <p class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Client Notes</p>
                            <p class="text-sm text-slate-700">{booking.notes}</p>
                        </div>
                    {/if}

                    {#if booking.vendorNotes}
                        <div class="bg-emerald-50 rounded-2xl p-4 mb-4">
                            <p class="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Your Response</p>
                            <p class="text-sm text-slate-700">{booking.vendorNotes}</p>
                        </div>
                    {/if}

                    <!-- Actions for pending bookings -->
                    {#if booking.status === 'pending'}
    {#if editingId === booking.id}
        <!-- Edit Form -->
        <form method="POST" action="?/edit" use:enhance={() => {
            return async ({ update }) => {
                await update();
                editingId = null;
            };
        }} class="space-y-3 mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p class="text-xs font-black text-slate-500 uppercase tracking-widest">Edit Booking</p>
            <input type="hidden" name="id" value={booking.id} />

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">Client Name</label>
                    <input name="clientName" value={booking.clientName}
                        class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">Email</label>
                    <input name="clientEmail" type="email" value={booking.clientEmail}
                        class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">Phone</label>
                    <input name="clientPhone" value={booking.clientPhone ?? ''}
                        class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">Service Type</label>
                    <input name="serviceType" value={booking.serviceType ?? ''}
                        class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">Date</label>
                    <input name="date" type="date" value={booking.date}
                        class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">Start Time</label>
                    <input name="startTime" type="time" value={booking.startTime}
                        class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-600 mb-1">End Time</label>
                    <input name="endTime" type="time" value={booking.endTime ?? ''}
                        class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Client Notes</label>
                <textarea name="notes" rows={2}
                    class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm resize-none"
                >{booking.notes ?? ''}</textarea>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Your Response Notes</label>
                <textarea name="vendorNotes" rows={2}
                    class="w-full p-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm resize-none"
                >{booking.vendorNotes ?? ''}</textarea>
            </div>

            <div class="flex gap-3">
                <button type="submit"
                    class="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                    💾 Save Changes
                </button>
                <button type="button" onclick={() => editingId = null}
                    class="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-200 transition-all">
                    Cancel
                </button>
            </div>
        </form>
    {:else if respondingId === booking.id}

                            <div class="space-y-3 mt-4">
                                <textarea
                                    bind:value={vendorNotes}
                                    placeholder="Add a message to the client (optional)..."
                                    rows={2}
                                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm resize-none"
                                ></textarea>
                                <div class="flex gap-3">
                                    <form method="POST" action="?/confirm" use:enhance class="flex-1">
                                        <input type="hidden" name="id" value={booking.id} />
                                        <input type="hidden" name="vendorNotes" value={vendorNotes} />
                                        <button type="submit"
                                            class="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-sm hover:bg-emerald-700 transition-all">
                                            ✓ Confirm Booking
                                        </button>
                                    </form>
                                    <form method="POST" action="?/decline" use:enhance class="flex-1">
                                        <input type="hidden" name="id" value={booking.id} />
                                        <input type="hidden" name="vendorNotes" value={vendorNotes} />
                                        <button type="submit"
                                            class="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-black text-sm hover:bg-red-600 hover:text-white transition-all">
                                            ✕ Decline
                                        </button>
                                    </form>
                                    <button
                                        type="button"
                                        onclick={() => { respondingId = null; vendorNotes = ''; }}
                                        class="px-4 py-3 bg-slate-50 text-slate-500 rounded-xl font-black text-sm hover:bg-slate-100 transition-all">
                                        Cancel
                                    </button>
                                </div>
                            </div>

                        {:else}
                            <div class="flex gap-3 mt-2">
                                <button
                                    onclick={() => respondingId = booking.id}
                                    class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all">
                                    Respond →
                                </button>
                                <button
                                    onclick={() => editingId = booking.id}
                                    class="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-black text-sm hover:bg-slate-200 transition-all">
                                    ✏️ Edit
                                </button>
                            </div>
                        {/if}



                    {:else}
                        <form method="POST" action="?/delete" use:enhance
                            onsubmit={(e) => {
                                if (!confirm('Delete this booking?')) e.preventDefault();
                            }}
                            class="mt-2"
                        >
                            <input type="hidden" name="id" value={booking.id} />
                            <button type="submit"
                                class="px-4 py-2 text-xs font-black rounded-xl bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                                🗑 Delete
                            </button>
                        </form>
                    {/if}

                </div>
            {/each}
        </div>
    {/if}

</div>