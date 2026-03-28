import { db } from '$lib/server/db';
import { listings } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect, fail } from '@sveltejs/kit';

import { UTApi } from "uploadthing/server";
import { env } from "$env/dynamic/private";

function generateSlug(businessName: string): string {
    return businessName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
}

// Initialize the UploadThing API
const utapi = new UTApi({ token: env.UPLOADTHING_TOKEN });

export const load = async ({ locals }) => {
    if (!locals.user) throw redirect(302, '/login');

    const listing = await db.query.listings.findFirst({
        where: eq(listings.userId, locals.user.id)
    });

    if (!listing) throw redirect(302, '/dashboard');

    return { listing };
};

export const actions = {
    // 1. Rename 'default' to 'updateListing'
    updateListing: async ({ request }) => {
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        

        const businessName = formData.get('businessName') as string;
const customSlug = (formData.get('slug') as string)?.trim();

// Generate or use custom slug
let slug = customSlug 
    ? customSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
    : generateSlug(businessName);

// Check slug uniqueness (exclude current listing)
const existing = await db.query.listings.findFirst({
    where: eq(listings.slug, slug)
});
if (existing && existing.id !== id) {
    slug = `${slug}-${id}`;
}

const updatedData = {
    businessName,
    contactPerson: formData.get('contactPerson') as string,
    bio: formData.get('bio') as string,
    category: formData.get('category') as string,
    address: formData.get('address') as string,
    locationPin: formData.get('locationPin') as string,
    scheduleSummary: formData.get('scheduleSummary') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    website: formData.get('website') as string,
    instagram: formData.get('instagram') as string,
    facebook: formData.get('facebook') as string,
    twitter: formData.get('twitter') as string,
    tiktok: formData.get('tiktok') as string,
    imageUrl: formData.get('imageUrl') as string,
    slug,
    updatedAt: new Date()
};

        try {
            await db.update(listings)
                .set(updatedData)
                .where(eq(listings.id, id));
        } catch (err) {
            return fail(500, { message: 'Could not update listing.' });
        }

        return { success: true };
    },

    // 2. The named delete action
    deleteImage: async ({ request, locals }) => {
        const formData = await request.formData();
        const imageUrl = formData.get("imageUrl") as string;
        const id = Number(formData.get("id"));
        const utapi = new UTApi({ token: env.UPLOADTHING_TOKEN });



        if (!id) return fail(400, { message: "Missing listing ID" });

        if (imageUrl) {
            const fileKey = imageUrl.split("/").pop();
            if (fileKey) {
                try {
                    await utapi.deleteFiles(fileKey);
                    console.log("Successfully deleted from UploadThing:", fileKey);
                } catch (err) {
                    console.error("Failed to delete from UploadThing:", err);
                }
            }
        }

        // 3. Update database to clear the URL
        try {
            await db.update(listings)
                .set({ imageUrl: null })
                .where(
                        and(
                            eq(listings.id, id),
                            eq(listings.userId, locals.user.id)
                        )
                    );
            console.log("Database cleared for listing:", id);
        } catch (err) {
            console.error("Database error:", err);
            return fail(500, { message: 'Failed to clear image.' });
        }
        
        return { success: true };
    }
};