<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, SubmitFunction } from './$types';
    
    let { data }: { data: PageData } = $props();

    // Check current user's power level
    let isSuperAdmin = $derived(data.currentUser?.roles.includes('super-admin'));

    // The 'cancel' lives in the setup phase (the first set of braces)
    const handleDelete: SubmitFunction = ({ cancel }) => {
        if (!confirm("Are you sure you want to delete this user?")) {
            cancel();
        }
        
        // This part runs after the server responds
        return async ({ result }) => {
            if (result.type === 'success') {
                console.log('User deleted successfully');
            }
        };
    };
</script>

<div class="p-6">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold tracking-tight">User Management</h1>
		<span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
			Total Users: {data.userList.length}
		</span>
	</div>

	<div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
		<table class="w-full text-left">
			<thead class="bg-gray-50 border-b border-gray-100">
				<tr>
					<th class="p-4 font-semibold text-gray-600">User</th>
					<th class="p-4 font-semibold text-gray-600">Roles</th>
					<th class="p-4 font-semibold text-gray-600 text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.userList as user}
					<tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
						<td class="p-4">
							<div class="font-medium text-gray-900">{user.email}</div>
							<div class="text-xs text-gray-400">ID: {user.id}</div>
						</td>
						<td class="p-4">
							<div class="flex gap-2">
								{#each user.roles as role}
									<span
										class="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider
                                        {role === 'admin' ? 'bg-red-100 text-red-600' : 
                                         role === 'vip' ? 'bg-yellow-100 text-yellow-700' : 
                                         'bg-blue-100 text-blue-600'}"
									>
										{role}
									</span>
								{/each}
							</div>
						</td>

                        <td class="p-4 text-right">
    <div class="flex justify-end items-center gap-3">
        <form method="POST" action="?/toggleVip" use:enhance>
            <input type="hidden" name="id" value={user.id} />
            <button
                type="submit"
                class="text-sm font-semibold transition-colors 
                {user.roles.includes('vip') ? 'text-orange-600 hover:text-orange-800' : 'text-indigo-600 hover:text-indigo-800'}"
            >
                {user.roles.includes('vip') ? 'Revoke VIP' : 'Make VIP'}
            </button>
        </form>

        {#if user.id !== data.currentUser?.id && 
            !user.roles.includes('super-admin') &&
            !(user.roles.includes('admin') && !isSuperAdmin)}

            <form method="POST" action="?/deleteUser" use:enhance={handleDelete}>
                <input type="hidden" name="id" value={user.id} />
                <button type="submit" class="text-gray-400 hover:text-red-600 p-1" aria-label="Delete User">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </form>
        {:else}
            <span class="text-gray-300 p-1 cursor-not-allowed" title="Account Protected">🔒</span>
        {/if}
    </div>
</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>