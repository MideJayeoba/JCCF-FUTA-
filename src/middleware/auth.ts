import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db/index.ts';
import { users, systemSettings } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
  userRole?: string;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;

    const userEmail = (decodedToken.email || '').toLowerCase().trim();

    // Check system settings for authorized admin emails
    let configuredAuthorizedEmails: string[] = ['jayeobapeace19459@gmail.com'];
    let roleMap: Record<string, string> = { 'jayeobapeace19459@gmail.com': 'superadmin' };

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

      const authEmailsRow = settingsRows.find(r => r.key === 'authorizedAdminEmails');
      if (authEmailsRow && authEmailsRow.value) {
        authEmailsRow.value.split(',').forEach(e => {
          const em = e.toLowerCase().trim();
          if (em) {
            configuredAuthorizedEmails.push(em);
            if (!roleMap[em]) roleMap[em] = 'admin';
          }
        });
      }
    } catch (dbErr) {
      console.warn('Could not query systemSettings for authorized emails:', dbErr);
    }

    const isPrimaryAdmin = userEmail === 'jayeobapeace19459@gmail.com';
    const isAuthorized = configuredAuthorizedEmails.includes(userEmail);
    const assignedRole = isPrimaryAdmin ? 'superadmin' : (isAuthorized ? (roleMap[userEmail] || 'admin') : 'member');

    // Check user in database
    const dbUsers = await db.select().from(users).where(eq(users.uid, decodedToken.uid));
    let role = assignedRole;

    if (dbUsers.length > 0) {
      // If user was granted an admin role or updated in system settings, promote them
      if (isAuthorized && dbUsers[0].role !== assignedRole) {
        await db.update(users).set({ role: assignedRole, lastLoginAt: new Date() }).where(eq(users.uid, decodedToken.uid));
        role = assignedRole;
      } else {
        role = dbUsers[0].role;
      }
    } else {
      // Upsert new user
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
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid authentication session' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  await requireAuth(req, res, () => {
    if (req.userRole === 'superadmin' || req.userRole === 'admin' || req.userRole === 'executive') {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Superadmin or Executive access required' });
    }
  });
};
