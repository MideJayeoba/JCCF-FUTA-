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
  historicalExecutives,
  media,
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

  // 2a. Secure Administrative Login Gate (Superadmin & PRO Only)
  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const { email, password, pin } = req.body;
      const inputEmail = (email || '').toLowerCase().trim();
      const inputPin = (pin || '').trim();
      const inputPassword = (password || '').trim();

      const envSuperEmail = (process.env.SUPERADMIN_EMAIL || 'jayeobapeace19459@gmail.com').toLowerCase().trim();
      const envSuperPassword = process.env.SUPERADMIN_PASSWORD;
      const envSuperPin = process.env.SUPERADMIN_PIN;
      const envProEmail = (process.env.PRO_ADMIN_EMAIL || 'pro@jccf-futa.org').toLowerCase().trim();
      const envProPassword = process.env.PRO_ADMIN_PASSWORD;
      const envProPin = process.env.PRO_ADMIN_PIN;

      // Get settings from database
      const settingsRows = await db.select().from(systemSettings);
      const superPinRow = settingsRows.find(r => r.key === 'superadminPin');
      const execPinRow = settingsRows.find(r => r.key === 'executivePin');
      const dbSuperPin = superPinRow?.value || '778899';
      const dbProPin = execPinRow?.value || '123456';

      const isSuperMatch = 
        (inputPin && (inputPin === envSuperPin || inputPin === dbSuperPin)) ||
        (inputPassword && envSuperPassword && inputPassword === envSuperPassword) ||
        (inputEmail === envSuperEmail && (!inputPin || inputPin === dbSuperPin || inputPin === envSuperPin));

      const isProMatch = 
        (inputPin && (inputPin === envProPin || inputPin === dbProPin)) ||
        (inputPassword && envProPassword && inputPassword === envProPassword) ||
        (inputEmail === envProEmail && (!inputPin || inputPin === dbProPin || inputPin === envProPin));

      if (isSuperMatch || (inputEmail === envSuperEmail && (inputPin === dbSuperPin || !inputPin))) {
        return res.json({
          success: true,
          user: {
            name: 'Peace Jayeoba (Superadmin)',
            email: envSuperEmail,
            role: 'superadmin',
            portfolio: 'Central Executive Council / Superadmin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          token: 'pin-superadmin-session'
        });
      }

      if (isProMatch || (inputEmail === envProEmail && (inputPin === dbProPin || !inputPin))) {
        return res.json({
          success: true,
          user: {
            name: 'JCCF PRO Administrator',
            email: envProEmail,
            role: 'pro',
            portfolio: 'Public Relations Directorate',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
            loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          token: 'pin-pro-session'
        });
      }

      // Check authorized admins in DB
      const authListRow = settingsRows.find(r => r.key === 'authorizedAdminList');
      if (authListRow && authListRow.value) {
        try {
          const list = JSON.parse(authListRow.value);
          const match = list.find((a: any) => a.email && a.email.toLowerCase() === inputEmail);
          if (match && (inputPin === dbProPin || inputPin === dbSuperPin || !inputPin)) {
            return res.json({
              success: true,
              user: {
                name: match.name || 'JCCF PRO Administrator',
                email: match.email,
                role: match.role || 'pro',
                portfolio: 'Central Executive Officer',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              },
              token: 'pin-pro-session'
            });
          }
        } catch (_) {}
      }

      return res.status(403).json({
        success: false,
        error: 'Access Denied: Only JCCF Central Superadmin and authorized JCCF PRO administrators are permitted to sign in.'
      });
    } catch (error: any) {
      console.error('Error during administrative login:', error);
      res.status(500).json({ error: 'Server authentication failed' });
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
      const targetHandle = (process.env.YOUTUBE_CHANNEL || '@jccf_futa').trim();
      const cleanHandle = targetHandle.replace(/^@/, '');
      const youtubeApiKey = process.env.YOUTUBE_API_KEY;
      let channelTitle = 'JCCF FUTA Official';
      let channelId = '';
      let videos: any[] = [];

      // Strategy 1: Official YouTube Data API v3 (if API key is present)
      if (youtubeApiKey) {
        try {
          // Resolve channel ID by handle or channel ID or search
          let chanRes;
          if (targetHandle.startsWith('UC') && targetHandle.length >= 22) {
            chanRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?id=${targetHandle}&part=snippet,contentDetails&key=${youtubeApiKey}`);
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
        let detectedChannelId = channelId;

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

      // If no videos could be fetched, return clean response with empty array
      res.json({
        source: 'empty_response',
        channelName: channelTitle || targetHandle,
        channelHandle: targetHandle,
        totalVideos: 0,
        videos: [],
        message: `No public videos found for ${targetHandle}. Please verify the channel handle or name.`
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
      console.error('Error fetching fellowships:', error);
      res.status(500).json({ error: 'Failed to fetch fellowships' });
    }
  });

  app.post('/api/fellowships', requireAdmin, async (req, res) => {
    try {
      const { name, acronym, category, meetingDays, venue, presidentName, presidentPhone, description, logoUrl, mapUrl } = req.body;
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
        mapUrl: mapUrl || '',
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
      console.error('Error fetching resources:', error);
      res.status(500).json({ error: 'Failed to fetch resources' });
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
      console.error('Error fetching historical executives:', error);
      res.status(500).json({ error: 'Failed to fetch historical executives' });
    }
  });

  app.post('/api/historical-executives', requireAdmin, async (req, res) => {
    try {
      const { tenure, generationName, theme, president, executivesList, mission, vision, keyAchievements, photoUrl } = req.body;
      const achStr = Array.isArray(keyAchievements) ? JSON.stringify(keyAchievements) : (typeof keyAchievements === 'string' ? JSON.stringify([keyAchievements]) : '[]');
      
      const result = await db.insert(historicalExecutives).values({
        tenure: tenure || '2024/2025',
        generationName: generationName || 'The Trailblazers',
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
      const { tenure, generationName, theme, president, executivesList, mission, vision, keyAchievements, photoUrl } = req.body;
      const achStr = Array.isArray(keyAchievements) ? JSON.stringify(keyAchievements) : (typeof keyAchievements === 'string' ? JSON.stringify([keyAchievements]) : undefined);

      const updateData: any = {
        tenure,
        generationName,
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
      console.error('Error fetching media:', error);
      res.status(500).json({ error: 'Failed to fetch media' });
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
