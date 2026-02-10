<script lang="ts">
    let { data } = $props();

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString([], { 
            month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' 
        });
    };
</script>

<div class="container mx-auto p-4 lg:p-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">System Audit Logs</h1>
            <p class="text-muted-foreground text-sm">Reviewing security events and user activity.</p>
        </div>
        
        <div class="flex gap-2">
            <button 
                class="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-80 transition-all border" 
                onclick={() => window.location.reload()}
            >
                Refresh Feed
            </button>

            <form 
                method="POST" 
                action="?/clearLogs" 
                onsubmit={(e) => { if (!confirm('Permanently delete all logs?')) e.preventDefault(); }}
            >
                <button 
                    type="submit"
                    class="px-4 py-2 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 transition-all shadow-sm"
                >
                    Clear Audit History
                </button>
            </form>
        </div>
    </div>

    <div class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b bg-muted/50 transition-colors">
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Timestamp</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Event</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                        <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Details</th>
                        <th class="h-12 px-4 text-right align-middle font-medium text-muted-foreground">IP</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    {#each data.allLogs as log}
                        <tr class="hover:bg-muted/30 transition-colors">
                            <td class="p-4 align-middle whitespace-nowrap text-muted-foreground">
                                {formatDate(log.timestamp)}
                            </td>
                            <td class="p-4 align-middle">
                                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border
                                    {log.event.includes('FAILURE') 
                                        ? 'border-destructive/50 bg-destructive/10 text-destructive' 
                                        : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}">
                                    {log.event}
                                </span>
                            </td>
                            <td class="p-4 align-middle font-medium uppercase text-xs tracking-wider">
                                {log.user}
                            </td>
                            <td class="p-4 align-middle text-muted-foreground italic">
                                {log.details}
                            </td>
                            <td class="p-4 align-middle text-right font-mono text-[10px] opacity-60">
                                {log.ipAddress}
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="5" class="p-8 text-center text-muted-foreground italic">
                                No activity recorded yet.
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>