import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createPool } from '../src/db/index.ts';

/**
 * Creates (or updates) the root superadmin account with a bcrypt-hashed password.
 *
 * Usage:
 *   npx tsx scripts/create-superadmin.ts <email> <password> [displayName]
 *
 * If args are omitted it falls back to SUPERADMIN_EMAIL / SUPERADMIN_PASSWORD env vars.
 * The account can then log in at POST /api/auth/admin-login with { identifier, password }.
 */
(async () => {
  const email = (process.argv[2] || process.env.SUPERADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.argv[3] || process.env.SUPERADMIN_PASSWORD || '';
  const displayName = process.argv[4] || 'Jayeoba Peace Olamide';

  if (!email || !password) {
    console.error('Usage: npx tsx scripts/create-superadmin.ts <email> <password> [displayName]');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Refusing to set a password shorter than 8 characters.');
    process.exit(1);
  }

  const pool = createPool();
  try {
    // Make sure the optional columns exist (older databases may predate them).
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS security_pin TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
    `);

    const passwordHash = await bcrypt.hash(password, 12);

    const res = await pool.query(
      `
      INSERT INTO users (uid, email, display_name, photo_url, role, portfolio, password_hash, last_login_at)
      VALUES ('superadmin-jayeoba-peace', $1, $2,
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              'superadmin', 'Central Executive Council / Superadmin', $3, NOW())
      ON CONFLICT (uid) DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        role = 'superadmin',
        password_hash = EXCLUDED.password_hash
      RETURNING id, uid, email, role;
      `,
      [email, displayName, passwordHash]
    );

    console.log('✅ Superadmin ready:', res.rows[0]);
    console.log(`   Log in with identifier="${email}" and the password you just set.`);
  } catch (err: any) {
    console.error('❌ Failed to create superadmin:', err.message || err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
