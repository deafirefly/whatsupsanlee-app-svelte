<div class="max-w-3xl mx-auto px-6 py-16 space-y-10">

    <!-- Header -->
    <div>
        <h1 class="text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p class="text-slate-400 text-sm mt-2">Last updated: March 2026</p>
    </div>

    <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
        <p class="text-indigo-800 text-sm leading-relaxed">
            Welcome to WhatsUp SanLee! We are committed to protecting your privacy and being transparent about how we collect and use your information. This policy applies to all users of our platform serving the Sanford and Lee County, NC community.
        </p>
    </div>

    {#each [
        {
            title: '1. Information We Collect',
            content: [
                'Account information: When you register, we collect your email address and password (stored securely using bcrypt encryption).',
                'Profile information: Display name, bio, avatar photo, community location, and social media links you choose to provide.',
                'Listing information: Business name, contact details, photos, schedule, and location information for community listings.',
                'Posts and content: Any posts, comments, or event submissions you create on the platform.',
                'Usage data: Basic information about how you use the platform to help us improve the service.',
            ]
        },
        {
            title: '2. How We Use Your Information',
            content: [
                'To provide and operate the WhatsUp SanLee community platform.',
                'To display your profile and listings to other community members.',
                'To send important account-related notifications.',
                'To review and moderate content submissions for community standards.',
                'To improve and develop new features for the platform.',
                'We do not sell your personal information to third parties.',
            ]
        },
        {
            title: '3. Information Sharing',
            content: [
                'Public profiles: If you set your profile to "Public", it will be visible to anyone visiting the site.',
                'Members only profiles: If you set your profile to "Members Only", only logged-in members can view it.',
                'Private profiles: Only you can see your profile.',
                'Community listings: Approved listings are visible to the public by default.',
                'We do not share your email address or personal information with other users.',
            ]
        },
        {
            title: '4. File Uploads & Photos',
            content: [
                'Photos and images uploaded to the platform are stored securely using Uploadthing.',
                'Profile photos and listing images may be visible to other users based on your privacy settings.',
                'You can delete your photos at any time from your account settings or listing editor.',
            ]
        },
        {
            title: '5. Cookies & Sessions',
            content: [
                'We use cookies to keep you logged in to your account.',
                'Session cookies are stored securely and expire after 7 days of inactivity.',
                'We do not use tracking cookies or advertising cookies.',
                'You can clear cookies at any time through your browser settings, which will log you out.',
            ]
        },
        {
            title: '6. Data Security',
            content: [
                'Passwords are encrypted using bcrypt hashing — we never store plain text passwords.',
                'All data is stored securely on our servers.',
                'We take reasonable measures to protect your information from unauthorized access.',
                'In the event of a data breach, we will notify affected users promptly.',
            ]
        },
        {
            title: '7. Your Rights',
            content: [
                'Access: You can view and edit your personal information at any time from your profile and account settings.',
                'Deletion: You can delete your account at any time from Account Settings. This will permanently remove your data.',
                'Correction: You can update your information at any time from your dashboard.',
                'Contact us if you have any questions about your data or want to request deletion.',
            ]
        },
        {
            title: '8. Children\'s Privacy',
            content: [
                'WhatsUp SanLee is not intended for children under 13 years of age.',
                'We do not knowingly collect personal information from children under 13.',
                'If you believe a child has provided us with personal information, please contact us immediately.',
            ]
        },
        {
            title: '9. Changes to This Policy',
            content: [
                'We may update this Privacy Policy from time to time.',
                'We will notify users of significant changes by posting a notice on the platform.',
                'Continued use of the platform after changes constitutes acceptance of the updated policy.',
            ]
        },
        {
            title: '10. Contact Us',
            content: [
                'If you have any questions about this Privacy Policy, please contact us:',
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
            This privacy policy is effective as of March 2026 and applies to all users of WhatsUp SanLee.
            By using our platform you agree to the terms of this policy.
        </p>
    </div>

</div>