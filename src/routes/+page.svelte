<script lang="ts">
	// You can add logic here later for "Already Logged In" checks
</script>

<div class="min-h-screen flex flex-col bg-background">
	<header class="p-6 flex justify-between items-center border-b text-indigo-600">
		<span class="font-bold text-xl tracking-tight">What's Up SanLee!</span>
		<nav class="flex gap-4">
			<a href="/login" class="px-4 py-2 bg-indigo-600 text-slate-50 rounded-md text-sm font-medium hover:bg-slate-800 transition-all shadow-sm">Login</a>
			<a href="/register" class="px-4 py-2 bg-indigo-600 text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-all">
				Get Started
			</a>
		</nav>
	</header>

	<main class="flex-1 flex flex-col items-center justify-center p-6 text-center">
		<div class="max-w-3xl space-y-6">
			<h1 class="text-5xl md:text-6xl font-extrabold tracking-tighter text-indigo-600">
				Welcome to your <span class="italic text-indigo-600">Next-Gen</span> Workspace
			</h1>
			<p class="text-lg text-muted-foreground max-w-[600px] mx-auto">
				Experience the power of tiered access. Whether you're a Member or a VIP, 
				everything you need is just one click away.
			</p>
			
			<div class="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/login" class="px-8 py-4 bg-indigo-600 text-primary-foreground rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
					Enter Dashboard
				</a>
				<div class="px-8 py-4 border rounded-full font-bold text-muted-foreground italic ">
					Future Content Coming Soon...
				</div>
			</div>
		</div>
	</main>

	<footer class="p-8 border-t text-center text-xs text-muted-foreground">
		&copy; 2026 Portal OS. All rights reserved.
	</footer>
</div>