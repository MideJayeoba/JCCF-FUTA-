import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import { 
  announcements, 
  events, 
  fellowships, 
  executives, 
  resources, 
  donations, 
  systemSettings, 
  users 
} from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { requireAuth, requireAdmin, AuthRequest } from './src/middleware/auth.ts';
import { seedDatabaseIfEmpty } from './src/db/seed.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Run seed check at startup lazily in background
  seedDatabaseIfEmpty().catch(err => console.error('Seed error:', err));

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. Auth sync / me
  app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const userList = await db.select().from(users).where(eq(users.uid, req.user!.uid));
      if (userList.length > 0) {
        res.json({ user: userList[0] });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error: any) {
      console.error('Error fetching auth user:', error);
      res.status(500).json({ error: error.message || 'Server error' });
    }
  });

  // 3. Announcements
  app.get('/api/announcements', async (req, res) => {
    try {
      const data = await db.select().from(announcements).orderBy(desc(announcements.id));
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  app.post('/api/announcements', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { title, content, category, date, author, pinned } = req.body;
      const result = await db.insert(announcements).values({
        title,
        content,
        category: category || 'General',
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: author || req.user?.name || 'Central Executive Council',
        pinned: Boolean(pinned),
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      res.status(500).json({ error: 'Failed to create announcement' });
    }
  });

  app.put('/api/announcements/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, content, category, date, author, pinned } = req.body;
      const result = await db.update(announcements).set({
        title,
        content,
        category,
        date,
        author,
        pinned: Boolean(pinned),
      }).where(eq(announcements.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'Announcement not found' });
      res.json(result[0]);
    } catch (error: any) {
      console.error('Error updating announcement:', error);
      res.status(500).json({ error: 'Failed to update announcement' });
    }
  });

  app.delete('/api/announcements/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await db.delete(announcements).where(eq(announcements.id, id));
      res.json({ success: true, message: 'Announcement deleted' });
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      res.status(500).json({ error: 'Failed to delete announcement' });
    }
  });

  // 4. Events
  app.get('/api/events', async (req, res) => {
    try {
      const data = await db.select().from(events).orderBy(desc(events.id));
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
    }
  });

  app.post('/api/events', requireAdmin, async (req, res) => {
    try {
      const { title, theme, date, time, venue, category, description, featured } = req.body;
      const result = await db.insert(events).values({
        title,
        theme: theme || '',
        date,
        time,
        venue,
        category: category || 'Conference',
        description,
        featured: Boolean(featured),
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

  app.put('/api/events/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, theme, date, time, venue, category, description, featured } = req.body;
      const result = await db.update(events).set({
        title,
        theme,
        date,
        time,
        venue,
        category,
        description,
        featured: Boolean(featured),
      }).where(eq(events.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'Event not found' });
      res.json(result[0]);
    } catch (error: any) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
    }
  });

  app.delete('/api/events/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await db.delete(events).where(eq(events.id, id));
      res.json({ success: true, message: 'Event deleted' });
    } catch (error: any) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });

  // 5. Fellowships
  app.get('/api/fellowships', async (req, res) => {
    try {
      const data = await db.select().from(fellowships);
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching fellowships:', error);
      res.status(500).json({ error: 'Failed to fetch fellowships' });
    }
  });

  app.post('/api/fellowships', requireAdmin, async (req, res) => {
    try {
      const { name, acronym, category, meetingDays, venue, presidentName, presidentPhone, description, logoUrl } = req.body;
      const result = await db.insert(fellowships).values({
        name,
        acronym,
        category,
        meetingDays,
        venue,
        presidentName,
        presidentPhone,
        description,
        logoUrl: logoUrl || '',
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Error creating fellowship:', error);
      res.status(500).json({ error: 'Failed to create fellowship' });
    }
  });

  app.put('/api/fellowships/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, acronym, category, meetingDays, venue, presidentName, presidentPhone, description, logoUrl } = req.body;
      const result = await db.update(fellowships).set({
        name,
        acronym,
        category,
        meetingDays,
        venue,
        presidentName,
        presidentPhone,
        description,
        logoUrl,
      }).where(eq(fellowships.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'Fellowship not found' });
      res.json(result[0]);
    } catch (error: any) {
      console.error('Error updating fellowship:', error);
      res.status(500).json({ error: 'Failed to update fellowship' });
    }
  });

  app.delete('/api/fellowships/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await db.delete(fellowships).where(eq(fellowships.id, id));
      res.json({ success: true, message: 'Fellowship deleted' });
    } catch (error: any) {
      console.error('Error deleting fellowship:', error);
      res.status(500).json({ error: 'Failed to delete fellowship' });
    }
  });

  // 6. Executives
  app.get('/api/executives', async (req, res) => {
    try {
      const data = await db.select().from(executives);
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching executives:', error);
      res.status(500).json({ error: 'Failed to fetch executives' });
    }
  });

  app.post('/api/executives', requireAdmin, async (req, res) => {
    try {
      const { name, office, department, level, phone, email, session, fellowship, photoUrl, bio } = req.body;
      const result = await db.insert(executives).values({
        name,
        office,
        department,
        level,
        phone,
        email,
        session: session || '2025/2026',
        fellowship,
        photoUrl: photoUrl || '',
        bio: bio || '',
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Error creating executive:', error);
      res.status(500).json({ error: 'Failed to create executive' });
    }
  });

  app.put('/api/executives/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, office, department, level, phone, email, session, fellowship, photoUrl, bio } = req.body;
      const result = await db.update(executives).set({
        name,
        office,
        department,
        level,
        phone,
        email,
        session,
        fellowship,
        photoUrl,
        bio,
      }).where(eq(executives.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'Executive not found' });
      res.json(result[0]);
    } catch (error: any) {
      console.error('Error updating executive:', error);
      res.status(500).json({ error: 'Failed to update executive' });
    }
  });

  app.delete('/api/executives/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await db.delete(executives).where(eq(executives.id, id));
      res.json({ success: true, message: 'Executive deleted' });
    } catch (error: any) {
      console.error('Error deleting executive:', error);
      res.status(500).json({ error: 'Failed to delete executive' });
    }
  });

  // 7. Academic Resources & Past Questions
  app.get('/api/resources', async (req, res) => {
    try {
      const data = await db.select().from(resources).orderBy(desc(resources.id));
      res.json(data);
    } catch (error: any) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
    }
  });

  app.post('/api/resources', requireAdmin, async (req, res) => {
    try {
      const { title, category, courseCode, department, format, fileSize, downloadUrl, description, uploadedBy } = req.body;
      const result = await db.insert(resources).values({
        title,
        category: category || 'Study Materials',
        courseCode: courseCode || '',
        department: department || 'General',
        format: format || 'PDF',
        fileSize: fileSize || '1.0 MB',
        downloadUrl: downloadUrl || 'https://example.com/file.pdf',
        downloadsCount: 0,
        description: description || '',
        uploadedBy: uploadedBy || 'JCCF Directorate',
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Error creating resource:', error);
      res.status(500).json({ error: 'Failed to create resource' });
    }
  });

  app.put('/api/resources/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { title, category, courseCode, department, format, fileSize, downloadUrl, description, uploadedBy } = req.body;
      const result = await db.update(resources).set({
        title,
        category,
        courseCode,
        department,
        format,
        fileSize,
        downloadUrl,
        description,
        uploadedBy,
      }).where(eq(resources.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'Resource not found' });
      res.json(result[0]);
    } catch (error: any) {
      console.error('Error updating resource:', error);
      res.status(500).json({ error: 'Failed to update resource' });
    }
  });

  app.delete('/api/resources/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      await db.delete(resources).where(eq(resources.id, id));
      res.json({ success: true, message: 'Resource deleted' });
    } catch (error: any) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ error: 'Failed to delete resource' });
    }
  });

  app.post('/api/resources/:id/download', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const current = await db.select().from(resources).where(eq(resources.id, id));
      if (current.length === 0) return res.status(404).json({ error: 'Resource not found' });
      
      const newCount = (current[0].downloadsCount || 0) + 1;
      await db.update(resources).set({ downloadsCount: newCount }).where(eq(resources.id, id));
      res.json({ success: true, downloadUrl: current[0].downloadUrl, count: newCount });
    } catch (error: any) {
      console.error('Error logging download:', error);
      res.status(500).json({ error: 'Failed to process download' });
    }
  });

  // 8. Secure Giving & Donations (PostgreSQL backed with validation)
  app.get('/api/donations', requireAdmin, async (req, res) => {
    try {
      const data = await db.select().from(donations).orderBy(desc(donations.id));
      const totalAmount = data.reduce((sum, d) => sum + (d.amount || 0), 0);
      res.json({ donations: data, totalAmount, count: data.length });
    } catch (error: any) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ error: 'Failed to fetch donations' });
    }
  });

  // Payment Initialization: Server creates unique verifiable reference
  app.post('/api/donations/initialize', async (req, res) => {
    try {
      const { amount, purpose, donorName, donorEmail, donorPhone, paymentMethod } = req.body;
      const numAmount = parseInt(amount, 10);

      if (!numAmount || numAmount <= 0) {
        return res.status(400).json({ error: 'Invalid donation amount' });
      }

      const prefix = paymentMethod === 'OPay' ? 'OPAY-' :
                     paymentMethod === 'PalmPay' ? 'PLMP-' :
                     paymentMethod === 'Paystack' ? 'PSTK-' : 'JCCF-';
      
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(1000 + Math.random() * 9000);
      const reference = `${prefix}${timestamp}${random}`;

      // Insert pending record
      const record = await db.insert(donations).values({
        reference,
        donorName: donorName?.trim() || 'Anonymous Kingdom Partner',
        donorEmail: donorEmail?.trim() || 'partner@futa.edu.ng',
        donorPhone: donorPhone?.trim() || '',
        amount: numAmount,
        purpose: purpose || 'Student Welfare Food Bank & Indigent Care',
        paymentMethod: paymentMethod || 'OPay',
        status: 'Pending',
        channelDetails: `Session created via ${paymentMethod || 'OPay'} portal`,
      }).returning();

      res.json({
        success: true,
        reference,
        transaction: record[0],
      });
    } catch (error: any) {
      console.error('Error initializing payment:', error);
      res.status(500).json({ error: 'Failed to initialize payment' });
    }
  });

  // Payment Verification: Server confirms and sets status to Completed
  app.post('/api/donations/verify', async (req, res) => {
    try {
      const { reference, channelDetails } = req.body;
      if (!reference) {
        return res.status(400).json({ error: 'Missing payment reference' });
      }

      const existing = await db.select().from(donations).where(eq(donations.reference, reference));
      if (existing.length === 0) {
        return res.status(404).json({ error: 'Transaction reference not found' });
      }

      const updated = await db.update(donations).set({
        status: 'Completed',
        channelDetails: channelDetails || existing[0].channelDetails || 'Verified Transaction',
      }).where(eq(donations.reference, reference)).returning();

      res.json({
        success: true,
        receipt: updated[0],
      });
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ error: 'Failed to verify payment' });
    }
  });

  // Direct recorded giving (for OPay/PalmPay merchant transfer confirmations)
  app.post('/api/donations/record', async (req, res) => {
    try {
      const { amount, purpose, donorName, donorEmail, donorPhone, paymentMethod, channelDetails, reference } = req.body;
      const numAmount = parseInt(amount, 10);
      if (!numAmount || numAmount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const ref = reference || `TX-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

      const record = await db.insert(donations).values({
        reference: ref,
        donorName: donorName?.trim() || 'Anonymous Kingdom Partner',
        donorEmail: donorEmail?.trim() || 'partner@futa.edu.ng',
        donorPhone: donorPhone?.trim() || '',
        amount: numAmount,
        purpose: purpose || 'Student Welfare Food Bank & Indigent Care',
        paymentMethod: paymentMethod || 'OPay',
        status: 'Completed',
        channelDetails: channelDetails || `${paymentMethod} Direct Seed`,
      }).onConflictDoUpdate({
        target: donations.reference,
        set: { status: 'Completed' }
      }).returning();

      res.json({ success: true, receipt: record[0] });
    } catch (error: any) {
      console.error('Error recording donation:', error);
      res.status(500).json({ error: 'Failed to record donation' });
    }
  });

  // 9. System Settings
  app.get('/api/settings', async (req, res) => {
    try {
      const rows = await db.select().from(systemSettings);
      const settingsMap: Record<string, string> = {};
      rows.forEach(r => {
        settingsMap[r.key] = r.value;
      });
      res.json(settingsMap);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  app.put('/api/settings', requireAdmin, async (req, res) => {
    try {
      const updates = req.body as Record<string, string>;
      for (const [key, value] of Object.entries(updates)) {
        await db.insert(systemSettings)
          .values({ key, value: String(value), updatedAt: new Date() })
          .onConflictDoUpdate({
            target: systemSettings.key,
            set: { value: String(value), updatedAt: new Date() }
          });
      }
      res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error: any) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  // 10. Admin Users Management & Access Control
  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
      const allUsers = await db.select().from(users).orderBy(desc(users.lastLoginAt));
      res.json(allUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.put('/api/admin/users/:uid/role', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { uid } = req.params;
      const { role } = req.body;
      if (!['superadmin', 'admin', 'executive', 'member'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }

      const result = await db.update(users).set({ role }).where(eq(users.uid, uid)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'User not found' });
      res.json(result[0]);
    } catch (error: any) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  });

  // 11. Superadmin Access Control & PIN Configuration
  app.get('/api/admin/access-control', requireAdmin, async (req, res) => {
    try {
      const settingsRows = await db.select().from(systemSettings);
      const settingsMap: Record<string, string> = {};
      settingsRows.forEach(r => {
        settingsMap[r.key] = r.value;
      });

      let adminList: any[] = [
        {
          email: 'jayeobapeace19459@gmail.com',
          name: 'Jayeoba Peace Olamide (Primary PRO Superadmin)',
          role: 'superadmin',
          addedAt: 'Primary Superadmin (Central Executive)',
          isPrimary: true
        }
      ];

      if (settingsMap.authorizedAdminList) {
        try {
          const parsed = JSON.parse(settingsMap.authorizedAdminList);
          if (Array.isArray(parsed)) {
            parsed.forEach(item => {
              if (item.email && item.email.toLowerCase() !== 'jayeobapeace19459@gmail.com') {
                adminList.push(item);
              }
            });
          }
        } catch (_) {}
      }

      res.json({
        primarySuperadminEmail: 'jayeobapeace19459@gmail.com',
        superadminPin: settingsMap.superadminPin || '778899',
        executivePin: settingsMap.executivePin || '123456',
        authorizedAdmins: adminList
      });
    } catch (error: any) {
      console.error('Error getting access control data:', error);
      res.status(500).json({ error: 'Failed to retrieve access control data' });
    }
  });

  app.post('/api/admin/access-control/admins', requireAdmin, async (req, res) => {
    try {
      const { email, name, role } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email address is required' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const adminRole = role && ['superadmin', 'admin', 'executive'].includes(role) ? role : 'admin';
      const adminName = name?.trim() || normalizedEmail.split('@')[0];

      const settingsRows = await db.select().from(systemSettings);
      const existingRow = settingsRows.find(r => r.key === 'authorizedAdminList');
      let currentList: any[] = [];
      if (existingRow && existingRow.value) {
        try {
          currentList = JSON.parse(existingRow.value);
        } catch (_) {}
      }

      // Filter out if already present
      currentList = currentList.filter((a: any) => a.email && a.email.toLowerCase() !== normalizedEmail);
      currentList.push({
        email: normalizedEmail,
        name: adminName,
        role: adminRole,
        addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        addedBy: 'Superadmin'
      });

      await db.insert(systemSettings)
        .values({ key: 'authorizedAdminList', value: JSON.stringify(currentList), updatedAt: new Date() })
        .onConflictDoUpdate({
          target: systemSettings.key,
          set: { value: JSON.stringify(currentList), updatedAt: new Date() }
        });

      // Update users table if user already logged in previously
      await db.update(users).set({ role: adminRole }).where(eq(users.email, normalizedEmail));

      res.json({ success: true, message: `Admin privileges granted to ${normalizedEmail}`, authorizedAdmins: currentList });
    } catch (error: any) {
      console.error('Error adding authorized admin:', error);
      res.status(500).json({ error: 'Failed to add authorized admin' });
    }
  });

  app.delete('/api/admin/access-control/admins/:email', requireAdmin, async (req, res) => {
    try {
      const emailToDelete = req.params.email.toLowerCase().trim();
      if (emailToDelete === 'jayeobapeace19459@gmail.com') {
        return res.status(400).json({ error: 'Cannot remove primary superadmin' });
      }

      const settingsRows = await db.select().from(systemSettings);
      const existingRow = settingsRows.find(r => r.key === 'authorizedAdminList');
      let currentList: any[] = [];
      if (existingRow && existingRow.value) {
        try {
          currentList = JSON.parse(existingRow.value);
        } catch (_) {}
      }

      currentList = currentList.filter((a: any) => a.email && a.email.toLowerCase() !== emailToDelete);

      await db.insert(systemSettings)
        .values({ key: 'authorizedAdminList', value: JSON.stringify(currentList), updatedAt: new Date() })
        .onConflictDoUpdate({
          target: systemSettings.key,
          set: { value: JSON.stringify(currentList), updatedAt: new Date() }
        });

      // Demote user to member in users table
      await db.update(users).set({ role: 'member' }).where(eq(users.email, emailToDelete));

      res.json({ success: true, message: `Revoked admin privileges from ${emailToDelete}`, authorizedAdmins: currentList });
    } catch (error: any) {
      console.error('Error removing authorized admin:', error);
      res.status(500).json({ error: 'Failed to remove authorized admin' });
    }
  });

  app.put('/api/admin/access-control/pins', requireAdmin, async (req, res) => {
    try {
      const { superadminPin, executivePin } = req.body;
      if (superadminPin) {
        await db.insert(systemSettings)
          .values({ key: 'superadminPin', value: String(superadminPin).trim(), updatedAt: new Date() })
          .onConflictDoUpdate({
            target: systemSettings.key,
            set: { value: String(superadminPin).trim(), updatedAt: new Date() }
          });
      }
      if (executivePin) {
        await db.insert(systemSettings)
          .values({ key: 'executivePin', value: String(executivePin).trim(), updatedAt: new Date() })
          .onConflictDoUpdate({
            target: systemSettings.key,
            set: { value: String(executivePin).trim(), updatedAt: new Date() }
          });
      }
      res.json({ success: true, message: 'Security PINs updated successfully' });
    } catch (error: any) {
      console.error('Error updating PINs:', error);
      res.status(500).json({ error: 'Failed to update PINs' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JCCF FUTA Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
});
