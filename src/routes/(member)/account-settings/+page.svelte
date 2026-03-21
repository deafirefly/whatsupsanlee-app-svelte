<script lang="ts">
    import { enhance } from '$app/forms';
    import { User, Lock, Trash2, Bell, Palette } from 'lucide-svelte';

    let { data, form } = $props();

    let isSaving = $state(false);
    let isDeleting = $state(false);
    let showDeleteConfirm = $state(false);
    let deleteConfirmText = $state('');

    // Theme preference (stored in localStorage)
    let theme = $state(
        typeof window !== 'undefined'
            ? localStorage.getItem('theme') ?? 'system'
            : 'system'
    );

    function setTheme(value: string) {
        theme = value;
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', value);
        }
    }

    // Notification preferences (placeholders for now)
    let notifyNewListings = $state(true);
    let notifyEvents = $state(true);
    let notifyMessages = $state(false);
</script>

<div class="max-w-2xl mx-auto p-6 pb-20 space-y-6">

    <!-- Header -->
    <div>
        <h1 class="text-3xl font-black text-slate-900">Account Settings</h1>
        <p class="text-slate-500 mt-1">Manage your account details and preferences.</p>
    </div>

    <!-- Email & Password -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-indigo-50 rounded-xl">
                <User size={18} class="text-indigo-600" />
            </div>
            <div>
                <h2 class="font-black text-slate-900">Login & Security</h2>
                <p class="text-xs text-slate-400">Update your email and password.</p>
            </div>
        </div>

        <!-- Success/Error for updateProfile -->
        {#if form?.action === 'updateProfile' && form?.message}
            <div class="mb-4 p-3 rounded-2xl {form.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}">
                <p class="text-sm font-bold {form.success ? 'text-emerald-700' : 'text-red-700'}">
                    {form.success ? '✅' : '⚠'} {form.message}
                </p>
            </div>
        {/if}

        <form
            method="POST"
            action="?/updateProfile"
            use:enhance={() => {
                isSaving = true;
                return async ({ update }) => {
                    await update();
                    isSaving = false;
                };
            }}
            class="space-y-4"
        >
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input
                    name="email"
                    type="email"
                    value={data.user?.email}
                    required
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">Current Password *</label>
                <input
                    name="currentPassword"
                    type="password"
                    required
                    placeholder="Required to save changes"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                />
            </div>
            <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">New Password <span class="text-slate-400 font-normal">(optional)</span></label>
                <input
                    name="newPassword"
                    type="password"
                    placeholder="Min. 6 characters"
                    class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                />
                <p class="text-[11px] text-slate-400 mt-1">Leave blank to keep your current password.</p>
            </div>
            <button
                type="submit"
                disabled={isSaving}
                class="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
                {isSaving ? 'Saving...' : 'Save Changes →'}
            </button>
        </form>
    </div>

    <!-- Theme Preference -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-indigo-50 rounded-xl">
                <Palette size={18} class="text-indigo-600" />
            </div>
            <div>
                <h2 class="font-black text-slate-900">Theme</h2>
                <p class="text-xs text-slate-400">Choose your preferred appearance.</p>
            </div>
        </div>
        <div class="grid grid-cols-3 gap-3">
            {#each [
                { value: 'light', label: 'Light', emoji: '☀️' },
                { value: 'dark', label: 'Dark', emoji: '🌙' },
                { value: 'system', label: 'System', emoji: '💻' }
            ] as option}
                <button
                    type="button"
                    onclick={() => setTheme(option.value)}
                    class="p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all
                    {theme === option.value
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-100 hover:border-slate-200'}"
                >
                    <span class="text-2xl">{option.emoji}</span>
                    <span class="text-xs font-black text-slate-700">{option.label}</span>
                </button>
            {/each}
        </div>
        <p class="text-[11px] text-slate-400 mt-3">Theme preference is saved locally on your device.</p>
    </div>

    <!-- Notification Preferences -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-indigo-50 rounded-xl">
                <Bell size={18} class="text-indigo-600" />
            </div>
            <div>
                <h2 class="font-black text-slate-900">Notifications</h2>
                <p class="text-xs text-slate-400">Coming soon — manage what you get notified about.</p>
            </div>
        </div>
        <div class="space-y-4">
            {#each [
                { label: 'New listings in my area', desc: 'Get notified when new businesses join', bind: notifyNewListings },
                { label: 'Upcoming events', desc: 'Event reminders and announcements', bind: notifyEvents },
                { label: 'Messages', desc: 'Direct messages from other members', bind: notifyMessages }
            ] as pref, i}
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                        <p class="font-bold text-slate-900 text-sm">{pref.label}</p>
                        <p class="text-xs text-slate-400 mt-0.5">{pref.desc}</p>
                    </div>
                    <div class="relative">
                        <input
                            type="checkbox"
                            checked={pref.bind}
                            disabled
                            class="sr-only"
                        />
                        <div class="w-10 h-6 rounded-full border-2 border-slate-200 bg-slate-200 opacity-50 cursor-not-allowed"></div>
                    </div>
                </div>
            {/each}
            <p class="text-[11px] text-slate-400 text-center">Notification settings will be enabled in a future update.</p>
        </div>
    </div>

    <!-- Delete Account (hidden for superadmin) -->
    {#if !data.user?.roles?.includes('superadmin')}
    <div class="bg-white rounded-3xl border border-red-200 shadow-sm p-8">
        <div class="flex items-center gap-3 mb-6">
            <div class="p-2 bg-red-50 rounded-xl">
                <Trash2 size={18} class="text-red-500" />
            </div>
            <div>
                <h2 class="font-black text-red-600">Danger Zone</h2>
                <p class="text-xs text-slate-400">Permanently delete your account.</p>
            </div>
        </div>

        {#if form?.action === 'deleteAccount' && form?.message}
            <div class="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200">
                <p class="text-sm font-bold text-red-700">⚠ {form.message}</p>
            </div>
        {/if}

        {#if !showDeleteConfirm}
            <button
                type="button"
                onclick={() => showDeleteConfirm = true}
                class="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-black text-sm hover:bg-red-600 hover:text-white transition-all"
            >
                🗑 Delete My Account
            </button>
        {:else}
            <div class="space-y-4 p-4 bg-red-50 rounded-2xl border border-red-200">
                <p class="text-sm font-bold text-red-700">⚠ This will permanently delete your account and all your data. This cannot be undone!</p>
                <form
                    method="POST"
                    action="?/deleteAccount"
                    use:enhance={() => {
                        isDeleting = true;
                        return async ({ update }) => {
                            await update();
                            isDeleting = false;
                        };
                    }}
                    class="space-y-3"
                >
                    <div>
                        <label class="block text-sm font-bold text-red-700 mb-1">
                            Type <span class="font-black">DELETE</span> to confirm
                        </label>
                        <input
                            name="confirmation"
                            bind:value={deleteConfirmText}
                            placeholder="DELETE"
                            class="w-full p-3 rounded-xl border border-red-300 focus:border-red-600 outline-none text-sm bg-white"
                        />
                    </div>
                    <div class="flex gap-3">
                        <button
                            type="button"
                            onclick={() => { showDeleteConfirm = false; deleteConfirmText = ''; }}
                            class="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-sm hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                            class="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-sm hover:bg-red-700 transition-all disabled:opacity-50"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </button>
                    </div>
                </form>
            </div>
        {/if}
    </div>
    {/if}

</div>