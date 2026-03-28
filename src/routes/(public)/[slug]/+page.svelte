{#if listing.slug}
    <div class="max-w-5xl mx-auto px-6 py-2">
        <p class="text-xs text-slate-400">
            Short URL: 
            <a href={`/${listing.slug}`} class="text-indigo-600 font-black hover:underline">
                whatsupsanlee.com/{listing.slug}
            </a>
        </p>
    </div>
{/if}