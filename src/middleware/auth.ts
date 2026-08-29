import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { users, systemSettings } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: DecodedIdToken | any;
  userRole?: string;
}

export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || process.env.SESSION_SECRET || 'jccf-futa-secure-admin-secret-key-2026';
};

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Administrative authentication required' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing authentication token' });
  }

  const envSuperEmail = (process.env.SUPERADMIN_EMAIL || 'jayeobapeace19459@gmail.com').toLowerCase().trim();
  const envProEmail = (process.env.PRO_ADMIN_EMAIL || 'pro@jccf-futa.org').toLowerCase().trim();

  // 1. Verify if token is a signed JWT from our server-side /api/auth/admin-login
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as any;
    if (decoded && decoded.role) {
      req.user = {
        uid: decoded.uid || 'admin-jwt-session',
        email: decoded.email,
        name: decoded.name || 'JCCF Administrator',
      };
      req.userRole = decoded.role;
      return next();
    }
  } catch (jwtErr) {
    // Not a valid JWT or expired, try Firebase Auth token below
  }

  // 2. Verify if token is a Firebase Google ID Token
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const userEmail = (decodedToken.email || '').toLowerCase().trim();

    // Query DB for authorized administrator list
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
                roleMap[em] = item.role || 'admin';
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
        error: 'Forbidden: Access restricted strictly to authorized JCCF administrators.' 
      });
    }

    const assignedRole = isPrimaryAdmin ? 'superadmin' : (roleMap[userEmail] || 'admin');

    // Sync user record in database
    try {
      const dbUsers = await db.select().from(users).where(eq(users.uid, decodedToken.uid));
      if (dbUsers.length > 0) {
        if (dbUsers[0].role !== assignedRole) {
          await db.update(users).set({ role: assignedRole, lastLoginAt: new Date() }).where(eq(users.uid, decodedToken.uid));
        }
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
    } catch (syncErr) {
      console.warn('Could not sync user role to database:', syncErr);
    }

    req.userRole = assignedRole;
    return next();
  } catch (firebaseErr) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired administrative session' });
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
