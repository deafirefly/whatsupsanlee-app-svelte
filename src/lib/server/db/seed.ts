import { db } from './index';
import { users, systemMeta } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('🌱 Seeding database...');

    // 1. Clear existing users (optional, but keeps it clean)
    // await db.delete(users); 

    const hashedPassword = await bcrypt.hash('testpassword', 10);

    // 2. Insert your Super Admin
    await db.insert(users).values({
        email: 'superadmin@test.com',
        password: hashedPassword,
        roles: JSON.stringify(['superadmin']),
    });

    // 2. Insert your Super Admin
    await db.insert(users).values({
        email: 'admin@test.com',
        password: hashedPassword,
        roles: JSON.stringify(['admin']),
    });

    // 3. Insert a Test Member
    await db.insert(users).values({
        email: 'testuser@test.com',
        password: hashedPassword,
        roles: JSON.stringify(['member']),
    });

    // 4. Set the "Initial" cleared timestamp
    // This makes the UI look populated even on a fresh DB
    await db.insert(systemMeta).values({
        key: 'last_logs_cleared',
        value: new Date().toISOString()
    }).onConflictDoUpdate({
        target: systemMeta.key,
        set: { value: new Date().toISOString() }
    });

    console.log('✅ Seeding complete! You can now log in with:');
    console.log('Email: admin@example.com | Password: testpassword');
}

seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});