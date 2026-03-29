<script lang="ts">
    import { enhance } from '$app/forms';
    let { data, form } = $props();
    const { listing, photos, menu, schedule } = data;

    const categoryLabel = listing.category?.replace('_', ' ') || 'Community';

    function getCategoryEmoji(category: string) {
        switch (category) {
            case 'food_truck': return '🚚';
            case 'farmer': return '👨‍🌾';
            case 'photographer': return '📸';
            case 'artist': return '🎨';
            default: return '⭐';
        }
    }

    function formatTime(time: string | null) {
        if (!time) return '';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${ampm}`;
    }

    let menuByCategory = $derived(
        menu.reduce((grouped: Record<string, typeof menu>, item) => {
            const cat = item.category ?? 'Other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
            return grouped;
        }, {})
    );

    let activePhoto = $state(0);
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Back Nav -->
    <div class="bg-white border-b">
        <div class="max-w-5xl mx-auto px-6 py-4">
            <a href="/" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
                ← Back to Directory
            </a>
        </div>
    </div>

    <div class="max-w-5xl mx-auto p-6 mt-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- LEFT COLUMN -->
            <div class="lg:col-span-2 space-y-6">

                <!-- Hero Card -->
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

                    <!-- Cover Image -->
                    {#if listing.imageUrl}
                        <div class="w-full overflow-hidden">
                            <img src={listing.imageUrl} alt={listing.businessName} class="w-full h-auto" />
                        </div>
                    {:else}
                        <div class="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span class="text-6xl opacity-30">{getCategoryEmoji(listing.category)}</span>
                        </div>
                    {/if}

                    <div class="p-8">
                        <header class="mb-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                                    {categoryLabel}
                                </span>
                                <span class="h-1 w-1 rounded-full bg-slate-300"></span>
                                <span class="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                    <span class="relative flex h-2 w-2">
                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Verified Member
                                </span>
                                {#if listing.isFeatured}
                                    <span class="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase tracking-tighter border border-amber-100">
                                        ⭐ Featured
                                    </span>
                                {/if}
                            </div>

                            <h1 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none">
                                {listing.businessName}
                            </h1>
                            <p class="text-xl text-slate-500 mt-4 font-medium italic">
                                hosted by {listing.contactPerson}
                            </p>
                        </header>

                        {#if listing.bio}
                            <div class="space-y-4">
                                <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest">The Story</h3>
                                <p class="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
                                    {listing.bio}
                                </p>
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Photo Gallery -->
                {#if photos.length > 0}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                    <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Photos</h3>
                    <div class="aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4">
                        <img
                            src={photos[activePhoto].url}
                            alt={photos[activePhoto].altText ?? listing.businessName}
                            class="w-full h-full object-cover"
                        />
                    </div>
                    {#if photos.length > 1}
                        <div class="flex gap-2 overflow-x-auto pb-1">
                            {#each photos as photo, i}
                                <button
                                    onclick={() => activePhoto = i}
                                    class="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                                        {activePhoto === i ? 'border-indigo-600' : 'border-transparent opacity-60 hover:opacity-100'}"
                                >
                                    <img src={photo.url} alt={photo.altText ?? ''} class="w-full h-full object-cover" />
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>
                {/if}

                <!-- Menu -->
                {#if menu.length > 0}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                    <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Menu</h3>
                    {#each Object.entries(menuByCategory) as [category, items]}
                        <div class="mb-6 last:mb-0">
                            <h4 class="text-sm font-black text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block"></span>
                                {category}
                            </h4>
                            <div class="space-y-2">
                                {#each items as item}
                                    <div class="flex items-start justify-between gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                        <div class="flex-1">
                                            <p class="font-bold text-slate-900 text-sm">{item.name}</p>
                                            {#if item.description}
                                                <p class="text-xs text-slate-500 mt-0.5">{item.description}</p>
                                            {/if}
                                        </div>
                                        {#if item.price}
                                            <span class="font-black text-indigo-600 text-sm whitespace-nowrap">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
                {/if}

                <!-- Upcoming Locations -->
                {#if schedule.length > 0}
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                    <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Upcoming Locations</h3>
                    <div class="space-y-4">
                        {#each schedule as slot}
                            <div class="flex gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors">
                                <div class="flex-shrink-0 text-center bg-white rounded-xl p-3 shadow-sm min-w-[56px]">
                                    <p class="text-[10px] font-black text-indigo-600 uppercase">
                                        {new Date(slot.date).toLocaleDateString('en-US', { month: 'short' })}
                                    </p>
                                    <p class="text-2xl font-black text-slate-900 leading-none mt-0.5">
                                        {new Date(slot.date).getDate()}
                                    </p>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="font-black text-slate-900">{slot.locationName ?? 'Location TBD'}</p>
                                    {#if slot.address}
                                        <p class="text-xs text-slate-500 mt-0.5 truncate">{slot.address}</p>
                                    {/if}
                                    {#if slot.startTime}
                                        <p class="text-xs font-bold text-indigo-600 mt-1">
                                            {formatTime(slot.startTime)}
                                            {#if slot.endTime} – {formatTime(slot.endTime)}{/if}
                                        </p>
                                    {/if}
                                    {#if slot.notes}
                                        <p class="text-xs text-amber-600 mt-1 italic">⚠ {slot.notes}</p>
                                    {/if}
                                </div>
                                {#if slot.latitude && slot.longitude}
                                    <a
                                        href={`https://maps.google.com/?q=${slot.latitude},${slot.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex-shrink-0 self-center px-3 py-2 bg-white rounded-xl text-xs font-black text-indigo-600 border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"
                                    >
                                        📍 Map
                                    </a>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
                {/if}


                <!-- Booking Request Form -->
{#if data.vendorAvailability && data.vendorAvailability.length > 0}
<div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
    <h3 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">Book an Appointment</h3>
    <p class="text-xs text-slate-400 mb-6">
        Fill out the form below to request a booking. Payment arrangements are made directly with {listing.contactPerson}.
    </p>

    {#if form?.bookingSuccess}
        <div class="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <span class="text-4xl block mb-3">🎉</span>
            <h4 class="font-black text-emerald-800 text-lg">Booking Request Sent!</h4>
            <p class="text-emerald-600 text-sm mt-1">
                {listing.contactPerson} will get back to you soon to confirm your appointment.
            </p>
        </div>
    {:else}
        {#if form?.bookingMessage}
            <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
                <p class="text-red-700 font-bold text-sm">⚠ {form.bookingMessage}</p>
            </div>
        {/if}

        <!-- Available Days -->
        <div class="mb-4 p-4 bg-slate-50 rounded-2xl">
            <p class="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Available Days</p>
            <div class="flex flex-wrap gap-2">
                {#each data.vendorAvailability as slot}
                    <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black border border-indigo-100 capitalize">
                        {slot.dayOfWeek} · {slot.startTime} – {slot.endTime}
                    </span>
                {/each}
            </div>
        </div>

        <form method="POST" action="?/requestBooking" use:enhance class="space-y-4">
            <input type="hidden" name="listingId" value={listing.id} />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Your Name *</label>
                    <input name="clientName" required placeholder="John Smith"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Email *</label>
                    <input name="clientEmail" type="email" required placeholder="you@example.com"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Phone <span class="text-slate-400 font-normal">(optional)</span></label>
                    <input name="clientPhone" type="tel" placeholder="(910) 555-0123"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Service Type <span class="text-slate-400 font-normal">(optional)</span></label>
                    <input name="serviceType" placeholder="e.g. Portrait Session, Event Coverage"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Date *</label>
                    <input name="date" type="date" required
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">Start Time *</label>
                    <input name="startTime" type="time" required
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-1">End Time <span class="text-slate-400 font-normal">(optional)</span></label>
                    <input name="endTime" type="time"
                        class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
            </div>

            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Notes <span class="text-slate-400 font-normal">(optional)</span></label>
                <textarea name="notes" rows={3}
                    placeholder="Tell them about your project, special requests, location ideas..."
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm resize-none"
                ></textarea>
            </div>

            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p class="text-xs text-amber-700 font-bold">💡 Payment info: Payments are arranged directly with {listing.contactPerson} — not through this site.</p>
            </div>

            <button type="submit"
                class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-lg">
                Request Booking →
            </button>
        </form>
    {/if}
</div>
{/if}

            </div>

            <!-- RIGHT COLUMN -->
            <div class="space-y-6">

                <!-- Schedule & Location -->
                <div class="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                    <div class="absolute -right-4 -top-4 text-white/10 text-9xl font-black select-none">
                        {getCategoryEmoji(listing.category)}
                    </div>
                    <div class="relative z-10 space-y-8">
                        {#if listing.scheduleSummary}
                            <div>
                                <h4 class="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-3">When to find us</h4>
                                <p class="text-xl font-bold leading-snug">{listing.scheduleSummary}</p>
                            </div>
                        {/if}
                        {#if listing.address}
                            <div>
                                <h4 class="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-3">Where we're at</h4>
                                <p class="text-lg font-medium mb-4 leading-snug">{listing.address}</p>
                                {#if listing.locationPin}
                                    <a href={listing.locationPin} target="_blank" rel="noopener noreferrer"
                                        class="flex items-center justify-center gap-2 w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-lg">
                                        📍 GET DIRECTIONS
                                    </a>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Contact Info -->
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact</h4>
                    <div class="space-y-3">
                        {#if listing.phone}
                            <a href="tel:{listing.phone}" class="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                                <span class="text-lg">📞</span> {listing.phone}
                            </a>
                        {/if}
                        {#if listing.email}
                            <a href="mailto:{listing.email}" class="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors truncate">
                                <span class="text-lg">✉️</span> {listing.email}
                            </a>
                        {/if}
                        {#if listing.website}
                            <a href={listing.website} target="_blank" rel="noopener noreferrer"
                                class="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors truncate">
                                <span class="text-lg">🌐</span> {listing.website}
                            </a>
                        {/if}
                    </div>
                </div>

                <!-- Social Media -->
                {#if listing.instagram || listing.facebook || listing.twitter || listing.tiktok}
                <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                    <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Follow us</h4>
                    <div class="grid grid-cols-2 gap-4">
                        {#if listing.instagram}
                            <a href={`https://instagram.com/${listing.instagram}`} target="_blank" rel="noopener noreferrer"
                                class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-pink-50 hover:text-pink-600 transition-all group">
                                <span class="text-2xl group-hover:scale-110 transition-transform">📸</span>
                                <span class="text-[10px] font-black uppercase">Instagram</span>
                            </a>
                        {/if}
                        {#if listing.facebook}
                            <a href={listing.facebook} target="_blank" rel="noopener noreferrer"
                                class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-all group">
                                <span class="text-2xl group-hover:scale-110 transition-transform">👤</span>
                                <span class="text-[10px] font-black uppercase">Facebook</span>
                            </a>
                        {/if}
                        {#if listing.twitter}
                            <a href={listing.twitter} target="_blank" rel="noopener noreferrer"
                                class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-slate-200 transition-all group">
                                <span class="text-2xl group-hover:scale-110 transition-transform">🐦</span>
                                <span class="text-[10px] font-black uppercase">X / Twitter</span>
                            </a>
                        {/if}
                        {#if listing.tiktok}
                            <a href={listing.tiktok} target="_blank" rel="noopener noreferrer"
                                class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-slate-200 transition-all group">
                                <span class="text-2xl group-hover:scale-110 transition-transform">🎵</span>
                                <span class="text-[10px] font-black uppercase">TikTok</span>
                            </a>
                        {/if}
                    </div>
                </div>
                {/if}

            </div>
        </div>
    </div>

</div>