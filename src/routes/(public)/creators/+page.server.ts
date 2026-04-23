// src/routes/(public)/creators/+page.server.ts

import { db } from '$lib/server/db';
import { creators } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = async () => {
    const all = await db.select()
        .from(creators)
        .where(eq(creators.status, 'approved'))
        .orderBy(desc(creators.isFeatured), desc(creators.createdAt));

    const parse = (val: string | null) => {
        try { return JSON.parse(val ?? '[]'); } catch { return []; }
    };

    return {
        creators: all.map(c => ({
            ...c,
            contentCategories: parse(c.contentCategories),
        }))
    };
};