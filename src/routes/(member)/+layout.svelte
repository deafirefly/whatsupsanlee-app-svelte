<script lang="ts">
    import Sidebar from '$lib/components/Sidebar.svelte';
    import TopBar from '$lib/components/TopBar.svelte';
    import { enhance } from '$app/forms';
    let { children, data } = $props();
</script>

    <div class="flex min-h-screen bg-slate-50">
  <div class="sticky top-0 h-screen">
    <Sidebar user={data.user} />
  </div>
  <div class="flex-1 flex flex-col min-w-0">
    <TopBar user={data.user} />
    
    <main class="p-8 flex-1">
      <div class="max-w-7xl mx-auto">
        {@render children()}
      </div>
    </main>
    <footer class="p-6 border-t bg-white">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex flex-col gap-1">
                <p class="text-slate-400 text-sm">Built with ❤️ for the Sanford & Lee County community</p>
                <p class="text-xs text-muted-foreground">&copy; 2026 WhatsUp SanLee. All rights reserved.</p>
            </div>
            <div class="flex items-center gap-4 text-xs">
                <a href="/about" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">About</a>
                <a href="/contact" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">Contact</a>
                <a href="/privacy" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">Privacy</a>
                <a href="/terms" class="text-slate-500 hover:text-indigo-600 font-bold transition-colors">Terms</a>
                <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-[#5865F2] text-white rounded-lg font-black hover:opacity-90 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    Discord
                </a>
            </div>
        </div>
    </footer>
  </div>
</div>
