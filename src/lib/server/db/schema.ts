import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	password: text('password').notNull(), // In a real app, hash this!
	roles: text('roles').$type<string[]>().notNull().default((['member'])),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const logs = sqliteTable('logs', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    timestamp: text('timestamp').default(new Date().toISOString()),
    level: text('level'), // 'info', 'warn', 'error'
    event: text('event'), // 'LOGIN_SUCCESS', 'USER_DELETED', 'PASSWORD_CHANGE'
    user: text('user'),  // Email or ID of the person who did it
    details: text('details'), // JSON string or text for more info
    ipAddress: text('ip_address'), // Store the IP address of the user
});

export const systemMeta = sqliteTable('system_meta', {
    key: text('key').primaryKey(), // We'll use 'last_logs_cleared'
    value: text('value').notNull(),
});

export const listings = sqliteTable('listings', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id).notNull(),
    
    // Core Identity
    businessName: text('business_name').notNull(),
    category: text('category').notNull(), // 'food_truck', 'farmer', 'photographer', 'artist'
    contactPerson: text('contact_person').notNull(),
    
    // Communication
    phone: text('phone'),
    email: text('email'),
    website: text('website'),
    
    // Location (Flexible)
    address: text('address'), 
    locationPin: text('location_pin'), // Google Maps link
    
    // Content
    bio: text('bio'), // The "Story" behind the maker
    imageUrl: text('image_url'),

    // Social Media Links
    instagram: text('instagram'),
    facebook: text('facebook'),
    twitter: text('twitter'), // or X
    tiktok: text('tiktok'),

    // Schedule Information
    // We'll store a JSON object like: {"mon": "10:00-18:00", "tue": "Closed"}
    operatingHours: text('operating_hours'), 
    
    // For seasonal events or one-off dates (e.g., "Open only on July 4th")
    specificDates: text('specific_dates'), 
    
    // A quick text field for "Open Weekends" or "Daily 9-5"
    scheduleSummary: text('schedule_summary'),
    
    // Status Logic
    status: text('status').default('pending').notNull(), // For Admin approval
    isFeatured: integer('is_featured', { mode: 'boolean' }).default(false), // For VIP/Special highlights
    
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .notNull(),
        
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .notNull(),
});