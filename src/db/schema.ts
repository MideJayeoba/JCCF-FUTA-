import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table with Firebase Auth UID & Role-Based Access Control
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  role: text('role').notNull().default('member'), // 'superadmin' | 'admin' | 'executive' | 'member' | 'pro'
  portfolio: text('portfolio'),
  securityPin: text('security_pin'),
  passwordHash: text('password_hash'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at').defaultNow(),
});

// Announcements & Official Circulars
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(), // 'General' | 'Secretariat' | 'Mega Praise' | 'Emergency' | 'Spiritual'
  date: text('date').notNull(),
  author: text('author').notNull(),
  pinned: boolean('pinned').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Events & Program Calendar
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  theme: text('theme'),
  date: text('date').notNull(),
  time: text('time').notNull(),
  venue: text('venue').notNull(),
  category: text('category').notNull(),
  description: text('description').notNull(),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Campus Member Fellowships
export const fellowships = pgTable('fellowships', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  acronym: text('acronym').notNull(),
  category: text('category').notNull(),
  meetingDays: text('meeting_days').notNull(),
  venue: text('venue').notNull(),
  presidentName: text('president_name').notNull(),
  presidentPhone: text('president_phone').notNull(),
  description: text('description').notNull(),
  logoUrl: text('logo_url'),
  mapUrl: text('map_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Central Executive Council Leaders
export const executives = pgTable('executives', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  office: text('office').notNull(),
  department: text('department').notNull(),
  level: text('level').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  session: text('session').notNull(),
  fellowship: text('fellowship').notNull(),
  photoUrl: text('photo_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Constitution, Study Manuals & Documents
export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // 'Constitutional' | 'Manuals' | 'Sermons' | 'Documents' | 'Bulletins'
  courseCode: text('course_code'),
  department: text('department'),
  format: text('format').notNull(),
  fileSize: text('file_size').notNull(),
  downloadUrl: text('download_url').notNull(),
  downloadsCount: integer('downloads_count').default(0),
  description: text('description').notNull(),
  uploadedBy: text('uploaded_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Past Executive Administrations & Generational History
export const historicalExecutives = pgTable('historical_executives', {
  id: serial('id').primaryKey(),
  tenure: text('tenure').notNull(), // e.g. "2024/2025" or "1999/2000"
  generationName: text('generation_name').notNull(), // e.g. "The Trailblazers"
  theme: text('theme'), // e.g. "Generation of Glory"
  president: text('president').notNull(),
  executivesList: text('executives_list'), // summary of other executives
  mission: text('mission'),
  vision: text('vision'),
  keyAchievements: text('key_achievements'), // JSON string array of achievements
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Digital Media Broadcasts & Sermons
export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // 'Sermon' | 'Mega Praise' | 'Worship' | 'Seminar' | 'Podcast'
  duration: text('duration').notNull(),
  date: text('date').notNull(),
  minister: text('minister').notNull(),
  thumbnail: text('thumbnail').notNull(),
  youtubeId: text('youtube_id').notNull(),
  description: text('description').notNull(),
  views: text('views'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Verified Giving & Stewardship Transactions
export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  reference: text('reference').notNull().unique(),
  donorName: text('donor_name').notNull(),
  donorEmail: text('donor_email').notNull(),
  donorPhone: text('donor_phone'),
  amount: integer('amount').notNull(),
  purpose: text('purpose').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'OPay' | 'PalmPay' | 'Bank Transfer' | 'Paystack' | 'Card'
  status: text('status').notNull().default('Completed'), // 'Pending' | 'Completed' | 'Failed'
  channelDetails: text('channel_details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Key-Value Global System Settings (Theme, Merchant info, Contact)
export const systemSettings = pgTable('system_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
