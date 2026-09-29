import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  Announcement, 
  FellowshipEvent, 
  Fellowship, 
  ExecutiveLeader, 
  HistoricalExecutive,
  ResourceItem, 
  MediaItem, 
  ServiceUnit, 
  DonationRecord, 
  SystemSettings, 
  AuthorizedAdmin,
  AuditLog 
} from '../types';

import { 
  STATIC_UNITS 
} from '../data/static/index.ts';

export interface SuperAdminUser {
  name: string;
  email: string;
  role: 'Superadmin (Central Executive Council)' | 'PRO Directorate' | 'Secretariat Administrator';
  portfolio: string;
  avatar: string;
  loginTime: string;
}

export interface AppState {
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (item: Omit<Announcement, 'id'>) => Promise<Announcement>;
  updateAnnouncement: (id: string, item: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  // Media & YouTube Broadcasts
  mediaList: MediaItem[];
  youtubeChannel: string;
  isSyncingYouTube: boolean;
  fetchYouTubeVideos: (channelQuery?: string) => Promise<{ success: boolean; count: number; message: string; videos: MediaItem[] }>;
  addMedia: (item: Omit<MediaItem, 'id'>) => MediaItem;
  updateMedia: (id: string, item: Partial<MediaItem>) => void;
  deleteMedia: (id: string) => void;

  // Events
  events: FellowshipEvent[];
  addEvent: (item: Omit<FellowshipEvent, 'id'>) => Promise<FellowshipEvent>;
  updateEvent: (id: string, item: Partial<FellowshipEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Fellowships
  fellowships: Fellowship[];
  addFellowship: (item: Omit<Fellowship, 'id'>) => Promise<Fellowship>;
  updateFellowship: (id: string, item: Partial<Fellowship>) => Promise<void>;
  deleteFellowship: (id: string) => Promise<void>;

  // Executives
  executives: ExecutiveLeader[];
  addExecutive: (item: Omit<ExecutiveLeader, 'id'>) => Promise<ExecutiveLeader>;
  updateExecutive: (id: string, item: Partial<ExecutiveLeader>) => Promise<void>;
  deleteExecutive: (id: string) => Promise<void>;

  // Historical / Past Executives
  historicalExecutives: HistoricalExecutive[];
  addHistoricalExecutive: (item: HistoricalExecutive) => Promise<void>;
  updateHistoricalExecutive: (tenureOrId: string, item: Partial<HistoricalExecutive>) => Promise<void>;
  deleteHistoricalExecutive: (tenureOrId: string) => Promise<void>;
  performHandover: (handoverData: {
    generationName: string;
    generation: string;
    tenure: string;
    theme?: string;
    mission?: string;
    vision?: string;
    keyAchievements?: string[];
    photoUrl?: string;
  }) => Promise<{ success: boolean; message: string }>;

  // Resources
  resources: ResourceItem[];
  addResource: (item: Omit<ResourceItem, 'id'>) => Promise<ResourceItem>;
  updateResource: (id: string, item: Partial<ResourceItem>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  incrementResourceDownload: (id: string) => Promise<void>;

  // Service Units
  serviceUnits: ServiceUnit[];

  // Donations & Payments
  donations: DonationRecord[];
  recordDonation: (donation: Omit<DonationRecord, 'id' | 'date'>) => Promise<DonationRecord>;
  deleteDonation: (id: string) => void;
  initializePaymentSession: (data: {
    amount: number;
    purpose: string;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    paymentMethod: string;
  }) => Promise<{ reference: string; transaction: any }>;
  verifyPaymentSession: (reference: string, details?: string) => Promise<DonationRecord>;

  // System Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;

  // Authorized Administrators & Access Control
  authorizedAdmins: AuthorizedAdmin[];
  addAuthorizedAdmin: (admin: { email: string; name: string; role: 'superadmin' | 'admin' | 'executive' }) => Promise<void>;
  removeAuthorizedAdmin: (email: string) => Promise<void>;
  updateSecurityPins: (pins: { superadminPin?: string; executivePin?: string }) => Promise<void>;
  changeAdminPassword: (targetUidOrEmail: string, newPassword: string) => Promise<{ success: boolean; message: string }>;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, target: string, type: AuditLog['type']) => void;

  // Superadmin Auth State
  isSuperAdmin: boolean;
  superAdminUser: SuperAdminUser | null;
  adminToken: string | null;
  loginSuperAdmin: (keyOrEmail: string, pass?: string) => Promise<{ success: boolean; message: string }>;
  logoutSuperAdmin: () => void;

  // DB Sync State
  isSyncing: boolean;
  fetchDbData: () => Promise<void>;

  // Reset
  resetToFactoryDefaults: () => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  academicSession: '2025/2026 Academic Session',
  annualTheme: 'Reigning by Grace & Wisdom',
  themeScripture: 'Romans 5:17 • Daniel 1:17',
  officeEmail: 'futajccf@gmail.com',
  officePhone: '+234 813 456 7890',
  chapelAddress: 'JCCF Secretariat, Near ETF Lecture Theatre, FUTA South Gate',
  superadminPin: '1945',
  superadminEmail: 'jayeobapeace19459@gmail.com',
  opayMerchantAccount: '6110293847',
  opayMerchantName: 'JCCF FUTA / Central Finance',
  palmpayMerchantAccount: '9038475620',
  palmpayMerchantName: 'JCCF FUTA Giving Hub'
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      announcements: [],
      mediaList: [],
      youtubeChannel: '@jccf_futa',
      isSyncingYouTube: false,
      events: [],
      fellowships: [],
      executives: [],
      historicalExecutives: [],
      resources: [],
      serviceUnits: STATIC_UNITS,
      donations: [],
      settings: DEFAULT_SETTINGS,
      authorizedAdmins: [
        {
          email: 'jayeobapeace19459@gmail.com',
          name: 'Jayeoba Peace Olamide (Primary Superadmin)',
          role: 'superadmin',
          addedAt: 'Aug 25, 2026',
          addedBy: 'Central Executive Council'
        }
      ],
      auditLogs: [],
      isSyncing: false,
      isSuperAdmin: false,
      superAdminUser: null,
      adminToken: null,

      addAuditLog: (action, target, type) => {
        const adminName = get().superAdminUser?.name || 'Administrator';
        const newLog: AuditLog = {
          id: 'log-' + Date.now(),
          adminName,
          action,
          target,
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' +
                     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type
        };
        set(state => ({ auditLogs: [newLog, ...state.auditLogs.slice(0, 49)] }));
      },

      fetchDbData: async () => {
        set({ isSyncing: true });
        try {
          // Announcements
          const resAnn = await fetch('/api/announcements');
          if (resAnn.ok) {
            const data = await resAnn.json();
            if (Array.isArray(data)) {
              const mapped: Announcement[] = data.map((d: any) => ({
                id: String(d.id),
                title: d.title,
                content: d.content,
                summary: (d.content || '').slice(0, 140) + '...',
                category: d.category || 'Official Notice',
                date: d.date,
                author: d.author,
                isFeatured: Boolean(d.pinned),
                badgeColor: d.category === 'Mega Praise' ? 'red' : 'neutral'
              }));
              set({ announcements: mapped });
            }
          }

          // Events
          const resEv = await fetch('/api/events');
          if (resEv.ok) {
            const data = await resEv.json();
            if (Array.isArray(data)) {
              const mapped: FellowshipEvent[] = data.map((d: any) => ({
                id: String(d.id),
                title: d.title,
                theme: d.theme,
                category: d.category || 'Mega Service',
                date: d.date,
                time: d.time,
                venue: d.venue,
                description: d.description,
                isUpcoming: true,
                isFeatured: Boolean(d.featured),
                image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&fit=crop'
              }));
              set({ events: mapped });
            }
          }

          // Fellowships (Member Fellowships)
          const resFel = await fetch('/api/fellowships');
          if (resFel.ok) {
            const data = await resFel.json();
            if (Array.isArray(data)) {
              const mapped: Fellowship[] = data.map((d: any) => ({
                id: String(d.id),
                name: d.name,
                acronym: d.acronym,
                motto: d.motto || 'Knowing Christ and Making Him Known',
                category: d.category || 'Denominational',
                meetingVenue: d.venue || d.meeting_days || 'FUTA Campus',
                meetingDays: d.meetingDays || d.meeting_days || 'Sundays & Midweek',
                meetingTime: d.meetingTime || '5:30 PM',
                presidentName: d.presidentName || d.president_name || 'Fellowship President',
                presidentContact: d.presidentPhone || d.president_phone || '+234 800 000 0000',
                bannerImage: d.logoUrl || d.logo_url || 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&fit=crop',
                description: d.description || 'Campus Christian fellowship operating under JCCF FUTA.',
                establishedYear: d.establishedYear || '1995',
                futaLocation: d.venue || d.futaLocation || 'FUTA Campus',
                mapUrl: d.mapUrl || d.map_url || (d.name ? `https://maps.google.com/?q=${encodeURIComponent(d.name + ' FUTA Akure')}` : undefined),
                membershipSize: d.membershipSize || '350+ Students'
              }));
              set({ fellowships: mapped });
            }
          }

          // Executives
          const resExec = await fetch('/api/executives');
          if (resExec.ok) {
            const data = await resExec.json();
            if (Array.isArray(data)) {
              const mapped: ExecutiveLeader[] = data.map((d: any) => ({
                id: String(d.id),
                name: d.name,
                office: d.office,
                department: d.department,
                level: d.level,
                phone: d.phone,
                email: d.email,
                photoUrl: d.photoUrl || d.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop',
                quote: d.bio || 'Leading with kingdom purpose and integrity in FUTA.',
                tenure: d.session || '2025/2026'
              }));
              set({ executives: mapped });
            }
          }

          // Historical Executives
          const resHist = await fetch('/api/historical-executives');
          if (resHist.ok) {
            const data = await resHist.json();
            if (Array.isArray(data)) {
              const mapped: HistoricalExecutive[] = data.map((d: any) => ({
                id: String(d.id),
                tenure: d.tenure,
                generationName: d.generationName || d.generation_name,
                generation: d.generation || '',
                theme: d.theme,
                president: d.president,
                executivesList: d.executivesList || d.executives_list,
                mission: d.mission,
                vision: d.vision,
                keyAchievements: Array.isArray(d.keyAchievements) 
                  ? d.keyAchievements 
                  : (typeof d.keyAchievements === 'string' ? JSON.parse(d.keyAchievements || '[]') : []),
                photoUrl: d.photoUrl || d.photo_url
              }));
              set({ historicalExecutives: mapped });
            }
          }

          // Resources
          const resRes = await fetch('/api/resources');
          if (resRes.ok) {
            const data = await resRes.json();
            if (Array.isArray(data)) {
              const mapped: ResourceItem[] = data.map((d: any) => ({
                id: String(d.id),
                title: d.title,
                category: d.category || 'Documents',
                fileType: (d.format || 'PDF') as any,
                fileSize: d.fileSize || d.file_size || '1.5 MB',
                downloadCount: Number(d.downloadsCount || d.downloads_count) || 0,
                dateAdded: d.created_at ? new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
                description: d.description || '',
                downloadUrl: d.downloadUrl || d.download_url || '#'
              }));
              set({ resources: mapped });
            }
          }

          // Media
          const resMed = await fetch('/api/media');
          if (resMed.ok) {
            const data = await resMed.json();
            if (Array.isArray(data)) {
              const mapped: MediaItem[] = data.map((d: any) => ({
                id: String(d.id),
                title: d.title,
                category: d.category || 'Sermon',
                duration: d.duration || 'Broadcast',
                date: d.date || 'Recent',
                minister: d.minister || 'JCCF FUTA',
                thumbnail: d.thumbnail || `https://img.youtube.com/vi/${d.youtubeId || d.youtube_id}/hqdefault.jpg`,
                youtubeId: d.youtubeId || d.youtube_id || '',
                description: d.description || '',
                views: d.views || '1.5K views'
              }));
              set({ mediaList: mapped });
            }
          }

          // Donations (if admin)
          const token = get().adminToken;
          if (token) {
            try {
              const resDon = await fetch('/api/donations', {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              if (resDon.ok) {
                const donData = await resDon.json();
                if (donData && Array.isArray(donData.donations)) {
                  set({ donations: donData.donations });
                }
              }
            } catch (_) {}
          }

          // Settings
          const resSet = await fetch('/api/settings');
          if (resSet.ok) {
            const data = await resSet.json();
            if (data && typeof data === 'object' && Object.keys(data).length > 0) {
              set(state => ({
                settings: {
                  ...state.settings,
                  ...data
                }
              }));
            }
          }
        } catch (err) {
          console.warn('Store fetchDbData notice:', err);
        } finally {
          set({ isSyncing: false });
        }
      },

      // --- ANNOUNCEMENTS ---
      addAnnouncement: async (item) => {
        const tempId = 'ann-' + Date.now();
        const newRecord: Announcement = { ...item, id: tempId };
        set(state => ({ announcements: [newRecord, ...state.announcements] }));

        try {
          const token = get().adminToken;
          const res = await fetch('/api/announcements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              title: item.title,
              content: item.content,
              category: item.category,
              date: item.date,
              author: item.author,
              pinned: item.isFeatured
            })
          });
          if (res.ok) {
            const saved = await res.json();
            const realId = String(saved.id);
            set(state => ({
              announcements: state.announcements.map(a => a.id === tempId ? { ...a, id: realId } : a)
            }));
            newRecord.id = realId;
          }
        } catch (err) {
          console.warn('Store addAnnouncement sync notice:', err);
        }
        get().addAuditLog('Created announcement', item.title, 'create');
        return newRecord;
      },

      updateAnnouncement: async (id, updated) => {
        set(state => ({
          announcements: state.announcements.map(a => a.id === id ? { ...a, ...updated } : a)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/announcements/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(updated)
          });
        } catch (err) {
          console.warn('Store updateAnnouncement notice:', err);
        }
        get().addAuditLog('Updated announcement', updated.title || id, 'update');
      },

      deleteAnnouncement: async (id) => {
        const target = get().announcements.find(a => a.id === id);
        set(state => ({
          announcements: state.announcements.filter(a => a.id !== id)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/announcements/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
        } catch (err) {
          console.warn('Store deleteAnnouncement notice:', err);
        }
        get().addAuditLog('Deleted announcement', target?.title || id, 'delete');
      },

      // --- FELLOWSHIPS (Persistent Registration) ---
      addFellowship: async (item) => {
        const tempId = 'fel-' + Date.now();
        let newRecord: Fellowship = { ...item, id: tempId };
        set(state => ({ fellowships: [...state.fellowships, newRecord] }));

        try {
          const token = get().adminToken;
          let res = await fetch('/api/fellowships', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              name: item.name,
              acronym: item.acronym,
              category: item.category,
              meetingDays: item.meetingDays,
              venue: item.meetingVenue,
              presidentName: item.presidentName,
              presidentPhone: item.presidentContact,
              description: item.description,
              logoUrl: item.bannerImage,
              mapUrl: item.mapUrl || ''
            })
          });

          if (!res.ok) {
            // Direct public registration fallback
            res = await fetch('/api/fellowships/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: item.name,
                acronym: item.acronym,
                category: item.category,
                meetingDays: item.meetingDays,
                venue: item.meetingVenue,
                presidentName: item.presidentName,
                presidentPhone: item.presidentContact,
                description: item.description,
                logoUrl: item.bannerImage,
                mapUrl: item.mapUrl || ''
              })
            });
          }

          if (res.ok) {
            const saved = await res.json();
            const realId = String(saved.id);
            newRecord = { ...newRecord, id: realId };
            set(state => ({
              fellowships: state.fellowships.map(f => f.id === tempId ? { ...f, id: realId } : f)
            }));
          }
        } catch (err) {
          console.warn('Store addFellowship notice:', err);
        }
        get().addAuditLog('Registered member fellowship', item.name, 'create');
        return newRecord;
      },

      updateFellowship: async (id, updated) => {
        set(state => ({
          fellowships: state.fellowships.map(f => f.id === id ? { ...f, ...updated } : f)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/fellowships/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              name: updated.name,
              acronym: updated.acronym,
              category: updated.category,
              meetingDays: updated.meetingDays,
              venue: updated.meetingVenue,
              presidentName: updated.presidentName,
              presidentPhone: updated.presidentContact,
              description: updated.description,
              logoUrl: updated.bannerImage,
              mapUrl: updated.mapUrl || ''
            })
          });
        } catch (err) {
          console.warn('Store updateFellowship notice:', err);
        }
        get().addAuditLog('Updated fellowship profile', updated.name || id, 'update');
      },

      deleteFellowship: async (id) => {
        const target = get().fellowships.find(f => f.id === id);
        set(state => ({
          fellowships: state.fellowships.filter(f => f.id !== id)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/fellowships/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
        } catch (err) {
          console.warn('Store deleteFellowship notice:', err);
        }
        get().addAuditLog('Deleted fellowship profile', target?.name || id, 'delete');
      },

      // --- EVENTS ---
      addEvent: async (item) => {
        const tempId = 'ev-' + Date.now();
        const newRecord: FellowshipEvent = { ...item, id: tempId };
        set(state => ({ events: [newRecord, ...state.events] }));
        try {
          const token = get().adminToken;
          const res = await fetch('/api/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              title: item.title,
              theme: item.theme,
              date: item.date,
              time: item.time,
              venue: item.venue,
              category: item.category,
              description: item.description,
              featured: item.isFeatured
            })
          });
          if (res.ok) {
            const saved = await res.json();
            const realId = String(saved.id);
            newRecord.id = realId;
            set(state => ({
              events: state.events.map(e => e.id === tempId ? { ...e, id: realId } : e)
            }));
          }
        } catch (err) {
          console.warn('Store addEvent notice:', err);
        }
        get().addAuditLog('Added calendar event', item.title, 'create');
        return newRecord;
      },

      updateEvent: async (id, updated) => {
        set(state => ({
          events: state.events.map(e => e.id === id ? { ...e, ...updated } : e)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/events/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(updated)
          });
        } catch (err) {
          console.warn('Store updateEvent notice:', err);
        }
        get().addAuditLog('Updated event details', updated.title || id, 'update');
      },

      deleteEvent: async (id) => {
        const target = get().events.find(e => e.id === id);
        set(state => ({
          events: state.events.filter(e => e.id !== id)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/events/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
        } catch (err) {
          console.warn('Store deleteEvent notice:', err);
        }
        get().addAuditLog('Deleted event', target?.title || id, 'delete');
      },

      // --- EXECUTIVES ---
      addExecutive: async (item) => {
        const tempId = 'exec-' + Date.now();
        const newRecord: ExecutiveLeader = { ...item, id: tempId };
        set(state => ({ executives: [...state.executives, newRecord] }));
        try {
          const token = get().adminToken;
          const res = await fetch('/api/executives', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              name: item.name,
              office: item.office,
              department: item.department,
              level: item.level,
              phone: item.phone,
              email: item.email,
              session: item.tenure || '2025/2026',
              fellowship: 'JCCF FUTA',
              photoUrl: item.photoUrl,
              bio: item.quote
            })
          });
          if (res.ok) {
            const saved = await res.json();
            const realId = String(saved.id);
            newRecord.id = realId;
            set(state => ({
              executives: state.executives.map(e => e.id === tempId ? { ...e, id: realId } : e)
            }));
          }
        } catch (err) {
          console.warn('Store addExecutive notice:', err);
        }
        get().addAuditLog('Appointed executive member', `${item.name} (${item.office})`, 'create');
        return newRecord;
      },

      updateExecutive: async (id, updated) => {
        set(state => ({
          executives: state.executives.map(e => e.id === id ? { ...e, ...updated } : e)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/executives/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(updated)
          });
        } catch (err) {
          console.warn('Store updateExecutive notice:', err);
        }
        get().addAuditLog('Updated executive portfolio', updated.name || id, 'update');
      },

      deleteExecutive: async (id) => {
        const target = get().executives.find(e => e.id === id);
        set(state => ({
          executives: state.executives.filter(e => e.id !== id)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/executives/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
        } catch (err) {
          console.warn('Store deleteExecutive notice:', err);
        }
        get().addAuditLog('Removed executive from council', target?.name || id, 'delete');
      },

      // --- HISTORICAL EXECUTIVES ---
      addHistoricalExecutive: async (item) => {
        const tempId = 'hist-' + Date.now();
        const record = { ...item, id: item.id || tempId };
        set(state => ({
          historicalExecutives: [record, ...state.historicalExecutives]
        }));
        try {
          const token = get().adminToken;
          await fetch('/api/historical-executives', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(item)
          });
        } catch (err) {
          console.warn('Store addHistoricalExecutive notice:', err);
        }
        get().addAuditLog('Archived historical generation', item.generationName || item.tenure, 'create');
      },

      updateHistoricalExecutive: async (tenureOrId, updated) => {
        set(state => ({
          historicalExecutives: state.historicalExecutives.map(h => 
            (h.id === tenureOrId || h.tenure === tenureOrId) ? { ...h, ...updated } : h
          )
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/historical-executives/${tenureOrId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(updated)
          });
        } catch (err) {
          console.warn('Store updateHistoricalExecutive notice:', err);
        }
        get().addAuditLog('Updated historical generation', updated.generationName || tenureOrId, 'update');
      },

      deleteHistoricalExecutive: async (tenureOrId) => {
        set(state => ({
          historicalExecutives: state.historicalExecutives.filter(h => h.id !== tenureOrId && h.tenure !== tenureOrId)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/historical-executives/${tenureOrId}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
        } catch (err) {
          console.warn('Store deleteHistoricalExecutive notice:', err);
        }
        get().addAuditLog('Deleted historical generation archive', tenureOrId, 'delete');
      },

      performHandover: async (data) => {
        try {
          const token = get().adminToken;
          const res = await fetch('/api/admin/executives/handover', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data)
          });
          if (res.ok) {
            await get().fetchDbData();
            return { success: true, message: 'Handover executed successfully.' };
          }
        } catch (err: any) {
          return { success: false, message: err.message || 'Handover failed' };
        }
        return { success: false, message: 'Handover operation could not be completed.' };
      },

      // --- MEDIA & YOUTUBE ---
      fetchYouTubeVideos: async (channelQuery) => {
        set({ isSyncingYouTube: true });
        const target = channelQuery || get().youtubeChannel || '@jccf_futa';
        try {
          const res = await fetch(`/api/youtube/channel-videos?channel=${encodeURIComponent(target)}`);
          if (res.ok) {
            const data = await res.json();
            const incoming: MediaItem[] = data.videos || [];
            if (incoming.length > 0) {
              set(state => {
                const ytIds = new Set(incoming.map(m => m.youtubeId));
                const custom = state.mediaList.filter(p => !p.id.startsWith('yt-') && !ytIds.has(p.youtubeId));
                return {
                  mediaList: [...incoming, ...custom],
                  youtubeChannel: data.channelHandle || target,
                  isSyncingYouTube: false
                };
              });
              get().addAuditLog(`Synced YouTube channel: ${data.channelName || target}`, `${incoming.length} videos`, 'update');
              return {
                success: true,
                count: incoming.length,
                message: `Loaded ${incoming.length} video broadcasts`,
                videos: incoming
              };
            }
          }
        } catch (err) {
          console.warn('YouTube channel fetch notice:', err);
        } finally {
          set({ isSyncingYouTube: false });
        }
        return {
          success: false,
          count: 0,
          message: 'Unable to stream videos from YouTube channel',
          videos: []
        };
      },

      addMedia: (item) => {
        const newRecord: MediaItem = { ...item, id: 'med-' + Date.now() };
        set(state => ({ mediaList: [newRecord, ...state.mediaList] }));
        (async () => {
          try {
            const token = get().adminToken;
            await fetch('/api/media', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify(item)
            });
          } catch (_) {}
        })();
        get().addAuditLog('Added media sermon/broadcast', item.title, 'create');
        return newRecord;
      },

      updateMedia: (id, item) => {
        set(state => ({
          mediaList: state.mediaList.map(m => m.id === id ? { ...m, ...item } : m)
        }));
        (async () => {
          try {
            const token = get().adminToken;
            await fetch(`/api/media/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify(item)
            });
          } catch (_) {}
        })();
        get().addAuditLog('Updated media record', item.title || id, 'update');
      },

      deleteMedia: (id) => {
        const target = get().mediaList.find(m => m.id === id);
        set(state => ({
          mediaList: state.mediaList.filter(m => m.id !== id)
        }));
        (async () => {
          try {
            const token = get().adminToken;
            await fetch(`/api/media/${id}`, {
              method: 'DELETE',
              headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              }
            });
          } catch (_) {}
        })();
        get().addAuditLog('Deleted media record', target?.title || id, 'delete');
      },

      // --- RESOURCES ---
      addResource: async (item) => {
        const tempId = 'res-' + Date.now();
        const newRecord: ResourceItem = { ...item, id: tempId };
        set(state => ({ resources: [newRecord, ...state.resources] }));
        try {
          const token = get().adminToken;
          const res = await fetch('/api/resources', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(item)
          });
          if (res.ok) {
            const saved = await res.json();
            const realId = String(saved.id);
            newRecord.id = realId;
            set(state => ({
              resources: state.resources.map(r => r.id === tempId ? { ...r, id: realId } : r)
            }));
          }
        } catch (err) {
          console.warn('Store addResource notice:', err);
        }
        get().addAuditLog('Uploaded ministry resource', item.title, 'create');
        return newRecord;
      },

      updateResource: async (id, updated) => {
        set(state => ({
          resources: state.resources.map(r => r.id === id ? { ...r, ...updated } : r)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/resources/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(updated)
          });
        } catch (err) {
          console.warn('Store updateResource notice:', err);
        }
        get().addAuditLog('Updated resource info', updated.title || id, 'update');
      },

      deleteResource: async (id) => {
        const target = get().resources.find(r => r.id === id);
        set(state => ({
          resources: state.resources.filter(r => r.id !== id)
        }));
        try {
          const token = get().adminToken;
          await fetch(`/api/resources/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });
        } catch (err) {
          console.warn('Store deleteResource notice:', err);
        }
        get().addAuditLog('Deleted resource document', target?.title || id, 'delete');
      },

      incrementResourceDownload: async (id) => {
        set(state => ({
          resources: state.resources.map(r => r.id === id ? { ...r, downloadCount: r.downloadCount + 1 } : r)
        }));
        try {
          await fetch(`/api/resources/${id}/download`, { method: 'POST' });
        } catch (_) {}
      },

      // --- DONATIONS ---
      recordDonation: async (donation) => {
        const newRecord: DonationRecord = {
          ...donation,
          id: 'DON-' + Date.now(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' +
                new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        set(state => ({ donations: [newRecord, ...state.donations] }));
        try {
          await fetch('/api/donations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord)
          });
        } catch (_) {}
        get().addAuditLog('Received sacrificial giving donation', `₦${newRecord.amount.toLocaleString()} from ${newRecord.donorName}`, 'create');
        return newRecord;
      },

      deleteDonation: (id) => {
        set(state => ({
          donations: state.donations.filter(d => d.id !== id)
        }));
      },

      initializePaymentSession: async (data) => {
        const res = await fetch('/api/donations/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Could not initialize transaction checkout');
        return await res.json();
      },

      verifyPaymentSession: async (reference, details) => {
        const res = await fetch('/api/donations/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, details })
        });
        if (!res.ok) throw new Error('Transaction verification failed');
        const record = await res.json();
        set(state => ({
          donations: [record, ...state.donations.filter(d => d.reference !== reference)]
        }));
        return record;
      },

      // --- SETTINGS ---
      updateSettings: async (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
        try {
          const token = get().adminToken;
          await fetch('/api/settings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(newSettings)
          });
        } catch (err) {
          console.warn('Store updateSettings notice:', err);
        }
        get().addAuditLog('Updated global system settings', 'Secretariat & Theme Settings', 'settings');
      },

      // --- ACCESS CONTROL & ADMIN MANAGEMENT ---
      addAuthorizedAdmin: async (admin) => {
        const newAdmin: AuthorizedAdmin = {
          ...admin,
          addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          addedBy: get().superAdminUser?.name || 'Central Executive'
        };
        set(state => ({
          authorizedAdmins: [...state.authorizedAdmins.filter(a => a.email.toLowerCase() !== admin.email.toLowerCase()), newAdmin]
        }));
        get().addAuditLog('Assigned administrator credentials', `${admin.name} (${admin.email})`, 'create');
      },

      removeAuthorizedAdmin: async (email) => {
        set(state => ({
          authorizedAdmins: state.authorizedAdmins.filter(a => a.email.toLowerCase() !== email.toLowerCase())
        }));
        get().addAuditLog('Revoked administrator credentials', email, 'delete');
      },

      updateSecurityPins: async (pins) => {
        set(state => ({
          settings: {
            ...state.settings,
            superadminPin: pins.superadminPin || state.settings.superadminPin,
            executivePin: pins.executivePin || state.settings.executivePin
          }
        }));
        get().addAuditLog('Rotated security credentials', 'Administrative Gatekeeper PINs', 'settings');
      },

      changeAdminPassword: async (targetUidOrEmail, newPassword) => {
        try {
          const token = get().adminToken;
          const res = await fetch('/api/admin/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              email: targetUidOrEmail.includes('@') ? targetUidOrEmail : undefined,
              uid: !targetUidOrEmail.includes('@') ? targetUidOrEmail : undefined,
              password: newPassword
            })
          });
          const data = await res.json();
          if (res.ok) {
            get().addAuditLog('Changed administrator password (hashed)', targetUidOrEmail, 'settings');
            return { success: true, message: data.message || 'Password updated successfully' };
          }
          return { success: false, message: data.error || 'Failed to update password' };
        } catch (err: any) {
          return { success: false, message: err.message || 'Network error' };
        }
      },

      // --- ADMIN LOGIN / LOGOUT ---
      loginSuperAdmin: async (identifier, secret) => {
        try {
          const res = await fetch('/api/auth/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, secret: secret || identifier })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            const user: SuperAdminUser = {
              name: data.user.name,
              email: data.user.email,
              role: data.user.role === 'admin' ? 'PRO Directorate' : 'Superadmin (Central Executive Council)',
              portfolio: data.user.portfolio,
              avatar: data.user.avatar,
              loginTime: data.user.loginTime
            };
            set({
              isSuperAdmin: true,
              superAdminUser: user,
              adminToken: data.token
            });
            get().addAuditLog('Administrator Authenticated', user.email, 'auth');
            return { success: true, message: 'Authentication successful' };
          }
          return { success: false, message: data.error || 'Invalid credentials' };
        } catch (err: any) {
          return { success: false, message: err.message || 'Login connection failed' };
        }
      },

      logoutSuperAdmin: () => {
        const user = get().superAdminUser;
        if (user) {
          get().addAuditLog('Administrator Signed Out', user.email, 'auth');
        }
        set({
          isSuperAdmin: false,
          superAdminUser: null,
          adminToken: null
        });
      },

      resetToFactoryDefaults: () => {
        set({
          announcements: [],
          events: [],
          fellowships: [],
          executives: [],
          historicalExecutives: [],
          mediaList: [],
          resources: [],
          settings: DEFAULT_SETTINGS,
          donations: []
        });
        get().addAuditLog('Reset store to clean empty state', 'System Reset', 'settings');
      }
    }),
    {
      name: 'jccf_futa_app_store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        announcements: state.announcements,
        events: state.events,
        fellowships: state.fellowships,
        executives: state.executives,
        historicalExecutives: state.historicalExecutives,
        mediaList: state.mediaList,
        resources: state.resources,
        donations: state.donations,
        settings: state.settings,
        authorizedAdmins: state.authorizedAdmins,
        auditLogs: state.auditLogs,
        youtubeChannel: state.youtubeChannel,
        isSuperAdmin: state.isSuperAdmin,
        superAdminUser: state.superAdminUser,
        adminToken: state.adminToken
      })
    }
  )
);
