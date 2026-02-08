<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 class="text-3xl font-extrabold text-center text-gray-900 mb-2">Create Account</h2>
        <p class="text-center text-gray-500 mb-8">Join the VIP Lounge today</p>

        {#if form?.message}
            <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
                {form.message}
            </div>
        {/if}

        <form method="POST" use:enhance class="space-y-6">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" required 
                    class="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" required 
                    class="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
            </div>

            <button type="submit" 
                class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-transform">
                Register
            </button>
        </form>

        <div class="mt-6 text-center">
            <a href="/login" class="text-sm text-indigo-600 hover:underline">Already have an account? Log in</a>
        </div>
    </div>
</div>