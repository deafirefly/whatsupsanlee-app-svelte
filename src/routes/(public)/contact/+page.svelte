<script lang="ts">
    import { enhance } from '$app/forms';

    let { form } = $props();
    let isSubmitting = $state(false);
    let showSuccess = $state(form?.success ?? false);

    const faqs = [
        {
            q: 'How do I list my food truck or business?',
            a: 'Create a free account, log in to your dashboard, and click "Create Your Listing". Your listing will be reviewed by our admin team before going live.'
        },
        {
            q: 'How do I post an event?',
            a: 'Log in to your member dashboard and click "Post Event". Fill in the details and submit for review. Events are typically approved within 24 hours.'
        },
        {
            q: 'Is WhatsUp SanLee free to use?',
            a: 'Yes! Basic membership is completely free. We also offer a VIP membership with exclusive features and content.'
        },
        {
            q: 'How do I become a VIP member?',
            a: 'You can upgrade to VIP from your member dashboard. VIP members get access to exclusive content and features.'
        },
        {
            q: 'I found a bug or have a suggestion. How do I report it?',
            a: 'Join our Discord community and share your feedback there! We actively monitor Discord and appreciate all feedback from our community.'
        },
        {
            q: 'How do I get my community or neighborhood added?',
            a: 'Send us a message using the contact form below or join our Discord and let us know. We\'re always adding new communities!'
        },
    ];

    let openFaq = $state<number | null>(null);

    function toggleFaq(index: number) {
        openFaq = openFaq === index ? null : index;
    }
</script>

<div class="min-h-screen bg-slate-50/50 pb-20">

    <!-- Back Nav -->
    <div class="bg-white border-b">
        <div class="max-w-5xl mx-auto px-6 py-4">
            <a href="/" class="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                ← Back to Home
            </a>
        </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-16 space-y-16">

        <!-- Header -->
        <div class="text-center space-y-4">
            <h1 class="text-5xl font-black text-slate-900 tracking-tight">Get in Touch</h1>
            <p class="text-xl text-slate-500 max-w-xl mx-auto">
                Have a question, suggestion, or just want to say hello? We'd love to hear from you!
            </p>
        </div>

        <!-- Contact Options -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center">
                <span class="text-3xl block mb-3">✉️</span>
                <h3 class="font-black text-slate-900 mb-1">Email Us</h3>
                <p class="text-xs text-slate-400 mb-3">We'll get back to you soon</p>
                <a href="mailto:hello@whatsupsanlee.com"
                    class="text-sm font-bold text-indigo-600 hover:underline">
                    contact@whatsupsanlee.com
                </a>
            </div>
            <a href="https://discord.gg/W5mxkJgz" target="_blank" rel="noopener noreferrer"
                class="bg-[#5865F2] rounded-3xl p-6 text-center text-white hover:scale-105 transition-all shadow-lg">
                <span class="text-3xl block mb-3">💬</span>
                <h3 class="font-black mb-1">Join Discord</h3>
                <p class="text-xs text-indigo-200 mb-3">Chat with the community</p>
                <span class="text-sm font-black bg-white/20 px-3 py-1.5 rounded-xl">
                    discord.gg/W5mxkJgz
                </span>
            </a>
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-center">
                <span class="text-3xl block mb-3">📍</span>
                <h3 class="font-black text-slate-900 mb-1">Based In</h3>
                <p class="text-xs text-slate-400 mb-3">Proudly local</p>
                <p class="text-sm font-bold text-slate-700">
                    Sanford, NC<br/>Lee County
                </p>
            </div>
        </div>

        <!-- Contact Form & FAQ -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <!-- Contact Form -->
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Send a Message</h2>

                {#if showSuccess}
                    <div class="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                        <span class="text-4xl block mb-3">✅</span>
                        <h3 class="font-black text-emerald-800 text-lg">Message Sent!</h3>
                        <p class="text-emerald-600 text-sm mt-1">Thanks for reaching out! We'll get back to you soon.</p>
                        <button
                            onclick={() => showSuccess = false}
                            class="mt-4 text-sm font-bold text-indigo-600 hover:underline">
                            Send another message
                        </button>
                    </div>
                {:else}
                    {#if form?.message}
                        <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
                            <p class="text-red-700 font-bold text-sm">⚠ {form.message}</p>
                        </div>
                    {/if}

                    <form
                        method="POST"
                        use:enhance={() => {
                            isSubmitting = true;
                            return async ({ result, update }) => {
                                await update();
                                isSubmitting = false;
                                if (result.type === 'success') {
                                    showSuccess = true;
                                }
                            };
                        }}
                        class="space-y-4"
                    >
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">Your Name *</label>
                            <input
                                name="name"
                                required
                                placeholder="John Smith"
                                class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">Email Address *</label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-slate-700 mb-1">Message *</label>
                            <textarea
                                name="message"
                                required
                                rows={5}
                                placeholder="Tell us what's on your mind..."
                                class="w-full p-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-50 outline-none text-sm resize-none"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            class="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message →'}
                        </button>
                    </form>
                {/if}
            </div>

            <!-- FAQ -->
            <div class="space-y-3">
                <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6">Frequently Asked Questions</h2>
                {#each faqs as faq, i}
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <button
                            onclick={() => toggleFaq(i)}
                            class="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                        >
                            <span class="font-bold text-slate-900 text-sm pr-4">{faq.q}</span>
                            <span class="flex-shrink-0 text-indigo-600 font-black text-lg transition-transform {openFaq === i ? 'rotate-45' : ''}">
                                +
                            </span>
                        </button>
                        {#if openFaq === i}
                            <div class="px-5 pb-5">
                                <p class="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

        </div>

    </div>
</div>