import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const { Pool } = pg;
import * as schema from './schema.ts';

// SSL verification for cloud PostgreSQL providers (Supabase, Neon, Cloud SQL) is relaxed per-pool
// via the `ssl` option below — we deliberately avoid the process-wide NODE_TLS_REJECT_UNAUTHORIZED
// switch so outbound HTTPS (YouTube, oEmbed, etc.) keeps full certificate validation.

declare global {
  var _postgresPool: pg.Pool | undefined;
}

export const createPool = (): pg.Pool => {
  if (!global._postgresPool) {
    const rawConnectionString = (process.env.DATABASE_URL || '').trim();

    if (rawConnectionString) {
      // Strip any search params that might conflict with node-postgres SSL configuration
      let cleanConnStr = rawConnectionString;
      try {
        const parsed = new URL(rawConnectionString);
        parsed.search = '';
        cleanConnStr = parsed.toString();
      } catch (_) {
        if (cleanConnStr.includes('?')) {
          cleanConnStr = cleanConnStr.split('?')[0];
        }
      }

      const isLocal = cleanConnStr.includes('localhost') || cleanConnStr.includes('127.0.0.1');

      global._postgresPool = new Pool({
        connectionString: cleanConnStr,
        ssl: isLocal ? false : { rejectUnauthorized: false },
        max: 10,
        connectionTimeoutMillis: 15000,
      });
    } else {
      // Fallback local connection when no DATABASE_URL is supplied
      global._postgresPool = new Pool({
        connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres',
        ssl: false,
        max: 5,
        connectionTimeoutMillis: 5000,
      });
    }

    global._postgresPool.on('error', (err) => {
      console.warn('PostgreSQL pool notice:', err.message);
    });
  }
  return global._postgresPool;
};

export const initDatabaseTables = async () => {
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
    console.log('✅ PostgreSQL database tables initialized successfully.');

    // Seed database with default data if empty
    const { seedDatabaseIfEmpty } = await import('./seed.ts');
    await seedDatabaseIfEmpty();
  } catch (err: any) {
    console.warn('PostgreSQL table initialization notice:', err.message);
  }
};

const pool = createPool();
export const db = drizzle(pool, { schema });
