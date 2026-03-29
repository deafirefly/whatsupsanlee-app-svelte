<script lang="ts">
    import { enhance } from '$app/forms';

    let { data, form } = $props();
    let isSaving = $state(false);
    let showSuccess = $state(false);

    function showToast() {
        showSuccess = true;
        setTimeout(() => showSuccess = false, 3000);
    }
</script>

<div class="space-y-6 max-w-3xl">

    <div>
        <h1 class="text-3xl font-bold tracking-tight">System Settings</h1>
        <p class="text-muted-foreground">Manage global settings for WhatsUp SanLee.</p>
    </div>

    <!-- Success Toast -->
    {#if showSuccess}
        <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span>✅</span>
                <p class="text-emerald-800 font-bold text-sm">Settings saved successfully!</p>
            </div>
            <button onclick={() => showSuccess = false} class="text-emerald-400 hover:text-emerald-600">✕</button>
        </div>
    {/if}

    <!-- Error -->
    {#if form?.message}
        <div class="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
        </div>
    {/if}

    <form
        method="POST"
        action="?/saveSettings"
        use:enhance={() => {
            isSaving = true;
            return async ({ update }) => {
                await update({ reset: false });
                isSaving = false;
                showToast();
            };
        }}
        class="space-y-6"
    >

        <!-- Site Identity -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 class="font-black text-slate-900 flex items-center gap-2">
                🌐 Site Identity
            </h3>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Site Name</label>
                <input
                    name="siteName"
                    value={data.settings.siteName}
                    placeholder="WhatsUp SanLee"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm"
                />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Site Description</label>
                <textarea
                    name="siteDescription"
                    rows={2}
                    placeholder="Your local community platform..."
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm resize-none"
                >{data.settings.siteDescription}</textarea>
            </div>
        </div>

        <!-- Feature Toggles -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 class="font-black text-slate-900 flex items-center gap-2">
                ⚙️ Feature Toggles
            </h3>

            <!-- Maintenance Mode -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                    <p class="font-black text-slate-900 text-sm">🚧 Maintenance Mode</p>
                    <p class="text-xs text-slate-500 mt-0.5">Show a maintenance page to all visitors</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={data.settings.maintenanceMode === 'true'}
                        class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-red-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
            </div>

            <!-- Beta Mode -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                    <p class="font-black text-slate-900 text-sm">🧪 Beta Mode</p>
                    <p class="text-xs text-slate-500 mt-0.5">Show Beta badge in the navigation</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        name="betaMode"
                        checked={data.settings.betaMode === 'true'}
                        class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
            </div>

            <!-- Registration -->
            <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                    <p class="font-black text-slate-900 text-sm">📝 User Registration</p>
                    <p class="text-xs text-slate-500 mt-0.5">Allow new members to register</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        name="registrationOpen"
                        checked={data.settings.registrationOpen === 'true'}
                        class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
            </div>
        </div>

        <!-- System Info -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h3 class="font-black text-slate-900 flex items-center gap-2">
                🖥️ System Info
            </h3>
            <div class="grid grid-cols-2 gap-3">
                {#each [
                    { label: 'Version', value: 'v0.3.5' },
                    { label: 'Environment', value: 'Production' },
                    { label: 'Database', value: 'Turso (libSQL)' },
                    { label: 'File Storage', value: 'Uploadthing' },
                    { label: 'Hosting', value: 'CapRover' },
                    { label: 'Framework', value: 'SvelteKit 5' },
                ] as info}
                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{info.label}</p>
                        <p class="text-sm font-bold text-slate-900 mt-0.5">{info.value}</p>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Save -->
        <button
            type="submit"
            disabled={isSaving}
            class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200 text-lg"
        >
            {isSaving ? 'Saving...' : 'Save Settings →'}
        </button>

    </form>
</div>