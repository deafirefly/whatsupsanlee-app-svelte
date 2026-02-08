<script lang="ts">
    let { data } = $props();
</script>

<div class="max-w-4xl mx-auto py-10">
    <div class="bg-gradient-to-r from-yellow-400 to-yellow-600 p-8 rounded-2xl shadow-2xl text-white">
        <h1 class="text-4xl font-black uppercase tracking-tighter">VIP Lounge</h1>
        <p class="mt-2 text-yellow-100 font-medium text-lg">Exclusive access granted.</p>
    </div>

    <div class="mt-8 p-6 border-2 border-dashed border-yellow-300 rounded-xl bg-yellow-50/50">
        <h2 class="text-xl font-bold text-yellow-800">Special Content</h2>
        <p class="mt-4 text-gray-700 leading-relaxed">
            {data.secretContent}
        </p>
    </div>
    
    <a href="/dashboard" class="inline-block mt-6 text-indigo-600 font-semibold">← Back to Dashboard</a>
</div>