import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: Pool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    const poolConfig: PoolConfig = connectionString
      ? {
          connectionString,
          ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
            ? false
            : { rejectUnauthorized: false },
          max: 10,
          connectionTimeoutMillis: 15000,
        }
      : {
          host: process.env.SQL_HOST || process.env.PGHOST || 'localhost',
          port: Number(process.env.SQL_PORT || process.env.PGPORT || 5432),
          user: process.env.SQL_USER || process.env.PGUSER || 'postgres',
          password: process.env.SQL_PASSWORD || process.env.PGPASSWORD || '',
          database: process.env.SQL_DB_NAME || process.env.PGDATABASE || 'postgres',
          ssl: process.env.SQL_SSL === 'true' ? { rejectUnauthorized: false } : false,
          max: 10,
          connectionTimeoutMillis: 15000,
        };

    global._postgresPool = new Pool(poolConfig);

    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
