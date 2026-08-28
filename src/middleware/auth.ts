import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { users, systemSettings } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: DecodedIdToken | any;
  userRole?: string;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const adminPinHeader = req.headers['x-admin-pin'] as string | undefined;
  const adminSessionHeader = req.headers['x-admin-session'] as string | undefined;
  const adminEmailHeader = (req.headers['x-admin-email'] as string | undefined)?.toLowerCase().trim();

  const envSuperEmail = (process.env.SUPERADMIN_EMAIL || 'jayeobapeace19459@gmail.com').toLowerCase().trim();
  const envProEmail = (process.env.PRO_ADMIN_EMAIL || 'pro@jccf-futa.org').toLowerCase().trim();
  const envSuperPin = process.env.SUPERADMIN_PIN;
  const envProPin = process.env.PRO_ADMIN_PIN;

  // 1. Check for Admin PIN / Master Session direct authorization
  if (adminPinHeader || adminSessionHeader === 'active' || (authHeader && authHeader.startsWith('Bearer pin-'))) {
    try {
      const settingsRows = await db.select().from(systemSettings);
      const superPinRow = settingsRows.find(r => r.key === 'superadminPin');
      const execPinRow = settingsRows.find(r => r.key === 'executivePin');
      const superPin = envSuperPin || superPinRow?.value || '778899';
      const proPin = envProPin || execPinRow?.value || '123456';

      const providedPin = adminPinHeader || (authHeader && authHeader.startsWith('Bearer pin-') ? authHeader.replace('Bearer pin-', '') : '');

      if (
        (providedPin && (providedPin === superPin || providedPin === envSuperPin)) ||
        (adminSessionHeader === 'active' && (!adminEmailHeader || adminEmailHeader === envSuperEmail))
      ) {
        req.userRole = 'superadmin';
        req.user = {
          uid: 'superadmin-session',
          email: adminEmailHeader || envSuperEmail,
          name: 'Peace Jayeoba (Superadmin)',
        };
        return next();
      }

      if (
        (providedPin && (providedPin === proPin || providedPin === envProPin)) ||
        (adminSessionHeader === 'active' && adminEmailHeader === envProEmail)
      ) {
        req.userRole = 'pro';
        req.user = {
          uid: 'pro-session',
          email: adminEmailHeader || envProEmail,
          name: 'JCCF PRO Administrator',
        };
        return next();
      }
    } catch (dbErr) {
      console.warn('Error reading systemSettings in requireAuth PIN check:', dbErr);
    }
  }

  // 2. Check for Firebase Bearer Token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin credentials required' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const userEmail = (decodedToken.email || '').toLowerCase().trim();

    // Only allow Superadmin, PRO Admin, or emails explicitly authorized in settings
    const configuredAuthorizedEmails: string[] = [envSuperEmail, envProEmail];
    const roleMap: Record<string, string> = { 
      [envSuperEmail]: 'superadmin',
      [envProEmail]: 'pro'
    };

    try {
      const settingsRows = await db.select().from(systemSettings);
      const authListRow = settingsRows.find(r => r.key === 'authorizedAdminList');
      if (authListRow && authListRow.value) {
        try {
          const list = JSON.parse(authListRow.value);
          if (Array.isArray(list)) {
            list.forEach((item: any) => {
              if (item && item.email) {
                const em = item.email.toLowerCase().trim();
                configuredAuthorizedEmails.push(em);
                roleMap[em] = item.role || 'pro';
              }
            });
          }
        } catch (_) {}
      }
    } catch (dbErr) {
      console.warn('Could not query systemSettings for authorized emails:', dbErr);
    }

    const isPrimaryAdmin = userEmail === envSuperEmail;
    const isProAdmin = userEmail === envProEmail;
    const isAuthorized = isPrimaryAdmin || isProAdmin || configuredAuthorizedEmails.includes(userEmail);

    if (!isAuthorized) {
      return res.status(403).json({ 
        error: 'Forbidden: Sign-in is restricted strictly to the JCCF Central Executive Superadmin and authorized JCCF PRO.' 
      });
    }

    const assignedRole = isPrimaryAdmin ? 'superadmin' : (roleMap[userEmail] || 'pro');

    // Sync user record in database
    const dbUsers = await db.select().from(users).where(eq(users.uid, decodedToken.uid));
    let role = assignedRole;

    if (dbUsers.length > 0) {
      if (dbUsers[0].role !== assignedRole) {
        await db.update(users).set({ role: assignedRole, lastLoginAt: new Date() }).where(eq(users.uid, decodedToken.uid));
      }
      role = assignedRole;
    } else {
      await db.insert(users).values({
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: decodedToken.name || '',
        photoUrl: decodedToken.picture || '',
        role: assignedRole,
      }).onConflictDoUpdate({
        target: users.uid,
        set: {
          email: decodedToken.email || '',
          displayName: decodedToken.name || '',
          photoUrl: decodedToken.picture || '',
          role: assignedRole,
          lastLoginAt: new Date(),
        }
      });
    }

    req.userRole = role;
    next();
  } catch (error) {
    console.error('Error verifying Admin ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid administrative authentication session' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  await requireAuth(req, res, () => {
    if (req.userRole === 'superadmin' || req.userRole === 'admin' || req.userRole === 'pro' || req.userRole === 'executive') {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Superadmin or PRO access required' });
    }
  });
};
