import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const { Pool } = pg;
import * as schema from './schema.ts';
import bcrypt from 'bcryptjs';

declare global {
  var _postgresPool: pg.Pool | undefined;
  var _isDbReady: boolean | undefined;
}

export const isDatabaseConfigured = (): boolean => {
  const url = (process.env.DATABASE_URL || '').trim();
  return Boolean(url && (url.startsWith('postgres://') || url.startsWith('postgresql://')));
};

export const createPool = (): pg.Pool => {
  if (!global._postgresPool) {
    const rawConnectionString = (process.env.DATABASE_URL || '').trim();

    if (rawConnectionString && (rawConnectionString.startsWith('postgres://') || rawConnectionString.startsWith('postgresql://'))) {
      let cleanConnStr = rawConnectionString;
      let isNeon = rawConnectionString.includes('neon.tech');
      let isLocal = rawConnectionString.includes('localhost') || rawConnectionString.includes('127.0.0.1');

      try {
        const parsed = new URL(rawConnectionString);
        // Retain pathname and credentials, remove query parameters that cause node-postgres SSL conflicts
        parsed.search = '';
        cleanConnStr = parsed.toString();
      } catch (_) {
        if (cleanConnStr.includes('?')) {
          cleanConnStr = cleanConnStr.split('?')[0];
        }
      }

      global._postgresPool = new Pool({
        connectionString: cleanConnStr,
        ssl: isLocal ? false : { rejectUnauthorized: false },
        max: isNeon ? 10 : 10,
        connectionTimeoutMillis: 15000, // Neon serverless wake-up leeway
        idleTimeoutMillis: 30000,
        keepAlive: true,
      });

      console.log(`🔌 PostgreSQL pool initialized (${isNeon ? 'Neon Serverless' : (isLocal ? 'Localhost' : 'Cloud PostgreSQL')}).`);
    } else {
      // Dummy pool with disabled auto-connect when no DATABASE_URL is supplied
      global._postgresPool = new Pool({
        connectionString: 'postgresql://localhost:5432/disabled',
        ssl: false,
        max: 1,
        connectionTimeoutMillis: 1000,
      });
    }

    global._postgresPool.on('error', (err) => {
      console.warn('PostgreSQL pool connection notice:', err.message);
    });
  }
  return global._postgresPool;
};

export const initDatabaseTables = async (): Promise<boolean> => {
  if (!isDatabaseConfigured()) {
    console.log('ℹ️ DATABASE_URL not set. Running with persistent file-backed data store.');
    global._isDbReady = false;
    return false;
  }

  const p = createPool();
  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uid TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        display_name TEXT,
        photo_url TEXT,
        role TEXT NOT NULL DEFAULT 'member',
        portfolio TEXT,
        security_pin TEXT,
        password_hash TEXT,
        phone TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        last_login_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        author TEXT NOT NULL,
        pinned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        theme TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        venue TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS fellowships (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        acronym TEXT NOT NULL,
        category TEXT NOT NULL,
        meeting_days TEXT NOT NULL,
        venue TEXT NOT NULL,
        president_name TEXT NOT NULL,
        president_phone TEXT NOT NULL,
        description TEXT NOT NULL,
        logo_url TEXT,
        map_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS executives (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        office TEXT NOT NULL,
        department TEXT NOT NULL,
        level TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        session TEXT NOT NULL,
        fellowship TEXT NOT NULL,
        photo_url TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        course_code TEXT,
        department TEXT,
        format TEXT NOT NULL,
        file_size TEXT NOT NULL,
        download_url TEXT NOT NULL,
        downloads_count INTEGER DEFAULT 0,
        description TEXT NOT NULL,
        uploaded_by TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS historical_executives (
        id SERIAL PRIMARY KEY,
        tenure TEXT NOT NULL,
        generation_name TEXT NOT NULL,
        generation TEXT,
        theme TEXT,
        president TEXT NOT NULL,
        executives_list TEXT,
        mission TEXT,
        vision TEXT,
        key_achievements TEXT,
        photo_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      ALTER TABLE historical_executives ADD COLUMN IF NOT EXISTS generation TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS security_pin TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio TEXT;

      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        duration TEXT NOT NULL,
        date TEXT NOT NULL,
        minister TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        youtube_id TEXT NOT NULL,
        description TEXT NOT NULL,
        views TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        reference TEXT NOT NULL UNIQUE,
        donor_name TEXT NOT NULL,
        donor_email TEXT NOT NULL,
        donor_phone TEXT,
        amount INTEGER NOT NULL,
        purpose TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Completed',
        channel_details TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Ensure superadmin & admin details are in PostgreSQL with hashed passwords
    const superEmail = (process.env.SUPERADMIN_EMAIL || 'jayeobapeace19459@gmail.com').toLowerCase().trim();
    const superPin = (process.env.SUPERADMIN_PIN || '1945').trim();
    const superHash = await bcrypt.hash(superPin, 10);

    const proEmail = (process.env.PRO_ADMIN_EMAIL || 'pro@jccf-futa.org').toLowerCase().trim();
    const proPin = (process.env.PRO_ADMIN_PIN || '1945').trim();
    const proHash = await bcrypt.hash(proPin, 10);

    await p.query(`
      INSERT INTO users (uid, email, display_name, photo_url, role, portfolio, password_hash, security_pin, phone, last_login_at)
      VALUES 
        ('superadmin-jayeoba-peace', $1, 'Jayeoba Peace Olamide', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'superadmin', 'Central Executive Council / Superadmin', $2, NULL, '+234 813 987 6543', NOW()),
        ('admin-futa-pro', $3, 'JCCF PRO Directorate', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'admin', 'Public Relations Directorate', $4, NULL, '+234 814 567 8901', NOW())
      ON CONFLICT (uid) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        role = EXCLUDED.role,
        portfolio = EXCLUDED.portfolio,
        password_hash = COALESCE(users.password_hash, EXCLUDED.password_hash);
    `, [superEmail, superHash, proEmail, proHash]);

    console.log('✅ PostgreSQL (Neon) database initialized and administrator accounts verified.');
    global._isDbReady = true;
    return true;
  } catch (err: any) {
    console.warn('PostgreSQL table initialization notice:', err.message);
    global._isDbReady = false;
    return false;
  }
};

const pool = createPool();
export const db = drizzle(pool, { schema });
export const isDbReady = () => Boolean(global._isDbReady);
