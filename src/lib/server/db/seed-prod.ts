import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { areas, communities } from './schema';
import * as schema from './schema';

// Create direct connection using env vars set in PowerShell
const client = createClient({
    url: process.env.TURSO_URL ?? 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client, { schema });

async function seedProd() {
    console.log('🌱 Seeding production database...');

    // ─── AREAS ───────────────────────────────────────────────
    const leeCountyAreas = [
        'Sanford', 'Broadway', 'Tramway', 'Carbonton',
        'Lemon Springs', 'Olivia', 'Goldston', 'Cumnock', 'Deep River',
    ];

    for (const name of leeCountyAreas) {
        await db.insert(areas).values({ name }).onConflictDoNothing();
    }
    console.log('✅ Areas seeded!');

    // ─── COMMUNITIES ─────────────────────────────────────────
    const insertedAreas = await db.select().from(areas);
    const areaMap: Record<string, number> = {};
    for (const area of insertedAreas) {
        areaMap[area.name] = area.id;
    }

    const communityData: { area: string; communities: string[] }[] = [
        {
            area: 'Sanford',
            communities: [
                'Downtown Sanford', 'Westover Hills', 'Carolina Trace',
                'Laurel Hill', 'Pocket Road Area', 'Woodland Hills',
                'Pinehurst Drive Area', 'Carbonton Road Area', 'Colon Road Area',
                'Jefferson Commons', 'Steele Place', 'Endor Iron Furnace Area',
            ]
        },
        {
            area: 'Tramway',
            communities: [
                'Reserve at Carthage Colonies', 'Owls Nest', 'Tramway Village',
                'Carthage Road Area', 'Tramway Road Area', 'Pine Ridge',
            ]
        },
        {
            area: 'Broadway',
            communities: [
                'Downtown Broadway', 'Broadway Village',
                'Highway 15-501 Area', 'Jonesboro Road Area',
            ]
        },
        {
            area: 'Carbonton',
            communities: [
                'Carbonton Village', 'Deep River Area', 'Carbonton Road Communities',
            ]
        },
        {
            area: 'Lemon Springs',
            communities: ['Lemon Springs Village', 'Lemon Springs Road Area']
        },
        {
            area: 'Olivia',
            communities: ['Olivia Village', 'Olivia Road Area']
        },
        {
            area: 'Goldston',
            communities: ['Goldston Village', 'Goldston Road Area']
        },
        {
            area: 'Cumnock',
            communities: ['Cumnock Village', 'Cumnock Road Area']
        },
        {
            area: 'Deep River',
            communities: ['Deep River Village', 'Deep River Road Area']
        },
    ];

    for (const { area, communities: comms } of communityData) {
        const areaId = areaMap[area];
        if (!areaId) {
            console.warn(`⚠ Area not found: ${area}`);
            continue;
        }
        for (const name of comms) {
            await db.insert(communities).values({ name, areaId }).onConflictDoNothing();
        }
    }

    console.log('✅ Communities seeded!');
    console.log('🎉 Production seeding complete!');
}

seedProd().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});