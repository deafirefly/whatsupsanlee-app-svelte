import { db } from './index';
import { users, systemMeta, areas, communities } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('🌱 Seeding database...');

    // ─── USERS ───────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash('testpassword', 10);

    await db.insert(users).values({
        email: 'superadmin@test.com',
        password: hashedPassword,
        roles: JSON.stringify(['superadmin']),
    }).onConflictDoNothing();

    await db.insert(users).values({
        email: 'admin@test.com',
        password: hashedPassword,
        roles: JSON.stringify(['admin']),
    }).onConflictDoNothing();

    await db.insert(users).values({
        email: 'testuser@test.com',
        password: hashedPassword,
        roles: JSON.stringify(['member']),
    }).onConflictDoNothing();

    await db.insert(systemMeta).values({
        key: 'last_logs_cleared',
        value: new Date().toISOString()
    }).onConflictDoUpdate({
        target: systemMeta.key,
        set: { value: new Date().toISOString() }
    });

    console.log('✅ Users seeded!');

    // ─── AREAS ───────────────────────────────────────────────
    console.log('🌱 Seeding Lee County areas...');

    const leeCountyAreas = [
        'Sanford',
        'Broadway',
        'Tramway',
        'Carbonton',
        'Lemon Springs',
        'Olivia',
        'Goldston',
        'Cumnock',
        'Deep River',
    ];

    for (const name of leeCountyAreas) {
        await db.insert(areas).values({ name }).onConflictDoNothing();
    }

    console.log('✅ Areas seeded!');

    // ─── COMMUNITIES ─────────────────────────────────────────
    console.log('🌱 Seeding Lee County communities...');

    // Fetch inserted areas so we can reference their IDs
    const insertedAreas = await db.select().from(areas);
    const areaMap: Record<string, number> = {};
    for (const area of insertedAreas) {
        areaMap[area.name] = area.id;
    }

    const communityData: { area: string; communities: string[] }[] = [
        {
            area: 'Sanford',
            communities: [
                'Downtown Sanford',
                'Westover Hills',
                'Carolina Trace',
                'Laurel Hill',
                'Pocket Road Area',
                'Woodland Hills',
                'Pinehurst Drive Area',
                'Carbonton Road Area',
                'Colon Road Area',
                'Jefferson Commons',
                'Steele Place',
                'Endor Iron Furnace Area',
            ]
        },
        {
            area: 'Tramway',
            communities: [
                'Reserve at Carthage Colonies',
                'Owls Nest',
                'Tramway Village',
                'Carthage Road Area',
                'Tramway Road Area',
                'Pine Ridge',
            ]
        },
        {
            area: 'Broadway',
            communities: [
                'Downtown Broadway',
                'Broadway Village',
                'Highway 15-501 Area',
                'Jonesboro Road Area',
            ]
        },
        {
            area: 'Carbonton',
            communities: [
                'Carbonton Village',
                'Deep River Area',
                'Carbonton Road Communities',
            ]
        },
        {
            area: 'Lemon Springs',
            communities: [
                'Lemon Springs Village',
                'Lemon Springs Road Area',
            ]
        },
        {
            area: 'Olivia',
            communities: [
                'Olivia Village',
                'Olivia Road Area',
            ]
        },
        {
            area: 'Goldston',
            communities: [
                'Goldston Village',
                'Goldston Road Area',
            ]
        },
        {
            area: 'Cumnock',
            communities: [
                'Cumnock Village',
                'Cumnock Road Area',
            ]
        },
        {
            area: 'Deep River',
            communities: [
                'Deep River Village',
                'Deep River Road Area',
            ]
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
    console.log('');
    console.log('🎉 All seeding complete!');
    console.log('─────────────────────────────────');
    console.log('Login credentials:');
    console.log('superadmin@test.com | testpassword');
    console.log('admin@test.com      | testpassword');
    console.log('testuser@test.com   | testpassword');
    console.log('─────────────────────────────────');
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});