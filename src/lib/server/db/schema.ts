import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	roles: text('roles').$type<string[]>().notNull().default(['member']),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
});

export const logs = sqliteTable('logs', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	timestamp: text('timestamp').default(new Date().toISOString()),
	level: text('level'), // 'info', 'warn', 'error'
	event: text('event'), // 'LOGIN_SUCCESS', 'USER_DELETED', 'PASSWORD_CHANGE'
	user: text('user'),
	details: text('details'),
	ipAddress: text('ip_address'),
});

export const systemMeta = sqliteTable('system_meta', {
	key: text('key').primaryKey(),
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
	bio: text('bio'),
	imageUrl: text('image_url'), // Primary/cover image

	// Social Media Links
	instagram: text('instagram'),
	facebook: text('facebook'),
	twitter: text('twitter'),
	tiktok: text('tiktok'),

	// Schedule Information
	operatingHours: text('operating_hours'), // JSON: {"mon": "10:00-18:00", "tue": "Closed"}
	specificDates: text('specific_dates'),
	scheduleSummary: text('schedule_summary'),

	// Status Logic
	status: text('status').default('pending').notNull(), // 'pending' | 'approved' | 'rejected'
	isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),

	createdAt: integer('created_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
});

// --- NEW: Multiple photos per listing ---
export const listingPhotos = sqliteTable('listing_photos', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	listingId: integer('listing_id').references(() => listings.id, { onDelete: 'cascade' }).notNull(),
	url: text('url').notNull(),         // Uploadthing URL
	altText: text('alt_text'),          // Accessibility / caption
	isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
	sortOrder: integer('sort_order').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// --- NEW: Menu items per listing (food trucks mainly, but reusable) ---
export const menuItems = sqliteTable('menu_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	listingId: integer('listing_id').references(() => listings.id, { onDelete: 'cascade' }).notNull(),
	name: text('name').notNull(),
	description: text('description'),
	price: real('price'),               // e.g. 8.99
	category: text('category'),         // e.g. 'Tacos', 'Drinks', 'Desserts'
	imageUrl: text('image_url'),        // Optional photo of the item
	isAvailable: integer('is_available', { mode: 'boolean' }).default(true),
	sortOrder: integer('sort_order').default(0),
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// --- NEW: Daily location schedule (where is the truck TODAY?) ---
export const listingSchedule = sqliteTable('listing_schedule', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	listingId: integer('listing_id').references(() => listings.id, { onDelete: 'cascade' }).notNull(),
	date: text('date').notNull(),        // ISO date string: '2026-03-20'
	locationName: text('location_name'), // e.g. 'Downtown San Lee Farmers Market'
	address: text('address'),            // Full address for that day
	latitude: real('latitude'),          // For map pin
	longitude: real('longitude'),        // For map pin
	startTime: text('start_time'),       // e.g. '10:00'
	endTime: text('end_time'),           // e.g. '15:00'
	notes: text('notes'),                // e.g. 'Rain cancels this event'
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// --- Areas (e.g. Tramway, Sanford, Broadway) ---
export const areas = sqliteTable('areas', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// --- Communities (e.g. Reserve at Carthage Colonies, Owls Nest) ---
export const communities = sqliteTable('communities', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    areaId: integer('area_id').references(() => areas.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// --- Member Profiles ---
export const profiles = sqliteTable('profiles', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),

    // Identity
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),

    // Location
    areaId: integer('area_id').references(() => areas.id),
    communityId: integer('community_id').references(() => communities.id),

    // Social
    instagram: text('instagram'),
    facebook: text('facebook'),
    twitter: text('twitter'),
    tiktok: text('tiktok'),
    website: text('website'),

    // Privacy setting
    visibility: text('visibility').default('public').notNull(), // 'public' | 'members' | 'private'

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});