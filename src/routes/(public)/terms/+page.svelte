<div class="max-w-3xl mx-auto px-6 py-16 space-y-10">

    <!-- Header -->
    <div>
        <h1 class="text-4xl font-black text-slate-900">Terms of Service</h1>
        <p class="text-slate-400 text-sm mt-2">Last updated: March 2026</p>
    </div>

    <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <p class="text-indigo-800 text-sm leading-relaxed">
            By using WhatsUp SanLee you agree to these Terms of Service. Please read them carefully. These terms govern your use of our community platform serving Sanford and Lee County, NC.
        </p>
    </div>

    {#each [
        {
            title: '1. Acceptance of Terms',
            content: [
                'By creating an account or using WhatsUp SanLee, you agree to be bound by these Terms of Service.',
                'If you do not agree to these terms, please do not use the platform.',
                'We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance.',
            ]
        },
        {
            title: '2. Eligibility',
            content: [
                'You must be at least 13 years old to use WhatsUp SanLee.',
                'You must provide accurate and complete information when creating an account.',
                'One person may not maintain more than one account.',
                'Accounts are non-transferable.',
            ]
        },
        {
            title: '3. User Accounts',
            content: [
                'You are responsible for maintaining the confidentiality of your account credentials.',
                'You are responsible for all activity that occurs under your account.',
                'You must notify us immediately of any unauthorized use of your account.',
                'We reserve the right to suspend or terminate accounts that violate these terms.',
            ]
        },
        {
            title: '4. Community Listings',
            content: [
                'Listings must be for legitimate local businesses, services, or crafts in Lee County, NC.',
                'All listing information must be accurate and up to date.',
                'Listings are subject to admin review and approval before going live.',
                'We reserve the right to reject or remove listings that violate our community standards.',
                'You are responsible for keeping your listing information current and accurate.',
            ]
        },
        {
            title: '5. Events',
            content: [
                'Events must be real, legitimate community events in or near Lee County, NC.',
                'Event information must be accurate including dates, times, and locations.',
                'Events are subject to admin review before appearing on the public calendar.',
                'We reserve the right to remove events that are inaccurate or violate community standards.',
            ]
        },
        {
            title: '6. Community Feed & Posts',
            content: [
                'Posts must be respectful and relevant to the Lee County community.',
                'You may not post spam, misleading information, or harmful content.',
                'You may not post content that is offensive, discriminatory, or harassing.',
                'You may not post content that infringes on the intellectual property of others.',
                'We reserve the right to remove posts that violate community standards.',
                'Repeated violations may result in account suspension or termination.',
            ]
        },
        {
            title: '7. Prohibited Conduct',
            content: [
                'Harassment, bullying, or threatening behavior toward other users.',
                'Posting false or misleading information about businesses or individuals.',
                'Attempting to gain unauthorized access to other accounts or our systems.',
                'Using the platform for any illegal purpose.',
                'Scraping, crawling, or automated data collection without permission.',
                'Creating fake accounts or impersonating other users or businesses.',
            ]
        },
        {
            title: '8. Content Ownership',
            content: [
                'You retain ownership of the content you post on WhatsUp SanLee.',
                'By posting content, you grant WhatsUp SanLee a non-exclusive license to display and distribute your content on the platform.',
                'You represent that you have the right to post any content you submit.',
                'We may remove any content that violates these terms without notice.',
            ]
        },
        {
            title: '9. VIP Membership',
            content: [
                'VIP membership provides access to exclusive features and content.',
                'VIP status is granted by administrators and may be revoked for violations of these terms.',
                'Details of VIP benefits may change over time as the platform develops.',
            ]
        },
        {
            title: '10. Disclaimers',
            content: [
                'WhatsUp SanLee is provided "as is" without warranties of any kind.',
                'We do not guarantee the accuracy of user-submitted content including listings and events.',
                'We are not responsible for the actions of users or the content they post.',
                'We are not liable for any damages arising from your use of the platform.',
            ]
        },
        {
            title: '11. Termination',
            content: [
                'You may delete your account at any time from Account Settings.',
                'We may suspend or terminate accounts that violate these terms.',
                'Upon termination, your right to use the platform ceases immediately.',
                'Content you have posted may remain on the platform after account deletion.',
            ]
        },
        {
            title: '12. Contact Us',
            content: [
                'If you have any questions about these Terms of Service, please contact us:',
                'Email: hello@whatsupsanlee.com',
                'Discord: discord.gg/W5mxkJgz',
                'Or use the contact form at whatsupsanlee.com/contact',
            ]
        },
    ] as section}
        <div class="space-y-3">
            <h2 class="text-lg font-black text-slate-900">{section.title}</h2>
            <ul class="space-y-2">
                {#each section.content as item}
                    <li class="flex gap-3 text-sm text-slate-600 leading-relaxed">
                        <span class="text-indigo-400 flex-shrink-0 mt-0.5">•</span>
                        {item}
                    </li>
                {/each}
            </ul>
        </div>
    {/each}

    <!-- Footer Note -->
    <div class="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <p class="text-xs text-slate-400 text-center leading-relaxed">
            These Terms of Service are effective as of March 2026.
            By using WhatsUp SanLee you agree to these terms.
            <a href="/privacy" class="text-indigo-600 font-bold hover:underline">Privacy Policy</a>
        </p>
    </div>

</div>