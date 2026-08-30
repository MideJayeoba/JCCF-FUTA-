import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db, initDatabaseTables, createPool } from './src/db/index.ts';
import { 
  announcements, 
  events, 
  fellowships, 
  executives, 
  historicalExecutives,
  media,
  resources, 
  donations, 
  systemSettings, 
  users 
} from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { requireAuth, requireAdmin, AuthRequest, getJwtSecret } from './src/middleware/auth.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Warn loudly if the deployment is still relying on built-in default credentials/secrets.
  const insecureConfig: string[] = [];
  if (!process.env.JWT_SECRET && !process.env.SESSION_SECRET) insecureConfig.push('JWT_SECRET');
  if (!process.env.SUPERADMIN_PIN) insecureConfig.push('SUPERADMIN_PIN');
  if (!process.env.PRO_ADMIN_PIN) insecureConfig.push('PRO_ADMIN_PIN');
  if (insecureConfig.length) {
    const msg = `⚠️  Using built-in default(s) for: ${insecureConfig.join(', ')}. Set these env vars before production.`;
    if (process.env.NODE_ENV === 'production') {
      console.error(msg);
    } else {
      console.warn(msg);
    }
  }

  app.use(express.json());

  // Initialize PostgreSQL database tables if connecting to Supabase / PostgreSQL
  initDatabaseTables().catch(err => console.warn('Init tables error:', err));

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 1b. Deep Database Write & Connection Diagnostics (Supabase / PostgreSQL)
  app.all('/api/diagnostics/test-db-write', async (req, res) => {
    const diagStart = Date.now();
    const serverSteps: any[] = [];
    console.log('\n================ [SUPABASE/POSTGRESQL WRITE DIAGNOSTIC INITIATED] ================');
    
    const rawConnectionString = (process.env.DATABASE_URL || '').trim();
    let maskedHost = 'localhost';
    let maskedUser = 'postgres';
    let dbName = 'postgres';
    let isSupabase = false;

    if (rawConnectionString) {
      try {
        const u = new URL(rawConnectionString);
        maskedHost = u.host;
        maskedUser = u.username;
        dbName = u.pathname.replace(/^\//, '');
        isSupabase = u.host.includes('supabase') || u.host.includes('pooler');
      } catch (_) {}
    }

    const dbInfo: any = {
      connected: false,
      host: maskedHost,
      user: maskedUser,
      database: dbName,
      isSupabase,
      nodeTlsRejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
      timestamp: new Date().toISOString()
    };

    try {
      const pool = createPool();

      // Step A: Pool Connection & Basic Ping
      const tConnStart = Date.now();
      const pingRes = await pool.query('SELECT NOW() as server_time, current_database() as db, current_user as usr, version() as ver');
      const connDuration = Date.now() - tConnStart;
      dbInfo.connected = true;
      dbInfo.serverTime = pingRes.rows[0]?.server_time;
      dbInfo.serverVersion = pingRes.rows[0]?.ver;
      
      serverSteps.push({
        step: '1. PostgreSQL / Supabase Pool Connection',
        status: 'passed',
        durationMs: connDuration,
        details: `Connected to ${maskedHost} (${dbName}) in ${connDuration}ms.`
      });
      console.log(`[DIAGNOSTICS] ✅ Step 1 Passed: Connected to ${maskedHost} (${connDuration}ms)`);

      // Step B: Schema & Table Verification
      const tTableStart = Date.now();
      const tablesRes = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name ASC
      `);
      const tableDuration = Date.now() - tTableStart;
      const foundTables = tablesRes.rows.map(r => r.table_name);
      dbInfo.tablesFound = foundTables;
      dbInfo.tableCount = foundTables.length;

      serverSteps.push({
        step: '2. Schema & Table Audit',
        status: 'passed',
        durationMs: tableDuration,
        details: `Discovered ${foundTables.length} public tables: ${foundTables.join(', ')}`
      });
      console.log(`[DIAGNOSTICS] ✅ Step 2 Passed: Found ${foundTables.length} tables in ${tableDuration}ms`);

      // Step C: Drizzle ORM Write Operation (INSERT probe record)
      const tInsertStart = Date.now();
      const probeTitle = `__DIAG_PROBE_${Date.now()}__`;
      const inserted = await db.insert(announcements).values({
        title: probeTitle,
        content: `Diagnostic write test probe executed at ${new Date().toISOString()} from client: ${req.body?.origin || 'unknown'}.`,
        category: 'Diagnostics',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        author: 'Diagnostic Engine',
        pinned: false
      }).returning();
      const insertDuration = Date.now() - tInsertStart;

      if (!inserted || inserted.length === 0 || !inserted[0]?.id) {
        throw new Error('Insert query executed but failed to return inserted row with valid ID.');
      }
      const probeId = inserted[0].id;

      serverSteps.push({
        step: '3. Drizzle ORM INSERT Mutation (Write Test)',
        status: 'passed',
        durationMs: insertDuration,
        details: `Successfully inserted probe row (ID #${probeId}) in ${insertDuration}ms.`
      });
      console.log(`[DIAGNOSTICS] ✅ Step 3 Passed: INSERT probe row #${probeId} (${insertDuration}ms)`);

      // Step D: Read Verification (SELECT probe record)
      const tSelectStart = Date.now();
      const verifiedRows = await db.select().from(announcements).where(eq(announcements.id, probeId));
      const selectDuration = Date.now() - tSelectStart;

      if (verifiedRows.length === 0 || verifiedRows[0].title !== probeTitle) {
        throw new Error(`Probe row #${probeId} was not found on disk immediately after insert.`);
      }

      serverSteps.push({
        step: '4. Read-After-Write Verification (SELECT Test)',
        status: 'passed',
        durationMs: selectDuration,
        details: `Successfully fetched and verified probe row #${probeId} in ${selectDuration}ms.`
      });
      console.log(`[DIAGNOSTICS] ✅ Step 4 Passed: SELECT verification (${selectDuration}ms)`);

      // Step E: Update Mutation Test (UPDATE probe record)
      const tUpdateStart = Date.now();
      await db.update(announcements)
        .set({ content: `Probe updated at ${Date.now()}` })
        .where(eq(announcements.id, probeId));
      const updateDuration = Date.now() - tUpdateStart;

      serverSteps.push({
        step: '5. Row Mutation Test (UPDATE Test)',
        status: 'passed',
        durationMs: updateDuration,
        details: `Successfully updated probe row #${probeId} in ${updateDuration}ms.`
      });
      console.log(`[DIAGNOSTICS] ✅ Step 5 Passed: UPDATE probe row #${probeId} (${updateDuration}ms)`);

      // Step F: Cleanup Test (DELETE probe record)
      const tDeleteStart = Date.now();
      await db.delete(announcements).where(eq(announcements.id, probeId));
      const deleteDuration = Date.now() - tDeleteStart;

      serverSteps.push({
        step: '6. Garbage Cleanup (DELETE Test)',
        status: 'passed',
        durationMs: deleteDuration,
        details: `Successfully removed probe row #${probeId} in ${deleteDuration}ms. Zero lingering test data.`
      });
      console.log(`[DIAGNOSTICS] ✅ Step 6 Passed: DELETE cleanup (${deleteDuration}ms)`);

      const totalLatencyMs = Date.now() - diagStart;
      console.log(`================ [DIAGNOSTIC TEST COMPLETE: ALL PASSED in ${totalLatencyMs}ms] ================\n`);

      return res.json({
        success: true,
        probeRecordId: probeId,
        latency: {
          connectMs: connDuration,
          tableAuditMs: tableDuration,
          insertMs: insertDuration,
          selectMs: selectDuration,
          updateMs: updateDuration,
          deleteMs: deleteDuration,
          totalMs: totalLatencyMs
        },
        dbInfo,
        serverSteps
      });

    } catch (err: any) {
      console.error('[DIAGNOSTICS] ❌ Database Diagnostic Write Failed:', err);
      const totalLatencyMs = Date.now() - diagStart;

      const troubleshootingAdvice: string[] = [];
      if (err.code === '28P01') {
        troubleshootingAdvice.push('Password authentication failed for PostgreSQL user. Please verify the database password in your connection string.');
      } else if (err.code === '3D000') {
        troubleshootingAdvice.push('Database does not exist. Verify the database name at the end of DATABASE_URL.');
      } else if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        troubleshootingAdvice.push('Could not reach PostgreSQL host. Check firewall/network settings, Render environment variables, or Supabase project status (ensure Supabase project is not paused).');
      } else if (err.message && err.message.includes('certificate')) {
        troubleshootingAdvice.push('SSL Certificate rejection. Ensure rejectUnauthorized: false is set on the pg Pool config.');
      } else {
        troubleshootingAdvice.push('Check the server environment variable DATABASE_URL in Render Dashboard.');
        troubleshootingAdvice.push('Ensure the target database is running and accepting connections on port 5432 or 6543.');
      }

      return res.status(500).json({
        success: false,
        latency: { totalMs: totalLatencyMs },
        dbInfo,
        serverSteps,
        error: {
          message: err.message || 'Database write diagnostic failed',
          code: err.code,
          detail: err.detail,
          hint: err.hint,
          routine: err.routine,
          stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
        },
        troubleshootingAdvice
      });
    }
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

  // 2a. Secure Administrative Login Gate (Authenticated directly via PostgreSQL database users & settings)
  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const { email, password, pin, identifier } = req.body;
      const inputId = (identifier || email || '').toLowerCase().trim();
      const inputSecret = (password || pin || '').trim();

      if (!inputSecret || !inputId) {
        return res.status(400).json({
          success: false,
          error: 'Please provide both an administrator email/username and a password/PIN.'
        });
      }

      // 1. Fetch live admin users and settings from PostgreSQL database
      let dbAdminUsers: any[] = [];
      let dbSettings: Record<string, string> = {};
      try {
        dbAdminUsers = await db.select().from(users);
        const settingsRows = await db.select().from(systemSettings);
        settingsRows.forEach(r => {
          dbSettings[r.key] = r.value;
        });
      } catch (dbErr) {
        console.warn('DB fetch notice during admin login:', dbErr);
      }

      const superPin = (dbSettings.superadmin_pin || dbSettings.superadminPin || process.env.SUPERADMIN_PIN || '1945').trim();
      const proPin = (dbSettings.pro_admin_pin || dbSettings.executivePin || process.env.PRO_ADMIN_PIN || '1945').trim();
      const superEmail = (dbSettings.superadmin_email || process.env.SUPERADMIN_EMAIL || 'jayeobapeace19459@gmail.com').toLowerCase().trim();
      const proEmail = (dbSettings.pro_admin_email || process.env.PRO_ADMIN_EMAIL || 'pro@jccf-futa.org').toLowerCase().trim();

      // Verifies the supplied secret against a stored bcrypt hash first, then a plain security PIN.
      const secretMatches = async (candidate: string, passwordHash?: string | null, securityPin?: string | null): Promise<boolean> => {
        if (passwordHash) {
          try {
            if (await bcrypt.compare(candidate, passwordHash)) return true;
          } catch (_) { /* malformed hash — fall through to PIN */ }
        }
        return Boolean(securityPin) && candidate === String(securityPin).trim();
      };

      let matchedUser: any = null;
      let identityHasAdminRow = false;

      // 2. Match strictly on a known identity (email or uid) + that account's own credential.
      for (const u of dbAdminUsers) {
        const uEmail = (u.email || '').toLowerCase().trim();
        const uUid = (u.uid || '').toLowerCase().trim();
        const uRole = u.role || 'member';

        if (!['superadmin', 'admin', 'executive', 'pro'].includes(uRole)) continue;
        if (inputId !== uEmail && inputId !== uUid) continue;

        identityHasAdminRow = true;
        if (await secretMatches(inputSecret, u.passwordHash, u.securityPin || u.security_pin)) {
          matchedUser = u;
          break;
        }
      }

      // 3. Fallback for root Superadmin / PRO ONLY when that identity has no admin row yet
      //    (users table not seeded / not reachable). If the row exists, a wrong secret in
      //    step 2 must fail here too — never fall through to the bootstrap PIN.
      if (!matchedUser && !identityHasAdminRow) {
        if (inputId === superEmail && inputSecret === superPin) {
          matchedUser = {
            uid: 'superadmin-jayeoba-peace',
            email: superEmail,
            displayName: 'Jayeoba Peace Olamide (Superadmin)',
            role: 'superadmin',
            portfolio: 'Central Executive Council / Superadmin',
            photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
          };
        } else if (inputId === proEmail && inputSecret === proPin) {
          matchedUser = {
            uid: 'admin-futa',
            email: proEmail,
            displayName: 'JCCF Administrator',
            role: 'admin',
            portfolio: 'Administrative Directorate',
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
          };
        }
      }

      if (!matchedUser) {
        return res.status(401).json({
          success: false,
          error: 'Access Denied: Invalid administrator email, password, or security PIN.'
        });
      }

      const matchedRole = matchedUser.role || 'superadmin';
      const matchedEmail = matchedUser.email || superEmail;
      const matchedName = matchedUser.displayName || matchedUser.display_name || (matchedRole === 'superadmin' ? 'Jayeoba Peace Olamide' : 'JCCF Administrator');
      const matchedPortfolio = matchedUser.portfolio || (matchedRole === 'superadmin' ? 'Central Executive Council / Superadmin' : 'Public Relations Directorate');
      const matchedAvatar = matchedUser.photoUrl || matchedUser.photo_url || (matchedRole === 'superadmin'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

      // Update last_login_at in PostgreSQL
      try {
        if (matchedUser.id) {
          await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, matchedUser.id));
        } else if (matchedUser.uid) {
          await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.uid, matchedUser.uid));
        }
      } catch (_) {}

      // Generate cryptographically signed JWT session token
      const jwtSecret = getJwtSecret();
      const token = jwt.sign(
        {
          uid: matchedUser.uid || `${matchedRole}-${Date.now()}`,
          email: matchedEmail,
          role: matchedRole,
          name: matchedName
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          name: matchedName,
          email: matchedEmail,
          role: matchedRole,
          portfolio: matchedPortfolio,
          avatar: matchedAvatar,
          loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      });
    } catch (error: any) {
      console.error('Error during administrative login:', error);
      res.status(500).json({ error: 'Server authentication processing error' });
    }
  });

  // 2b. YouTube Video Metadata Proxy
  app.get('/api/youtube/metadata', async (req, res) => {
    try {
      const { videoId, url } = req.query;
      let targetId = (videoId as string) || '';

      if (!targetId && url) {
        const rawUrl = url as string;
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = rawUrl.match(regExp);
        targetId = match ? match[1] : rawUrl;
      }

      if (!targetId || targetId.length !== 11) {
        return res.status(400).json({ error: 'Valid 11-character YouTube video ID or URL is required' });
      }

      const youtubeApiKey = process.env.YOUTUBE_API_KEY;

      // If YouTube Data API v3 key exists in environment
      if (youtubeApiKey) {
        try {
          const ytApiRes = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${targetId}&key=${youtubeApiKey}&part=snippet,contentDetails,statistics`
          );
          if (ytApiRes.ok) {
            const ytData = await ytApiRes.json();
            if (ytData.items && ytData.items.length > 0) {
              const item = ytData.items[0];
              const snippet = item.snippet;
              const thumbnails = snippet.thumbnails || {};
              const thumbUrl = thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || `https://img.youtube.com/vi/${targetId}/hqdefault.jpg`;
              
              return res.json({
                videoId: targetId,
                title: snippet.title || 'JCCF Sermon / Broadcast',
                authorName: snippet.channelTitle || 'JCCF FUTA Media',
                description: snippet.description || '',
                thumbnailUrl: thumbUrl,
                duration: item.contentDetails?.duration || '',
                viewCount: item.statistics?.viewCount ? `${parseInt(item.statistics.viewCount).toLocaleString()} views` : 'HD Stream',
                publishedAt: snippet.publishedAt,
                embedUrl: `https://www.youtube-nocookie.com/embed/${targetId}`
              });
            }
          }
        } catch (apiErr) {
          console.warn('YouTube API v3 fetch failed, falling back to oEmbed:', apiErr);
        }
      }

      // Standard oEmbed fallback (No API key required)
      const targetWatchUrl = `https://www.youtube.com/watch?v=${targetId}`;
      const oembedRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(targetWatchUrl)}`);
      
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        return res.json({
          videoId: targetId,
          title: oembedData.title || 'JCCF FUTA Broadcast',
          authorName: oembedData.author_name || 'JCCF FUTA Media Team',
          description: '',
          thumbnailUrl: oembedData.thumbnail_url || `https://img.youtube.com/vi/${targetId}/hqdefault.jpg`,
          embedUrl: `https://www.youtube-nocookie.com/embed/${targetId}`
        });
      }

      // Default safe response
      res.json({
        videoId: targetId,
        title: 'JCCF FUTA Broadcast',
        authorName: 'JCCF FUTA Media',
        description: '',
        thumbnailUrl: `https://img.youtube.com/vi/${targetId}/hqdefault.jpg`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${targetId}`
      });
    } catch (error: any) {
      console.error('Error fetching YouTube metadata:', error);
      res.status(500).json({ error: 'Failed to fetch YouTube metadata' });
    }
  });

  // Helper to parse ISO 8601 duration
  function formatIsoDuration(isoDuration: string): string {
    if (!isoDuration) return 'Video Broadcast';
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 'Video Broadcast';
    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);
    if (hours > 0) {
      return `${hours} hr ${minutes > 0 ? `${minutes} mins` : ''}`.trim();
    }
    if (minutes > 0) {
      return `${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    return `${seconds} secs`;
  }

  function inferMediaCategory(title: string, desc: string): 'Sermon' | 'Mega Praise' | 'Worship' | 'Seminar' | 'Podcast' {
    const text = `${title} ${desc}`.toLowerCase();
    if (text.includes('mega praise') || text.includes('praise concert') || text.includes('sound of victory')) return 'Mega Praise';
    if (text.includes('worship') || text.includes('prayer') || text.includes('intercession') || text.includes('vigil')) return 'Worship';
    if (text.includes('seminar') || text.includes('teaching weekend') || text.includes('conference') || text.includes('summit') || text.includes('workshop')) return 'Seminar';
    if (text.includes('podcast') || text.includes('interview') || text.includes('mentorship') || text.includes('talk show')) return 'Podcast';
    return 'Sermon';
  }

  // 2c. YouTube Channel Auto-Sync & Listing Endpoint (Strictly @jccf_futa)
  app.get('/api/youtube/channel-videos', async (req, res) => {
    try {
      const queryChannel = (req.query.channel as string || '').trim();
      const targetHandle = queryChannel || process.env.YOUTUBE_CHANNEL || '@jccf_futa';
      const cleanHandle = targetHandle.replace(/^@/, '').toLowerCase();
      const youtubeApiKey = process.env.YOUTUBE_API_KEY;
      let channelTitle = 'JCCF FUTA Official';
      
      // Known verified channel IDs
      const KNOWN_CHANNELS: Record<string, string> = {
        'jccf_futa': 'UCKBys_fv2AYhOVQ81RP0qug',
        'jccffuta': 'UCKBys_fv2AYhOVQ81RP0qug',
        'jccf': 'UCKBys_fv2AYhOVQ81RP0qug'
      };

      let channelId = targetHandle.startsWith('UC') && targetHandle.length >= 22 
        ? targetHandle 
        : (KNOWN_CHANNELS[cleanHandle] || '');

      let videos: any[] = [];

      // Strategy 1: Official YouTube Data API v3 (if API key is present)
      if (youtubeApiKey) {
        try {
          // Resolve channel ID by handle or channel ID or search
          let chanRes;
          if (channelId) {
            chanRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet,contentDetails&key=${youtubeApiKey}`);
          } else {
            chanRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?forHandle=${cleanHandle}&part=snippet,contentDetails&key=${youtubeApiKey}`);
          }

          let chanData = chanRes.ok ? await chanRes.json() : null;

          // If not found by forHandle, try searching by channel title
          if (!chanData?.items || chanData.items.length === 0) {
            const searchChanRes = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(targetHandle)}&type=channel&part=snippet&maxResults=1&key=${youtubeApiKey}`);
            if (searchChanRes.ok) {
              const searchData = await searchChanRes.json();
              if (searchData.items && searchData.items.length > 0) {
                channelId = searchData.items[0].id?.channelId;
                chanRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?id=${channelId}&part=snippet,contentDetails&key=${youtubeApiKey}`);
                chanData = chanRes.ok ? await chanRes.json() : null;
              }
            }
          }

          if (chanData?.items && chanData.items.length > 0) {
            const channelItem = chanData.items[0];
            channelId = channelItem.id;
            channelTitle = channelItem.snippet?.title || targetHandle;
            const uploadsPlaylistId = channelItem.contentDetails?.relatedPlaylists?.uploads;

            if (uploadsPlaylistId) {
              // Fetch playlist items for all uploads
              const playlistRes = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${uploadsPlaylistId}&part=snippet,contentDetails&maxResults=50&key=${youtubeApiKey}`
              );

              if (playlistRes.ok) {
                const playlistData = await playlistRes.json();
                const videoItems = playlistData.items || [];
                const videoIds = videoItems.map((vi: any) => vi.contentDetails?.videoId).filter(Boolean);

                let durationMap: Record<string, { duration: string; viewCount: string }> = {};

                if (videoIds.length > 0) {
                  const vidDetailsRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?id=${videoIds.join(',')}&part=contentDetails,statistics&key=${youtubeApiKey}`
                  );
                  if (vidDetailsRes.ok) {
                    const vidDetailsData = await vidDetailsRes.json();
                    for (const v of vidDetailsData.items || []) {
                      durationMap[v.id] = {
                        duration: formatIsoDuration(v.contentDetails?.duration),
                        viewCount: v.statistics?.viewCount ? `${parseInt(v.statistics.viewCount).toLocaleString()} views` : 'HD Stream'
                      };
                    }
                  }
                }

                videos = videoItems.map((vi: any, index: number) => {
                  const vId = vi.contentDetails?.videoId;
                  const snippet = vi.snippet || {};
                  const thumbs = snippet.thumbnails || {};
                  const thumbUrl = thumbs.maxres?.url || thumbs.high?.url || thumbs.medium?.url || `https://img.youtube.com/vi/${vId}/hqdefault.jpg`;
                  const meta = durationMap[vId] || { duration: 'Broadcast', viewCount: 'HD Stream' };

                  return {
                    id: `yt-${vId || index}`,
                    title: snippet.title || 'JCCF Broadcast',
                    category: inferMediaCategory(snippet.title || '', snippet.description || ''),
                    duration: meta.duration,
                    date: snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Stream',
                    minister: snippet.channelTitle || channelTitle,
                    thumbnail: thumbUrl,
                    youtubeId: vId,
                    description: snippet.description || '',
                    views: meta.viewCount
                  };
                });

                return res.json({
                  source: 'youtube_api_v3',
                  channelName: channelTitle,
                  channelHandle: targetHandle,
                  channelId,
                  totalVideos: videos.length,
                  videos
                });
              }
            }
          }
        } catch (apiErr) {
          console.warn('YouTube API v3 channel lookup error, falling back to public feed:', apiErr);
        }
      }

      // Strategy 2: Resilient Public RSS Feed & YouTube Channel Resolver (Zero API Key required)
      try {
        let detectedChannelId = channelId || (KNOWN_CHANNELS[cleanHandle] || 'UCKBys_fv2AYhOVQ81RP0qug');

        if (!detectedChannelId) {
          if (targetHandle.startsWith('UC') && targetHandle.length >= 22) {
            detectedChannelId = targetHandle;
          } else {
            // Fetch channel landing page to extract channel ID
            const channelUrl = `https://www.youtube.com/@${cleanHandle}`;
            const pageRes = await fetch(channelUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              }
            });

            if (pageRes.ok) {
              const html = await pageRes.text();
              const channelIdMatch = html.match(/channel_id=([a-zA-Z0-9_\-]{22,})/) || 
                                     html.match(/"channelId":"([a-zA-Z0-9_\-]{22,})"/) ||
                                     html.match(/<meta itemprop="channelId" content="([a-zA-Z0-9_\-]{22,})"/);
              if (channelIdMatch) {
                detectedChannelId = channelIdMatch[1];
              }

              const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
              if (titleMatch) {
                channelTitle = titleMatch[1];
              }
            }
          }
        }

        if (detectedChannelId) {
          // Fetch official public YouTube RSS XML for this channel
          const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${detectedChannelId}`);
          if (rssRes.ok) {
            const xml = await rssRes.text();

            // Extract channel title if not already found
            const rssTitleMatch = xml.match(/<author>\s*<name>(.*?)<\/name>/);
            if (rssTitleMatch) {
              channelTitle = rssTitleMatch[1];
            }

            // Parse entries
            const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
            let match;
            const parsedVideos: any[] = [];

            while ((match = entryRegex.exec(xml)) !== null) {
              const entry = match[1];
              const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
              const titleMatch = entry.match(/<title>(.*?)<\/title>/);
              const pubMatch = entry.match(/<published>(.*?)<\/published>/);
              const descMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);
              const thumbMatch = entry.match(/<media:thumbnail url="(.*?)"/);
              const viewsMatch = entry.match(/<media:statistics views="(\d+)"/);

              const videoId = idMatch ? idMatch[1] : '';
              if (videoId) {
                const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : 'JCCF Broadcast';
                const desc = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : '';
                const pubDate = pubMatch ? pubMatch[1] : '';
                const thumb = thumbMatch ? thumbMatch[1] : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                const views = viewsMatch ? `${parseInt(viewsMatch[1]).toLocaleString()} views` : 'HD Stream';

                parsedVideos.push({
                  id: `yt-${videoId}`,
                  title,
                  category: inferMediaCategory(title, desc),
                  duration: 'Video Broadcast',
                  date: pubDate ? new Date(pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent Stream',
                  minister: channelTitle,
                  thumbnail: thumb,
                  youtubeId: videoId,
                  description: desc,
                  views
                });
              }
            }

            if (parsedVideos.length > 0) {
              return res.json({
                source: 'youtube_rss',
                channelName: channelTitle,
                channelHandle: targetHandle,
                channelId: detectedChannelId,
                totalVideos: parsedVideos.length,
                videos: parsedVideos
              });
            }
          }
        }
      } catch (rssErr) {
        console.warn('Public RSS fallback error:', rssErr);
      }

      // Default curated fallback list for JCCF FUTA
      const fallbackList = [
        {
          id: 'yt-CsK_tJUPe2s',
          title: 'HAND OVER SERVICE AND FYB THANKSGIVING || COME UP HITHER',
          description: 'Annual JCCF FUTA Hand Over Service and Final Year Brethren Thanksgiving service.',
          youtubeId: 'CsK_tJUPe2s',
          category: 'Mega Service',
          minister: 'JCCF FUTA Central Executive',
          date: 'Recent Stream',
          thumbnail: 'https://img.youtube.com/vi/CsK_tJUPe2s/hqdefault.jpg',
          duration: '2 hr 45 mins',
          views: '1.4K views'
        },
        {
          id: 'yt-CjPmVAGTxa0',
          title: "TEACHING WEEK '26 | KNOWING GOD; THE PREREQUISITE FOR DOING EXPLOIT | DAY 7",
          description: 'Day 7 Grand Finale of Teaching Week 2026 at JCCF FUTA.',
          youtubeId: 'CjPmVAGTxa0',
          category: 'Sermon',
          minister: 'JCCF FUTA',
          date: 'Teaching Week 2026',
          thumbnail: 'https://img.youtube.com/vi/CjPmVAGTxa0/hqdefault.jpg',
          duration: '2 hr 15 mins',
          views: '2.1K views'
        },
        {
          id: 'yt-qIZ5Ors3Op0',
          title: "TEACHING WEEK '26 | KNOWING GOD; THE PREREQUISITE FOR DOING EXPLOIT | DAY 5",
          description: 'Day 5 Teaching Week session focusing on spiritual exploits.',
          youtubeId: 'qIZ5Ors3Op0',
          category: 'Sermon',
          minister: 'JCCF FUTA',
          date: 'Teaching Week 2026',
          thumbnail: 'https://img.youtube.com/vi/qIZ5Ors3Op0/hqdefault.jpg',
          duration: '1 hr 55 mins',
          views: '1.8K views'
        },
        {
          id: 'yt-Sy1Hd53o2Ng',
          title: "TEACHING WEEK '26 | KNOWING GOD; THE PREREQUISITE FOR DOING EXPLOIT | DAY 4",
          description: 'Day 4 of Teaching Week 2026 at FUTA.',
          youtubeId: 'Sy1Hd53o2Ng',
          category: 'Sermon',
          minister: 'JCCF FUTA',
          date: 'Teaching Week 2026',
          thumbnail: 'https://img.youtube.com/vi/Sy1Hd53o2Ng/hqdefault.jpg',
          duration: '1 hr 40 mins',
          views: '1.2K views'
        },
        {
          id: 'jccf-origins-podcast-kola-folien',
          title: 'How JCCF Started — Exclusive Conversation with Pastor Kola & Folien Eniola',
          description: 'An inspiring deep dive into the birth, foundational prayer covenants, and emergence of JCCF at FUTA.',
          youtubeId: 'iYdKX5jpYIw',
          category: 'Podcast',
          minister: 'Pastor Kola & Folien Eniola',
          date: 'Household Archives',
          thumbnail: 'https://img.youtube.com/vi/iYdKX5jpYIw/hqdefault.jpg',
          duration: 'Special Episode',
          views: '3.4K views'
        }
      ];

      res.json({
        source: 'curated_vault',
        channelName: channelTitle || '@jccf_futa',
        channelHandle: targetHandle || '@jccf_futa',
        channelId: channelId || 'UCKBys_fv2AYhOVQ81RP0qug',
        totalVideos: fallbackList.length,
        videos: fallbackList
      });
    } catch (error: any) {
      console.error('Error in /api/youtube/channel-videos:', error);
      res.status(500).json({ error: 'Failed to fetch YouTube channel videos', details: error.message });
    }
  });

  // 3. Announcements
  app.get('/api/announcements', async (req, res) => {
    try {
      const data = await db.select().from(announcements).orderBy(desc(announcements.id));
      res.json(data);
    } catch (error: any) {
      console.warn('DB note fetching announcements:', error.message || error);
      res.json([]);
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
      if (!isNaN(id)) {
        await db.delete(announcements).where(eq(announcements.id, id));
      }
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
      console.warn('DB note fetching events:', error.message || error);
      res.json([]);
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
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid event ID' });
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
      if (!isNaN(id)) {
        await db.delete(events).where(eq(events.id, id));
      }
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
      console.warn('DB note fetching fellowships:', error.message || error);
      res.json([]);
    }
  });

  app.post('/api/fellowships', requireAdmin, async (req, res) => {
    try {
      const { name, acronym, category, meetingDays, venue, presidentName, presidentPhone, description, logoUrl, mapUrl } = req.body;
      if (!name || !acronym) {
        return res.status(400).json({ error: 'Fellowship name and acronym are required' });
      }
      const result = await db.insert(fellowships).values({
        name,
        acronym,
        category: category || 'Denominational',
        meetingDays: meetingDays || 'Wednesdays & Sundays',
        venue: venue || 'FUTA Campus Venue',
        presidentName: presidentName || 'Fellowship President',
        presidentPhone: presidentPhone || '+234 800 000 0000',
        description: description || 'Campus Christian fellowship operating under JCCF FUTA.',
        logoUrl: logoUrl || '',
        mapUrl: mapUrl || '',
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Error creating fellowship:', error);
      res.status(500).json({ error: 'Failed to create fellowship' });
    }
  });

  // Public Fellowship Registration Endpoint (Direct PostgreSQL Persistence)
  app.post('/api/fellowships/register', async (req, res) => {
    try {
      const { name, acronym, category, meetingDays, venue, presidentName, presidentPhone, description, logoUrl, mapUrl } = req.body;
      if (!name || !acronym) {
        return res.status(400).json({ error: 'Fellowship name and acronym are required' });
      }
      const result = await db.insert(fellowships).values({
        name,
        acronym,
        category: category || 'Denominational',
        meetingDays: meetingDays || 'Wednesdays & Sundays',
        venue: venue || 'FUTA Campus Venue',
        presidentName: presidentName || 'Fellowship President',
        presidentPhone: presidentPhone || '+234 800 000 0000',
        description: description || 'Registered member fellowship under the Joint Christian Campus Fellowship (JCCF) FUTA.',
        logoUrl: logoUrl || '',
        mapUrl: mapUrl || '',
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Error registering fellowship in database:', error);
      res.status(500).json({ error: 'Failed to register fellowship in database' });
    }
  });

  app.put('/api/fellowships/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid fellowship ID' });
      const { name, acronym, category, meetingDays, venue, presidentName, presidentPhone, description, logoUrl, mapUrl } = req.body;
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
        mapUrl,
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
      if (!isNaN(id)) {
        await db.delete(fellowships).where(eq(fellowships.id, id));
      }
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
      console.warn('DB note fetching executives:', error.message || error);
      res.json([]);
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
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid executive ID' });
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
      if (!isNaN(id)) {
        await db.delete(executives).where(eq(executives.id, id));
      }
      res.json({ success: true, message: 'Executive deleted' });
    } catch (error: any) {
      console.error('Error deleting executive:', error);
      res.status(500).json({ error: 'Failed to delete executive' });
    }
  });

  // 7. Constitution, Manuals & Documents
  app.get('/api/resources', async (req, res) => {
    try {
      const data = await db.select().from(resources).orderBy(desc(resources.id));
      res.json(data);
    } catch (error: any) {
      console.warn('DB note fetching resources:', error.message || error);
      res.json([]);
    }
  });

  app.post('/api/resources', requireAdmin, async (req, res) => {
    try {
      const { title, category, courseCode, department, format, fileSize, downloadUrl, description, uploadedBy } = req.body;
      const result = await db.insert(resources).values({
        title,
        category: category || 'Constitutional',
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
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid resource ID' });
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
      if (!isNaN(id)) {
        await db.delete(resources).where(eq(resources.id, id));
      }
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
      console.warn('DB note fetching donations:', error.message || error);
      res.json({ donations: [], totalAmount: 0, count: 0 });
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

  app.delete('/api/donations/:id', requireAdmin, async (req, res) => {
    try {
      const rawId = req.params.id;
      const numId = parseInt(rawId, 10);
      if (!isNaN(numId)) {
        await db.delete(donations).where(eq(donations.id, numId));
      } else {
        await db.delete(donations).where(eq(donations.reference, rawId));
      }
      res.json({ success: true, message: 'Donation record deleted' });
    } catch (error: any) {
      console.error('Error deleting donation:', error);
      res.status(500).json({ error: 'Failed to delete donation' });
    }
  });

  // 8b. Past Executives & Generational Administrations (Historical Records)
  app.get('/api/historical-executives', async (req, res) => {
    try {
      const data = await db.select().from(historicalExecutives).orderBy(desc(historicalExecutives.id));
      const mapped = data.map(item => ({
        id: String(item.id),
        tenure: item.tenure,
        generationName: item.generationName,
        generation: item.generation || '',
        theme: item.theme || '',
        president: item.president,
        executivesList: item.executivesList || '',
        mission: item.mission || '',
        vision: item.vision || '',
        keyAchievements: item.keyAchievements ? (Array.isArray(JSON.parse(item.keyAchievements)) ? JSON.parse(item.keyAchievements) : [item.keyAchievements]) : [],
        photoUrl: item.photoUrl || '',
      }));
      res.json(mapped);
    } catch (error: any) {
      console.warn('DB note fetching historical executives:', error.message || error);
      res.json([]);
    }
  });

  app.post('/api/historical-executives', requireAdmin, async (req, res) => {
    try {
      const { tenure, generationName, generation, theme, president, executivesList, mission, vision, keyAchievements, photoUrl } = req.body;
      const achStr = Array.isArray(keyAchievements) ? JSON.stringify(keyAchievements) : (typeof keyAchievements === 'string' ? JSON.stringify([keyAchievements]) : '[]');
      
      const result = await db.insert(historicalExecutives).values({
        tenure: tenure || '2024/2025',
        generationName: generationName || 'The Trailblazers',
        generation: generation || '',
        theme: theme || '',
        president: president || 'Past President',
        executivesList: executivesList || '',
        mission: mission || '',
        vision: vision || '',
        keyAchievements: achStr,
        photoUrl: photoUrl || '',
      }).returning();

      const created = result[0];
      res.status(201).json({
        id: String(created.id),
        tenure: created.tenure,
        generationName: created.generationName,
        generation: created.generation || '',
        theme: created.theme,
        president: created.president,
        executivesList: created.executivesList,
        mission: created.mission,
        vision: created.vision,
        keyAchievements: created.keyAchievements ? JSON.parse(created.keyAchievements) : [],
        photoUrl: created.photoUrl
      });
    } catch (error: any) {
      console.error('Error creating historical executive:', error);
      res.status(500).json({ error: 'Failed to create historical executive' });
    }
  });

  app.put('/api/historical-executives/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const { tenure, generationName, generation, theme, president, executivesList, mission, vision, keyAchievements, photoUrl } = req.body;
      const achStr = Array.isArray(keyAchievements) ? JSON.stringify(keyAchievements) : (typeof keyAchievements === 'string' ? JSON.stringify([keyAchievements]) : undefined);

      const updateData: any = {
        tenure,
        generationName,
        generation,
        theme,
        president,
        executivesList,
        mission,
        vision,
        photoUrl,
        updatedAt: new Date()
      };
      if (achStr !== undefined) updateData.keyAchievements = achStr;

      const result = await db.update(historicalExecutives).set(updateData).where(eq(historicalExecutives.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'Record not found' });
      
      const updated = result[0];
      res.json({
        id: String(updated.id),
        tenure: updated.tenure,
        generationName: updated.generationName,
        generation: updated.generation || '',
        theme: updated.theme,
        president: updated.president,
        executivesList: updated.executivesList,
        mission: updated.mission,
        vision: updated.vision,
        keyAchievements: updated.keyAchievements ? JSON.parse(updated.keyAchievements) : [],
        photoUrl: updated.photoUrl
      });
    } catch (error: any) {
      console.error('Error updating historical executive:', error);
      res.status(500).json({ error: 'Failed to update historical executive' });
    }
  });

  // 8c. Handover Endpoint: Archiving current executives to past generation list
  app.post('/api/admin/executives/handover', requireAdmin, async (req, res) => {
    try {
      const { generationName, generation, tenure, theme, mission, vision, keyAchievements, photoUrl } = req.body;
      if (!generationName || !generation || !tenure) {
        return res.status(400).json({ error: 'Generation Name, Generation (e.g. 28th Generation), and Tenure/Year (e.g. 2025/2026) are required.' });
      }

      // Fetch all current executives
      const currentList = await db.select().from(executives);
      if (currentList.length === 0) {
        return res.status(400).json({ error: 'No current executives found in database to perform handover.' });
      }

      // Find president
      const presidentObj = currentList.find(e => (e.office || '').toLowerCase().includes('president'));
      const presidentName = presidentObj ? presidentObj.name : (currentList[0]?.name || 'Past President');

      // Create comma-separated list of officers
      const listStr = currentList.map(e => `${e.name} (${e.office})`).join(', ');

      const achStr = Array.isArray(keyAchievements) ? JSON.stringify(keyAchievements) : (typeof keyAchievements === 'string' ? JSON.stringify([keyAchievements]) : '[]');

      // Insert into historical_executives
      const result = await db.insert(historicalExecutives).values({
        tenure: tenure.trim(),
        generationName: generationName.trim(),
        generation: generation.trim(),
        theme: theme || '',
        president: presidentName,
        executivesList: listStr,
        mission: mission || '',
        vision: vision || '',
        keyAchievements: achStr,
        photoUrl: photoUrl || '',
      }).returning();

      // Clear all current executives
      await db.delete(executives);

      res.status(200).json({ 
        success: true, 
        message: `Handover complete! ${currentList.length} current executives have been archived to the "${generationName}" (${generation}, ${tenure}).`, 
        archivedRecord: result[0] 
      });
    } catch (error: any) {
      console.error('Error during handover:', error);
      res.status(500).json({ error: 'Handover processing failed: ' + (error.message || error) });
    }
  });

  app.delete('/api/historical-executives/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!isNaN(id)) {
        await db.delete(historicalExecutives).where(eq(historicalExecutives.id, id));
      }
      res.json({ success: true, message: 'Historical executive administration deleted' });
    } catch (error: any) {
      console.error('Error deleting historical executive:', error);
      res.status(500).json({ error: 'Failed to delete historical executive' });
    }
  });

  // 8c. Media Vault & Broadcasts
  app.get('/api/media', async (req, res) => {
    try {
      const data = await db.select().from(media).orderBy(desc(media.id));
      const mapped = data.map(item => ({
        id: String(item.id),
        title: item.title,
        category: item.category,
        duration: item.duration,
        date: item.date,
        minister: item.minister,
        thumbnail: item.thumbnail,
        youtubeId: item.youtubeId,
        description: item.description,
        views: item.views || '1.2K views'
      }));
      res.json(mapped);
    } catch (error: any) {
      console.warn('DB note fetching media:', error.message || error);
      res.json([]);
    }
  });

  app.post('/api/media', requireAdmin, async (req, res) => {
    try {
      const { title, category, duration, date, minister, thumbnail, youtubeId, description, views } = req.body;
      const result = await db.insert(media).values({
        title: title || 'JCCF Broadcast',
        category: category || 'Sermon',
        duration: duration || '1 hr',
        date: date || 'August 2026',
        minister: minister || 'JCCF FUTA',
        thumbnail: thumbnail || `https://img.youtube.com/vi/${youtubeId || 'dQw4w9WgXcQ'}/hqdefault.jpg`,
        youtubeId: youtubeId || 'dQw4w9WgXcQ',
        description: description || '',
        views: views || '1.5K views'
      }).returning();
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Error creating media:', error);
      res.status(500).json({ error: 'Failed to create media' });
    }
  });

  app.put('/api/media/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const { title, category, duration, date, minister, thumbnail, youtubeId, description, views } = req.body;
      const result = await db.update(media).set({
        title,
        category,
        duration,
        date,
        minister,
        thumbnail,
        youtubeId,
        description,
        views
      }).where(eq(media.id, id)).returning();
      if (result.length === 0) return res.status(404).json({ error: 'Media item not found' });
      res.json(result[0]);
    } catch (error: any) {
      console.error('Error updating media:', error);
      res.status(500).json({ error: 'Failed to update media' });
    }
  });

  app.delete('/api/media/:id', requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (!isNaN(id)) {
        await db.delete(media).where(eq(media.id, id));
      }
      res.json({ success: true, message: 'Media item deleted' });
    } catch (error: any) {
      console.error('Error deleting media:', error);
      res.status(500).json({ error: 'Failed to delete media' });
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
      console.warn('DB note fetching settings:', error.message || error);
      res.json({});
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

      const envSuperEmail = (process.env.SUPERADMIN_EMAIL || 'jayeobapeace19459@gmail.com').toLowerCase().trim();

      let adminList: any[] = [
        {
          email: envSuperEmail,
          name: 'Jayeoba Peace Olamide (Primary Superadmin)',
          role: 'superadmin',
          addedAt: 'Primary Root Superadmin',
          isPrimary: true
        }
      ];

      if (settingsMap.authorizedAdminList) {
        try {
          const parsed = JSON.parse(settingsMap.authorizedAdminList);
          if (Array.isArray(parsed)) {
            parsed.forEach(item => {
              if (item.email && item.email.toLowerCase() !== envSuperEmail) {
                adminList.push(item);
              }
            });
          }
        } catch (_) {}
      }

      res.json({
        primarySuperadminEmail: envSuperEmail,
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
      const envSuperEmail = (process.env.SUPERADMIN_EMAIL || 'jayeobapeace19459@gmail.com').toLowerCase().trim();
      if (emailToDelete === envSuperEmail) {
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

  app.post('/api/admin/change-password', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { email, uid, password } = req.body;
      const inputEmail = (email || '').toLowerCase().trim();
      const inputUid = (uid || '').trim();
      const newPassword = (password || '').trim();

      if (!newPassword) {
        return res.status(400).json({ error: 'Password is required' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      // Find the user to be updated
      let targetUser = null;
      if (inputUid) {
        const uList = await db.select().from(users).where(eq(users.uid, inputUid));
        if (uList.length > 0) targetUser = uList[0];
      } else if (inputEmail) {
        const uList = await db.select().from(users).where(eq(users.email, inputEmail));
        if (uList.length > 0) targetUser = uList[0];
      }

      if (!targetUser) {
        return res.status(404).json({ error: 'User not found in database. The user must sign in once first before their password can be set.' });
      }

      // Check authorization:
      // A user can change their own password, OR a superadmin can change anyone's password.
      const isSelf = req.user && (req.user.uid === targetUser.uid || req.user.email?.toLowerCase().trim() === targetUser.email.toLowerCase().trim());
      const isSuper = req.userRole === 'superadmin';

      if (!isSelf && !isSuper) {
        return res.status(403).json({ error: 'Forbidden: Only the user themselves or a Superadmin can change this password.' });
      }

      // Hash password and update in DB
      const hash = await bcrypt.hash(newPassword, 12);
      await db.update(users)
        .set({ 
          passwordHash: hash,
          securityPin: null // Deactivate the bootstrap PIN
        })
        .where(eq(users.id, targetUser.id));

      res.json({ success: true, message: `Password successfully updated for ${targetUser.email}.` });
    } catch (error: any) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Failed to change password' });
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
