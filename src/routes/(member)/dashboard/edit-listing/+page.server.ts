import { db } from '$lib/server/db';
import { listings, users, listingPhotos } from '$lib/server/db/schema';
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


export const load = async ({ locals, url }) => {
    if (!locals.user) throw redirect(302, '/login');

    const listing = await db.query.listings.findFirst({
        where: eq(listings.userId, locals.user.id)
    });

    if (!listing) throw redirect(302, '/dashboard');

    // Check VIP status
    const user = await db.query.users.findFirst({
        where: eq(users.id, locals.user.id)
    });

    const roles = typeof user?.roles === 'string' ? JSON.parse(user.roles) : user?.roles ?? [];
    const isVip = roles.includes('vip') || roles.includes('admin') || roles.includes('superadmin');
    const isVipActive = isVip && (!user?.vipExpiresAt || new Date(user.vipExpiresAt) > new Date());

    // Load gallery photos
    const photos = await db.select()
        .from(listingPhotos)
        .where(eq(listingPhotos.listingId, listing.id))
        .orderBy(listingPhotos.sortOrder);

    // Get slug from URL param if available (fresher than DB)
    const slugFromUrl = url.searchParams.get('slug');
    const savedSuccess = url.searchParams.get('saved') === '1';

    return { 
        listing: {
            ...listing,
            slug: slugFromUrl ?? listing.slug
        },
        isVip: isVipActive, 
        photos,
        savedSuccess
    };
};



export const actions = {
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
            tags: (formData.get('tags') as string) || '[]',
            imageUrl: formData.get('imageUrl') as string,
            slug,
            bookingEnabled: formData.get('bookingEnabled') === 'on',
            bookingSlotDuration: Number(formData.get('bookingSlotDuration')) || 60,
            availabilityMode: formData.get('availabilityMode') as string || 'weekly',
            updatedAt: new Date()
        };

        try {
            await db.update(listings)
                .set(updatedData)
                .where(eq(listings.id, id));
        } catch (err) {
            return fail(500, { message: 'Could not update listing.' });
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        redirect(303, `/dashboard/edit-listing?saved=1&slug=${slug}`);
    },

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
                } catch (err) {
                    console.error("Failed to delete from UploadThing:", err);
                }
            }
        }

        try {
            await db.update(listings)
                .set({ imageUrl: null })
                .where(and(
                    eq(listings.id, id),
                    eq(listings.userId, locals.user.id)
                ));
        } catch (err) {
            return fail(500, { message: 'Failed to clear image.' });
        }

        return { success: true };
    },

    addPhoto: async ({ request, locals }) => {
        if (!locals.user) throw redirect(302, '/login');

        const formData = await request.formData();
        const listingId = Number(formData.get('listingId'));
        const url = formData.get('url') as string;
        const altText = (formData.get('altText') as string) || null;

        if (!url) return fail(400, { message: 'No photo URL provided' });

        // Check VIP
        const user = await db.query.users.findFirst({
            where: eq(users.id, locals.user.id)
        });
        const roles = typeof user?.roles === 'string' ? JSON.parse(user.roles) : user?.roles ?? [];
        const isVip = roles.includes('vip') || roles.includes('admin') || roles.includes('superadmin');
        if (!isVip) return fail(403, { message: 'Only VIP members can add gallery photos' });

        // Check photo count (max 4 gallery photos)
        const existingPhotos = await db.select()
            .from(listingPhotos)
            .where(eq(listingPhotos.listingId, listingId));

        if (existingPhotos.length >= 4) {
            return fail(400, { message: 'Maximum 4 gallery photos allowed (VIP)' });
        }

        await db.insert(listingPhotos).values({
            listingId,
            url,
            altText,
            sortOrder: existingPhotos.length,
            createdAt: new Date()
        });

        return { success: true };
    },

    deletePhoto: async ({ request }) => {
        const formData = await request.formData();
        const photoId = Number(formData.get('photoId'));
        const url = formData.get('url') as string;

        if (url) {
            const fileKey = url.split('/').pop();
            if (fileKey) {
                try {
                    const utapi = new UTApi({ token: env.UPLOADTHING_TOKEN });
                    await utapi.deleteFiles(fileKey);
                } catch (err) {
                    console.error('Failed to delete photo:', err);
                }
            }
        }

        await db.delete(listingPhotos).where(eq(listingPhotos.id, photoId));
        return { success: true };
    }
};