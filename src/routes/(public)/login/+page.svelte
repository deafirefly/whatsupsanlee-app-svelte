<script lang="ts">
    let { form } = $props(); // Access error messages from the server
</script>

<div class="max-w-md mx-auto mt-20 p-8 border rounded-xl shadow-lg bg-white">
    <h1 class="text-2xl font-bold mb-6">Login</h1>

    <form method="POST" class="space-y-4">
        <div>
            <label class="block text-sm font-medium mb-1">Email Address</label>
            <input name="email" type="email" required class="w-full p-2 border rounded" />
        </div>
        
        {#if form?.message}
            <p class="text-red-500 text-sm">{form.message}</p>
        {/if}

        <button type="submit" class="w-full bg-indigo-600 text-white p-2 rounded font-bold">
            Sign In
        </button>
    </form>
</div>