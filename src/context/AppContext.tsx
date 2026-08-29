import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

import { ANNOUNCEMENTS } from '../data/announcements';
import { JCCF_EVENTS } from '../data/events';
import { MEMBER_FELLOWSHIPS } from '../data/fellowships';
import { CENTRAL_EXECUTIVES, HISTORICAL_EXECUTIVES } from '../data/executives';
import { RESOURCES_LIST } from '../data/resources';
import { MEDIA_RECORDS } from '../data/media';
import { SERVICE_UNITS } from '../data/units';
import { useAuth } from './AuthContext';

export interface SuperAdminUser {
  name: string;
  email: string;
  role: 'Superadmin (Central Executive Council)' | 'PRO Directorate' | 'Secretariat Administrator';
  portfolio: string;
  avatar: string;
  loginTime: string;
}

interface AppContextType {
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

  // Past / Historical Executives
  historicalExecutives: HistoricalExecutive[];
  addHistoricalExecutive: (item: HistoricalExecutive) => Promise<void>;
  updateHistoricalExecutive: (tenureOrId: string, item: Partial<HistoricalExecutive>) => Promise<void>;
  deleteHistoricalExecutive: (tenureOrId: string) => Promise<void>;

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

  // Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;

  // Authorized Administrators & Access Control
  authorizedAdmins: AuthorizedAdmin[];
  addAuthorizedAdmin: (admin: { email: string; name: string; role: 'superadmin' | 'admin' | 'executive' }) => Promise<void>;
  removeAuthorizedAdmin: (email: string) => Promise<void>;
  updateSecurityPins: (pins: { superadminPin?: string; executivePin?: string }) => Promise<void>;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, target: string, type: AuditLog['type']) => void;

  // Superadmin Auth
  isSuperAdmin: boolean;
  superAdminUser: SuperAdminUser | null;
  loginSuperAdmin: (keyOrEmail: string, pass?: string) => Promise<{ success: boolean; message: string }>;
  logoutSuperAdmin: () => void;

  // DB Sync
  isSyncing: boolean;
  fetchDbData: () => Promise<void>;

  // Reset
  resetToFactoryDefaults: () => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  academicSession: '2025/2026 Academic Session',
  annualTheme: 'Reigning by Grace & Wisdom',
  themeScripture: 'Romans 5:17 • Daniel 1:17',
  officeEmail: 'secretariat.jccf@futa.edu.ng',
  officePhone: '+234 813 456 7890',
  chapelAddress: 'JCCF Secretariat, Near ETF Lecture Theatre, FUTA South Gate',
  superadminPin: '778899',
  superadminEmail: 'jayeobapeace19459@gmail.com',
  opayMerchantAccount: '6110293847',
  opayMerchantName: 'JCCF FUTA / Central Finance',
  palmpayMerchantAccount: '9038475620',
  palmpayMerchantName: 'JCCF FUTA Giving Hub'
};

const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'DON-101',
    donorName: 'Bro. Emmanuel Adeleke (President)',
    donorEmail: 'e.adeleke@futa.edu.ng',
    donorPhone: '08145569021',
    amount: 50000,
    purpose: 'Student Welfare Food Bank & Indigent Support',
    date: 'Aug 25, 2026 11:30 AM',
    reference: 'OPAY-99281048',
    paymentMethod: 'OPay',
    status: 'Completed',
    channelDetails: 'Direct OPay Instant Merchant Checkout'
  },
  {
    id: 'DON-102',
    donorName: 'Sis. Abigail Danladi',
    donorEmail: 'abigail.danladi@gmail.com',
    donorPhone: '08031234567',
    amount: 35000,
    purpose: 'Mega Praise 2026 Logistics & Sound',
    date: 'Aug 24, 2026 04:15 PM',
    reference: 'PLMP-44820199',
    paymentMethod: 'PalmPay',
    status: 'Completed',
    channelDetails: 'PalmPay Wallet Direct Transfer'
  },
  {
    id: 'DON-103',
    donorName: 'Engr. Toluwani Davies (Alumnus, Class of 2020)',
    donorEmail: 'tolu.davies@alumni.futa.edu.ng',
    donorPhone: '08169988776',
    amount: 150000,
    purpose: 'Campus Media & Multi-Camera Live Stream Rig',
    date: 'Aug 23, 2026 09:40 AM',
    reference: 'BNK-77182930',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    channelDetails: 'Guaranty Trust Bank (GTBank) Direct Wire'
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    adminName: 'Superadmin (Central Executive)',
    action: 'Logged into Central Superadmin Console',
    target: 'Authentication Gate',
    timestamp: 'Aug 25, 2026 12:00 PM',
    type: 'auth'
  },
  {
    id: 'log-2',
    adminName: 'Public Relations Officer',
    action: 'Published Official Circular',
    target: 'JCCF Annual Mega Praise 2026 Date Announcement',
    timestamp: 'Aug 24, 2026 02:15 PM',
    type: 'create'
  }
];

// LocalStorage deleted records helper
const getDeletedIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem('jccf_deleted_ids');
    if (raw) return new Set(JSON.parse(raw));
  } catch (_) {}
  return new Set();
};

const markIdDeleted = (id: string, altKey?: string) => {
  try {
    const deleted = getDeletedIds();
    if (id) deleted.add(String(id));
    if (altKey) deleted.add(String(altKey));
    localStorage.setItem('jccf_deleted_ids', JSON.stringify(Array.from(deleted)));
  } catch (_) {}
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { idToken, currentUser, isSuperAdmin: isAuthSuperAdmin } = useAuth();

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const deleted = getDeletedIds();
    return ANNOUNCEMENTS.filter(a => !deleted.has(a.id) && !deleted.has(a.title));
  });
  const [mediaList, setMediaList] = useState<MediaItem[]>(() => {
    const deleted = getDeletedIds();
    try {
      const cached = localStorage.getItem('jccf_cached_videos');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(m => !deleted.has(m.id) && !deleted.has(m.title));
          if (valid.length > 0) return valid;
        }
      }
    } catch (_) {}
    return MEDIA_RECORDS.filter(m => !deleted.has(m.id) && !deleted.has(m.title));
  });
  const [events, setEvents] = useState<FellowshipEvent[]>(() => {
    const deleted = getDeletedIds();
    return JCCF_EVENTS.filter(e => !deleted.has(e.id) && !deleted.has(e.title));
  });
  const [fellowships, setFellowships] = useState<Fellowship[]>(() => {
    const deleted = getDeletedIds();
    return MEMBER_FELLOWSHIPS.filter(f => !deleted.has(f.id) && !deleted.has(f.name) && !deleted.has(f.acronym));
  });
  const [executives, setExecutives] = useState<ExecutiveLeader[]>(() => {
    const deleted = getDeletedIds();
    return CENTRAL_EXECUTIVES.filter(e => !deleted.has(e.id) && !deleted.has(e.name));
  });
  const [resources, setResources] = useState<ResourceItem[]>(() => {
    const deleted = getDeletedIds();
    return RESOURCES_LIST.filter(r => !deleted.has(r.id) && !deleted.has(r.title));
  });
  const [historicalExecutives, setHistoricalExecutives] = useState<HistoricalExecutive[]>(() => {
    try {
      const saved = localStorage.getItem('jccf_historical_executives');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return HISTORICAL_EXECUTIVES;
  });
  const [youtubeChannel, setYoutubeChannel] = useState<string>(() => {
    const saved = localStorage.getItem('jccf_youtube_channel');
    if (saved && saved !== '@jccffuta') return saved;
    return '@jccf_futa';
  });
  const [isSyncingYouTube, setIsSyncingYouTube] = useState<boolean>(false);
  const [serviceUnits] = useState<ServiceUnit[]>(SERVICE_UNITS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [authorizedAdmins, setAuthorizedAdmins] = useState<AuthorizedAdmin[]>([
    {
      email: 'jayeobapeace19459@gmail.com',
      name: 'Jayeoba Peace Olamide (Primary PRO Superadmin)',
      role: 'superadmin',
      addedAt: 'Aug 25, 2026',
      addedBy: 'Central Executive Council'
    }
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [isSyncing, setIsSyncing] = useState(false);

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('jccf_admin_token') || localStorage.getItem('jccf_admin_token') || null;
  });

  // Manual or PIN Superadmin session state
  const [pinAdminActive, setPinAdminActive] = useState<boolean>(() => {
    return (sessionStorage.getItem('jccf_superadmin_session') === 'active' || localStorage.getItem('jccf_superadmin_session') === 'active') && 
      !!(sessionStorage.getItem('jccf_admin_token') || localStorage.getItem('jccf_admin_token'));
  });

  const [superAdminUser, setSuperAdminUser] = useState<SuperAdminUser | null>(() => {
    const user = sessionStorage.getItem('jccf_superadmin_user') || localStorage.getItem('jccf_superadmin_user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch {
        return null;
      }
    }
    return null;
  });

  const isSuperAdmin = isAuthSuperAdmin || pinAdminActive;

  // Authorization headers helper
  const getAuthHeaders = useCallback(async () => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    const currentAdminToken = adminToken || sessionStorage.getItem('jccf_admin_token') || localStorage.getItem('jccf_admin_token');
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    } else if (currentAdminToken) {
      headers['Authorization'] = `Bearer ${currentAdminToken}`;
    }
    return headers;
  }, [idToken, adminToken]);

  // Fetch all from PostgreSQL backend API
  const fetchDbData = useCallback(async () => {
    setIsSyncing(true);
    const deleted = getDeletedIds();
    try {
      // Announcements
      const resAnn = await fetch('/api/announcements');
      if (resAnn.ok) {
        const data = await resAnn.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Announcement[] = data
            .filter((d: any) => !deleted.has(String(d.id)) && !deleted.has(d.title))
            .map((d: any) => ({
              id: String(d.id),
              title: d.title,
              content: d.content,
              summary: d.content.slice(0, 140) + '...',
              category: d.category || 'Official Notice',
              date: d.date,
              author: d.author,
              isFeatured: Boolean(d.pinned),
              badgeColor: d.category === 'Mega Praise' ? 'red' : 'neutral'
            }));
          setAnnouncements(mapped);
        }
      }

      // Events
      const resEv = await fetch('/api/events');
      if (resEv.ok) {
        const data = await resEv.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: FellowshipEvent[] = data
            .filter((d: any) => !deleted.has(String(d.id)) && !deleted.has(d.title))
            .map((d: any) => ({
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
              image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&fit=crop',
            }));
          setEvents(mapped);
        }
      }

      // Fellowships
      const resFel = await fetch('/api/fellowships');
      if (resFel.ok) {
        const data = await resFel.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Fellowship[] = data
            .filter((d: any) => !deleted.has(String(d.id)) && !deleted.has(d.name) && !deleted.has(d.acronym))
            .map((d: any) => ({
              id: String(d.id),
              name: d.name,
              acronym: d.acronym,
              motto: 'Knowing Christ and Making Him Known',
              category: d.category,
              meetingVenue: d.venue,
              meetingDays: d.meetingDays,
              meetingTime: '5:30 PM',
              presidentName: d.presidentName,
              presidentContact: d.presidentPhone,
              bannerImage: d.logoUrl || 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=800&fit=crop',
              description: d.description,
              establishedYear: '1995',
              futaLocation: d.venue,
              mapUrl: d.mapUrl || d.map_url || (d.name ? `https://maps.google.com/?q=${encodeURIComponent(d.name + ' FUTA Akure')}` : undefined),
              membershipSize: '350+ Students'
            }));
          setFellowships(mapped);
        }
      }

      // Executives
      const resExec = await fetch('/api/executives');
      if (resExec.ok) {
        const data = await resExec.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ExecutiveLeader[] = data
            .filter((d: any) => !deleted.has(String(d.id)) && !deleted.has(d.name))
            .map((d: any) => ({
              id: String(d.id),
              name: d.name,
              office: d.office,
              department: d.department,
              level: d.level,
              phone: d.phone,
              email: d.email,
              photoUrl: d.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop',
              quote: d.bio || 'Leading with kingdom purpose and integrity in FUTA.',
              tenure: d.session || '2025/2026'
            }));
          setExecutives(mapped);
        }
      }

      // Resources
      const resRes = await fetch('/api/resources');
      if (resRes.ok) {
        const data = await resRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ResourceItem[] = data
            .filter((d: any) => !deleted.has(String(d.id)) && !deleted.has(d.title))
            .map((d: any) => ({
              id: String(d.id),
              title: d.title,
              category: d.category || 'Constitutional',
              fileType: d.format || 'PDF',
              fileSize: d.fileSize || '2.0 MB',
              downloadCount: d.downloadsCount || 0,
              dateAdded: '2026',
              description: d.description,
              downloadUrl: d.downloadUrl,
              level: d.courseCode || 'All'
            }));
          setResources(mapped);
        }
      }

      // Media Vault & Broadcasts
      try {
        const resMedia = await fetch('/api/media');
        if (resMedia.ok) {
          const dbMedia = await resMedia.json();
          if (Array.isArray(dbMedia) && dbMedia.length > 0) {
            const mappedMedia: MediaItem[] = dbMedia
              .filter((d: any) => !deleted.has(String(d.id)) && !deleted.has(d.title) && !deleted.has(d.youtubeId))
              .map((d: any) => ({
                id: String(d.id),
                title: d.title,
                category: d.category || 'Sermon',
                duration: d.duration || 'Broadcast',
                date: d.date || 'Recent Stream',
                minister: d.minister || 'JCCF FUTA',
                thumbnail: d.thumbnail || `https://img.youtube.com/vi/${d.youtubeId}/hqdefault.jpg`,
                youtubeId: d.youtubeId,
                description: d.description || '',
                views: d.views || 'Official Broadcast'
              }));
            if (mappedMedia.length > 0) {
              setMediaList(prev => {
                const dbIds = new Set(mappedMedia.map(m => m.youtubeId || m.id));
                const remaining = prev.filter(p => !dbIds.has(p.youtubeId) && !dbIds.has(p.id));
                return [...mappedMedia, ...remaining];
              });
            }
          }
        }
      } catch (mediaErr) {
        console.warn('DB media fetch note:', mediaErr);
      }

      // YouTube Video Broadcasts Channel Auto-Sync (silently syncs latest uploads from @jccf_futa)
      try {
        const resYt = await fetch('/api/youtube/channel-videos?channel=@jccf_futa');
        if (resYt.ok) {
          const ytData = await resYt.json();
          const incomingVideos: MediaItem[] = (ytData.videos || []).filter(
            (m: MediaItem) => !deleted.has(m.id) && !deleted.has(m.title) && !deleted.has(m.youtubeId)
          );
          if (incomingVideos.length > 0) {
            setMediaList(prev => {
              const ytIds = new Set(incomingVideos.map(m => m.youtubeId));
              const customVideos = prev.filter(p => !p.id.startsWith('yt-') && !ytIds.has(p.youtubeId));
              const combined = [...incomingVideos, ...customVideos];
              localStorage.setItem('jccf_cached_videos', JSON.stringify(combined));
              return combined;
            });
          }
        }
      } catch (_) {}

      // Historical Executives / Past Administrations
      try {
        const resHist = await fetch('/api/historical-executives');
        if (resHist.ok) {
          const histData = await resHist.json();
          if (Array.isArray(histData) && histData.length > 0) {
            const mappedHist: HistoricalExecutive[] = histData
              .filter((d: any) => !deleted.has(String(d.id)) && !deleted.has(d.tenure))
              .map((d: any) => ({
                id: String(d.id),
                tenure: d.tenure,
                generationName: d.generationName,
                theme: d.theme || '',
                president: d.president,
                executivesList: d.executivesList || '',
                mission: d.mission || '',
                vision: d.vision || '',
                keyAchievements: Array.isArray(d.keyAchievements) ? d.keyAchievements : [],
                photoUrl: d.photoUrl || ''
              }));
            if (mappedHist.length > 0) {
              setHistoricalExecutives(mappedHist);
            }
          }
        }
      } catch (histErr) {
        console.warn('DB historical executives fetch note:', histErr);
      }

      // Settings
      const resSet = await fetch('/api/settings');
      if (resSet.ok) {
        const data = await resSet.json();
        if (Object.keys(data).length > 0) {
          setSettings(prev => ({
            ...prev,
            ...data
          }));
          if (data.authorizedAdminList) {
            try {
              const parsed = typeof data.authorizedAdminList === 'string' ? JSON.parse(data.authorizedAdminList) : data.authorizedAdminList;
              if (Array.isArray(parsed) && parsed.length > 0) {
                setAuthorizedAdmins(parsed);
              }
            } catch (_) {}
          }
        }
      }

      // Access Control & Authorized Admins
      const authToken = idToken || (sessionStorage.getItem('jccf_superadmin_session') === 'active' ? 'admin' : null);
      if (authToken) {
        try {
          const resAccess = await fetch('/api/admin/access-control', {
            headers: authToken !== 'admin' ? { Authorization: `Bearer ${authToken}` } : {}
          });
          if (resAccess.ok) {
            const accessData = await resAccess.json();
            if (accessData.authorizedAdmins && Array.isArray(accessData.authorizedAdmins)) {
              setAuthorizedAdmins(accessData.authorizedAdmins);
            }
            if (accessData.superadminPin || accessData.executivePin) {
              setSettings(prev => ({
                ...prev,
                superadminPin: accessData.superadminPin || prev.superadminPin,
                executivePin: accessData.executivePin || prev.executivePin || '123456'
              }));
            }
          }
        } catch (_) {}
      }

      // Donations (if admin)
      if (authToken) {
        const resDon = await fetch('/api/donations', {
          headers: authToken !== 'admin' ? { Authorization: `Bearer ${authToken}` } : {}
        });
        if (resDon.ok) {
          const data = await resDon.json();
          if (data.donations && Array.isArray(data.donations)) {
            const mapped: DonationRecord[] = data.donations.map((d: any) => ({
              id: String(d.id),
              reference: d.reference,
              donorName: d.donorName,
              donorEmail: d.donorEmail,
              donorPhone: d.donorPhone,
              amount: Number(d.amount) || 0,
              purpose: d.purpose,
              paymentMethod: d.paymentMethod,
              status: d.status,
              channelDetails: d.channelDetails,
              date: (d.createdAt ? new Date(d.createdAt) : new Date()).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }));
            setDonations(mapped);
          }
        }
      }
    } catch (err) {
      console.warn('API sync warning (using client data state):', err);
    } finally {
      setIsSyncing(false);
    }
  }, [idToken]);

  useEffect(() => {
    fetchDbData();
  }, [fetchDbData]);

  // Helper for adding audit logs
  const addAuditLog = (action: string, target: string, type: AuditLog['type']) => {
    const adminName = currentUser?.displayName || superAdminUser?.name || 'Superadmin';
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      adminName,
      action,
      target,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Operations
  const loginSuperAdmin = async (keyOrEmail: string, pass?: string): Promise<{ success: boolean; message: string }> => {
    const trimmedKey = keyOrEmail.trim();
    const trimmedPass = (pass || '').trim();

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: trimmedKey,
          email: trimmedKey,
          password: trimmedPass,
          pin: trimmedPass || trimmedKey
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        const user: SuperAdminUser = {
          name: data.user?.name || 'Administrator',
          email: data.user?.email || trimmedKey,
          role: data.user?.role || 'superadmin',
          portfolio: data.user?.portfolio || 'Central Executive Council',
          avatar: data.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          loginTime: data.user?.loginTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setAdminToken(data.token);
        setPinAdminActive(true);
        setSuperAdminUser(user);
        sessionStorage.setItem('jccf_admin_token', data.token);
        sessionStorage.setItem('jccf_superadmin_session', 'active');
        sessionStorage.setItem('jccf_superadmin_user', JSON.stringify(user));
        localStorage.setItem('jccf_admin_token', data.token);
        localStorage.setItem('jccf_superadmin_session', 'active');
        localStorage.setItem('jccf_superadmin_user', JSON.stringify(user));

        addAuditLog(`Authenticated into Central Management (${user.role})`, 'Admin Gateway', 'auth');
        return { success: true, message: `Welcome back, ${user.name}! Access granted.` };
      } else {
        return {
          success: false,
          message: data.error || 'Invalid administrator credentials. Access restricted strictly to configured personnel.'
        };
      }
    } catch (err: any) {
      console.error('Login error:', err);
      return {
        success: false,
        message: 'Could not connect to authentication service. Please try again.'
      };
    }
  };

  const logoutSuperAdmin = () => {
    addAuditLog('Logged out of Central Console', 'Admin Gateway', 'auth');
    setAdminToken(null);
    setPinAdminActive(false);
    setSuperAdminUser(null);
    sessionStorage.removeItem('jccf_admin_token');
    sessionStorage.removeItem('jccf_superadmin_session');
    sessionStorage.removeItem('jccf_superadmin_user');
    localStorage.removeItem('jccf_admin_token');
    localStorage.removeItem('jccf_superadmin_session');
    localStorage.removeItem('jccf_superadmin_user');
  };

  // --- ANNOUNCEMENTS CRUD (PostgreSQL) ---
  const addAnnouncement = async (item: Omit<Announcement, 'id'>): Promise<Announcement> => {
    const tempId = 'ann-' + Date.now();
    let newRecord: Announcement = { ...item, id: tempId };
    setAnnouncements(prev => [newRecord, ...prev]);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: item.title,
          content: item.content,
          category: item.category,
          date: item.date,
          author: item.author,
          pinned: Boolean(item.isFeatured),
        })
      });
      if (res.ok) {
        const saved = await res.json();
        const savedId = String(saved.id);
        newRecord = { ...newRecord, id: savedId };
        setAnnouncements(prev => prev.map(a => a.id === tempId ? { ...a, id: savedId } : a));
      }
    } catch (err) {
      console.warn('Backend sync failed, saved in memory:', err);
    }

    addAuditLog('Created new bulletin', item.title, 'create');
    return newRecord;
  };

  const updateAnnouncement = async (id: string, updated: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Backend update failed:', err);
    }
    addAuditLog('Updated announcement', updated.title || id, 'update');
  };

  const deleteAnnouncement = async (id: string) => {
    const target = announcements.find(a => a.id === id);
    markIdDeleted(id, target?.title);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/announcements/${id}`, { method: 'DELETE', headers });
    } catch (err) {
      console.warn('Backend delete failed:', err);
    }
    addAuditLog('Deleted announcement', target?.title || id, 'delete');
  };

  // --- MEDIA & YOUTUBE BROADCASTS CRUD ---
  const fetchYouTubeVideos = async (channelQuery?: string): Promise<{ success: boolean; count: number; message: string; videos: MediaItem[] }> => {
    setIsSyncingYouTube(true);
    const target = channelQuery || youtubeChannel || '@jccf_futa';
    const deleted = getDeletedIds();
    try {
      const res = await fetch(`/api/youtube/channel-videos?channel=${encodeURIComponent(target)}`);
      if (res.ok) {
        const data = await res.json();
        const incomingVideos: MediaItem[] = (data.videos || []).filter(
          (m: MediaItem) => !deleted.has(m.id) && !deleted.has(m.title) && !deleted.has(m.youtubeId)
        );
        if (incomingVideos.length > 0) {
          setMediaList(prev => {
            const ytIds = new Set(incomingVideos.map(m => m.youtubeId));
            const customVideos = prev.filter(p => !p.id.startsWith('yt-') && !ytIds.has(p.youtubeId));
            const combined = [...incomingVideos, ...customVideos];
            localStorage.setItem('jccf_cached_videos', JSON.stringify(combined));
            return combined;
          });
          setYoutubeChannel(data.channelHandle || target);
          localStorage.setItem('jccf_youtube_channel', data.channelHandle || target);
          addAuditLog(`Synced YouTube channel: ${data.channelName || target}`, `${incomingVideos.length} videos loaded`, 'update');
          setIsSyncingYouTube(false);
          return {
            success: true,
            count: incomingVideos.length,
            message: `Successfully loaded ${incomingVideos.length} video broadcasts from ${data.channelName || target}`,
            videos: incomingVideos
          };
        } else {
          setIsSyncingYouTube(false);
          return {
            success: false,
            count: 0,
            message: data.message || `No videos found on channel ${target}. Please check the handle or name.`,
            videos: []
          };
        }
      }
    } catch (err: any) {
      console.warn('YouTube channel fetch failed:', err);
    } finally {
      setIsSyncingYouTube(false);
    }
    return {
      success: false,
      count: 0,
      message: 'Could not connect to YouTube channel stream. Please verify your connection.',
      videos: []
    };
  };

  const addMedia = (item: Omit<MediaItem, 'id'>): MediaItem => {
    const newRecord: MediaItem = { ...item, id: 'med-' + Date.now() };
    setMediaList(prev => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('jccf_cached_videos', JSON.stringify(updated));
      return updated;
    });

    // Background sync to PostgreSQL database
    (async () => {
      try {
        const headers = await getAuthHeaders();
        await fetch('/api/media', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title: item.title,
            category: item.category,
            duration: item.duration,
            date: item.date,
            minister: item.minister,
            thumbnail: item.thumbnail,
            youtubeId: item.youtubeId,
            description: item.description,
            views: item.views || '1.2K views'
          })
        });
      } catch (err) {
        console.warn('Backend addMedia failed:', err);
      }
    })();

    addAuditLog('Added media video/sermon', item.title, 'create');
    return newRecord;
  };

  const updateMedia = (id: string, updated: Partial<MediaItem>) => {
    setMediaList(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...updated } : m);
      localStorage.setItem('jccf_cached_videos', JSON.stringify(next));
      return next;
    });

    // Background sync to PostgreSQL database
    (async () => {
      try {
        const headers = await getAuthHeaders();
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
          await fetch(`/api/media/${numericId}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(updated)
          });
        }
      } catch (err) {
        console.warn('Backend updateMedia failed:', err);
      }
    })();

    addAuditLog('Updated media item', updated.title || id, 'update');
  };

  const deleteMedia = (id: string) => {
    const target = mediaList.find(m => m.id === id);
    markIdDeleted(id, target?.title);
    if (target?.youtubeId) markIdDeleted(target.youtubeId);
    setMediaList(prev => {
      const next = prev.filter(m => m.id !== id);
      localStorage.setItem('jccf_cached_videos', JSON.stringify(next));
      return next;
    });

    // Background delete from PostgreSQL database
    (async () => {
      try {
        const headers = await getAuthHeaders();
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
          await fetch(`/api/media/${numericId}`, { method: 'DELETE', headers });
        }
      } catch (err) {
        console.warn('Backend deleteMedia failed:', err);
      }
    })();

    addAuditLog('Deleted media item', target?.title || id, 'delete');
  };

  // --- EVENTS CRUD (PostgreSQL) ---
  const addEvent = async (item: Omit<FellowshipEvent, 'id'>): Promise<FellowshipEvent> => {
    const tempId = 'event-' + Date.now();
    let newRecord: FellowshipEvent = { ...item, id: tempId };
    setEvents(prev => [newRecord, ...prev]);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/events', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: item.title,
          theme: item.theme,
          date: item.date,
          time: item.time,
          venue: item.venue,
          category: item.category,
          description: item.description,
          featured: Boolean(item.isFeatured)
        })
      });
      if (res.ok) {
        const saved = await res.json();
        const savedId = String(saved.id);
        newRecord = { ...newRecord, id: savedId };
        setEvents(prev => prev.map(e => e.id === tempId ? { ...e, id: savedId } : e));
      }
    } catch (err) {
      console.warn('Events sync failed:', err);
    }

    addAuditLog('Scheduled new event', item.title, 'create');
    return newRecord;
  };

  const updateEvent = async (id: string, updated: Partial<FellowshipEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Events update failed:', err);
    }
    addAuditLog('Updated event', updated.title || id, 'update');
  };

  const deleteEvent = async (id: string) => {
    const target = events.find(e => e.id === id);
    markIdDeleted(id, target?.title);
    setEvents(prev => prev.filter(e => e.id !== id));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/events/${id}`, { method: 'DELETE', headers });
    } catch (err) {
      console.warn('Events delete failed:', err);
    }
    addAuditLog('Deleted event', target?.title || id, 'delete');
  };

  // --- FELLOWSHIPS CRUD (PostgreSQL) ---
  const addFellowship = async (item: Omit<Fellowship, 'id'>): Promise<Fellowship> => {
    const tempId = 'fel-' + Date.now();
    let newRecord: Fellowship = { ...item, id: tempId };
    setFellowships(prev => [...prev, newRecord]);

    try {
      const headers = await getAuthHeaders();
      let res = await fetch('/api/fellowships', {
        method: 'POST',
        headers,
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

      // If requireAdmin failed or unauthorized, fallback to direct registration endpoint
      if (!res.ok) {
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
        const savedId = String(saved.id);
        newRecord = { ...newRecord, id: savedId };
        setFellowships(prev => prev.map(f => f.id === tempId ? { ...f, id: savedId } : f));
        console.log('✅ Fellowship persisted to PostgreSQL:', saved);
      }
    } catch (err) {
      console.warn('Fellowship sync error:', err);
    }

    addAuditLog('Registered member fellowship', item.name, 'create');
    return newRecord;
  };

  const updateFellowship = async (id: string, updated: Partial<Fellowship>) => {
    setFellowships(prev => prev.map(f => f.id === id ? { ...f, ...updated } : f));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/fellowships/${id}`, {
        method: 'PUT',
        headers,
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
      console.warn('Fellowship update failed:', err);
    }
    addAuditLog('Updated fellowship profile', updated.name || id, 'update');
  };

  const deleteFellowship = async (id: string) => {
    const target = fellowships.find(f => f.id === id);
    markIdDeleted(id, target?.name);
    if (target?.acronym) markIdDeleted(target.acronym);
    setFellowships(prev => prev.filter(f => f.id !== id));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/fellowships/${id}`, { method: 'DELETE', headers });
    } catch (err) {
      console.warn('Fellowship delete failed:', err);
    }
    addAuditLog('Removed member fellowship', target?.name || id, 'delete');
  };

  // --- EXECUTIVES CRUD (PostgreSQL) ---
  const addExecutive = async (item: Omit<ExecutiveLeader, 'id'>): Promise<ExecutiveLeader> => {
    const tempId = 'exec-' + Date.now();
    let newRecord: ExecutiveLeader = { ...item, id: tempId };
    setExecutives(prev => [...prev, newRecord]);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/executives', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: item.name,
          office: item.office,
          department: item.department,
          level: item.level,
          phone: item.phone,
          email: item.email,
          session: item.tenure || '2025/2026',
          fellowship: 'RCF FUTA',
          photoUrl: item.photoUrl,
          bio: item.quote
        })
      });
      if (res.ok) {
        const saved = await res.json();
        const savedId = String(saved.id);
        newRecord = { ...newRecord, id: savedId };
        setExecutives(prev => prev.map(e => e.id === tempId ? { ...e, id: savedId } : e));
      }
    } catch (err) {
      console.warn('Executive sync failed:', err);
    }

    addAuditLog('Added executive council officer', item.name, 'create');
    return newRecord;
  };

  const updateExecutive = async (id: string, updated: Partial<ExecutiveLeader>) => {
    setExecutives(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/executives/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Executive update failed:', err);
    }
    addAuditLog('Updated executive profile', updated.name || id, 'update');
  };

  const deleteExecutive = async (id: string) => {
    const target = executives.find(e => e.id === id);
    markIdDeleted(id, target?.name);
    setExecutives(prev => prev.filter(e => e.id !== id));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/executives/${id}`, { method: 'DELETE', headers });
    } catch (err) {
      console.warn('Executive delete failed:', err);
    }
    addAuditLog('Removed executive officer', target?.name || id, 'delete');
  };

  // --- PAST / HISTORICAL EXECUTIVES CRUD ---
  const addHistoricalExecutive = async (item: HistoricalExecutive) => {
    setHistoricalExecutives(prev => {
      const updated = [item, ...prev.filter(h => h.tenure !== item.tenure)];
      try {
        localStorage.setItem('jccf_historical_executives', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      const headers = await getAuthHeaders();
      await fetch('/api/historical-executives', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tenure: item.tenure,
          generationName: item.generationName,
          theme: item.theme,
          president: item.president,
          executivesList: item.executivesList,
          mission: item.mission,
          vision: item.vision,
          keyAchievements: item.keyAchievements,
          photoUrl: item.photoUrl
        })
      });
    } catch (err) {
      console.warn('Historical executive create failed:', err);
    }

    addAuditLog('Added past administration record', `${item.tenure} - ${item.president}`, 'create');
  };

  const updateHistoricalExecutive = async (tenureOrId: string, item: Partial<HistoricalExecutive>) => {
    setHistoricalExecutives(prev => {
      const updated = prev.map(h => (h.tenure === tenureOrId || h.id === tenureOrId) ? { ...h, ...item } : h);
      try {
        localStorage.setItem('jccf_historical_executives', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      const target = historicalExecutives.find(h => h.tenure === tenureOrId || h.id === tenureOrId);
      const idToUse = target?.id || tenureOrId;
      const headers = await getAuthHeaders();
      await fetch(`/api/historical-executives/${idToUse}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(item)
      });
    } catch (err) {
      console.warn('Historical executive update failed:', err);
    }

    addAuditLog('Updated past administration record', tenureOrId, 'update');
  };

  const deleteHistoricalExecutive = async (tenureOrId: string) => {
    const target = historicalExecutives.find(h => h.tenure === tenureOrId || h.id === tenureOrId);
    markIdDeleted(tenureOrId, target?.generationName || target?.president);
    if (target?.id) markIdDeleted(target.id);
    
    setHistoricalExecutives(prev => {
      const updated = prev.filter(h => h.tenure !== tenureOrId && h.id !== tenureOrId);
      try {
        localStorage.setItem('jccf_historical_executives', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    try {
      const idToUse = target?.id || tenureOrId;
      const headers = await getAuthHeaders();
      await fetch(`/api/historical-executives/${idToUse}`, { method: 'DELETE', headers });
    } catch (err) {
      console.warn('Historical executive delete failed:', err);
    }

    addAuditLog('Deleted past administration record', tenureOrId, 'delete');
  };

  // --- RESOURCES CRUD (PostgreSQL) ---
  const addResource = async (item: Omit<ResourceItem, 'id'>): Promise<ResourceItem> => {
    const tempId = 'res-' + Date.now();
    let newRecord: ResourceItem = { ...item, id: tempId };
    setResources(prev => [newRecord, ...prev]);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          courseCode: item.level || '',
          department: 'General',
          format: item.fileType,
          fileSize: item.fileSize,
          downloadUrl: item.downloadUrl,
          description: item.description,
          uploadedBy: 'JCCF Central Secretariat'
        })
      });
      if (res.ok) {
        const saved = await res.json();
        const savedId = String(saved.id);
        newRecord = { ...newRecord, id: savedId };
        setResources(prev => prev.map(r => r.id === tempId ? { ...r, id: savedId } : r));
      }
    } catch (err) {
      console.warn('Resource sync failed:', err);
    }

    addAuditLog('Uploaded handbook/study resource', item.title, 'create');
    return newRecord;
  };

  const updateResource = async (id: string, updated: Partial<ResourceItem>) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Resource update failed:', err);
    }
    addAuditLog('Updated study resource', updated.title || id, 'update');
  };

  const deleteResource = async (id: string) => {
    const target = resources.find(r => r.id === id);
    markIdDeleted(id, target?.title);
    setResources(prev => prev.filter(r => r.id !== id));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/resources/${id}`, { method: 'DELETE', headers });
    } catch (err) {
      console.warn('Resource delete failed:', err);
    }
    addAuditLog('Deleted study resource', target?.title || id, 'delete');
  };

  const incrementResourceDownload = async (id: string) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, downloadCount: (Number(r.downloadCount) || 0) + 1 };
      }
      return r;
    }));
    try {
      await fetch(`/api/resources/${id}/download`, { method: 'POST' });
    } catch (err) {
      console.warn('Increment download failed:', err);
    }
  };

  // --- SECURE PAYMENTS & STEWARDSHIP (PostgreSQL) ---
  const initializePaymentSession = async (data: {
    amount: number;
    purpose: string;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    paymentMethod: string;
  }) => {
    const res = await fetch('/api/donations/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed initializing payment');
    }
    return await res.json();
  };

  const verifyPaymentSession = async (reference: string, details?: string): Promise<DonationRecord> => {
    const res = await fetch('/api/donations/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference, channelDetails: details })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed verifying payment');
    }
    const data = await res.json();
    const d = data.receipt;
    const mapped: DonationRecord = {
      id: String(d.id),
      reference: d.reference,
      donorName: d.donorName,
      donorEmail: d.donorEmail,
      donorPhone: d.donorPhone,
      amount: Number(d.amount) || 0,
      purpose: d.purpose,
      paymentMethod: d.paymentMethod,
      status: d.status,
      channelDetails: d.channelDetails,
      date: (d.createdAt ? new Date(d.createdAt) : new Date()).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setDonations(prev => [mapped, ...prev]);
    return mapped;
  };

  const recordDonation = async (donation: Omit<DonationRecord, 'id' | 'date'>): Promise<DonationRecord> => {
    let savedRecord: DonationRecord = {
      ...donation,
      id: 'DON-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      const res = await fetch('/api/donations/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donation)
      });
      if (res.ok) {
        const data = await res.json();
        const d = data.receipt;
        savedRecord = {
          id: String(d.id),
          reference: d.reference,
          donorName: d.donorName,
          donorEmail: d.donorEmail,
          donorPhone: d.donorPhone,
          amount: Number(d.amount) || 0,
          purpose: d.purpose,
          paymentMethod: d.paymentMethod,
          status: d.status,
          channelDetails: d.channelDetails,
          date: (d.createdAt ? new Date(d.createdAt) : new Date()).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        };
      }
    } catch (err) {
      console.warn('Record donation sync failed:', err);
    }

    setDonations(prev => [savedRecord, ...prev]);
    addAuditLog(`Received ₦${(Number(donation.amount) || 0).toLocaleString()} Seed via ${donation.paymentMethod}`, `${donation.donorName} (${donation.purpose})`, 'create');
    return savedRecord;
  };

  const deleteDonation = async (id: string) => {
    setDonations(prev => prev.filter(d => d.id !== id));
    try {
      const headers = await getAuthHeaders();
      await fetch(`/api/donations/${id}`, { method: 'DELETE', headers });
    } catch (err) {
      console.warn('Donation delete failed:', err);
    }
    addAuditLog('Removed stewardship record', id, 'delete');
  };

  // --- SETTINGS (PostgreSQL) ---
  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    try {
      const headers = await getAuthHeaders();
      await fetch('/api/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify(newSettings)
      });
    } catch (err) {
      console.warn('Settings update failed:', err);
    }
    addAuditLog('Updated portal system settings', 'Central Configuration', 'settings');
  };

  // --- ACCESS CONTROL: AUTHORIZED ADMINS & PINS ---
  const addAuthorizedAdmin = async (admin: { email: string; name: string; role: 'superadmin' | 'admin' | 'executive' }) => {
    const normalizedEmail = admin.email.toLowerCase().trim();
    const newAdminRecord: AuthorizedAdmin = {
      email: normalizedEmail,
      name: admin.name.trim() || normalizedEmail.split('@')[0],
      role: admin.role,
      addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      addedBy: currentUser?.displayName || superAdminUser?.name || 'Superadmin'
    };

    setAuthorizedAdmins(prev => {
      const filtered = prev.filter(a => a.email.toLowerCase() !== normalizedEmail);
      return [...filtered, newAdminRecord];
    });

    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/access-control/admins', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: normalizedEmail,
          name: newAdminRecord.name,
          role: newAdminRecord.role
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authorizedAdmins && Array.isArray(data.authorizedAdmins)) {
          setAuthorizedAdmins(data.authorizedAdmins);
        }
      }
    } catch (err) {
      console.warn('Backend sync for authorized admin failed:', err);
    }

    addAuditLog(`Granted ${admin.role.toUpperCase()} privileges to ${normalizedEmail}`, 'Access Control & Security', 'auth');
  };

  const removeAuthorizedAdmin = async (email: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    if (normalizedEmail === 'jayeobapeace19459@gmail.com') {
      alert('Cannot remove the Primary Central Executive Superadmin account.');
      return;
    }

    setAuthorizedAdmins(prev => prev.filter(a => a.email.toLowerCase() !== normalizedEmail));

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/access-control/admins/${encodeURIComponent(normalizedEmail)}`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authorizedAdmins && Array.isArray(data.authorizedAdmins)) {
          setAuthorizedAdmins(data.authorizedAdmins);
        }
      }
    } catch (err) {
      console.warn('Backend removal of admin failed:', err);
    }

    addAuditLog(`Revoked administrator privileges from ${normalizedEmail}`, 'Access Control & Security', 'auth');
  };

  const updateSecurityPins = async (pins: { superadminPin?: string; executivePin?: string }) => {
    setSettings(prev => ({
      ...prev,
      ...(pins.superadminPin ? { superadminPin: pins.superadminPin.trim() } : {}),
      ...(pins.executivePin ? { executivePin: pins.executivePin.trim() } : {})
    }));

    try {
      const headers = await getAuthHeaders();
      await fetch('/api/admin/access-control/pins', {
        method: 'PUT',
        headers,
        body: JSON.stringify(pins)
      });
    } catch (err) {
      console.warn('PIN update failed on backend:', err);
    }

    addAuditLog('Updated Master Superadmin & Executive PINs', 'Access Control & Security', 'settings');
  };

  // --- RESET TO DEFAULTS ---
  const resetToFactoryDefaults = () => {
    setAnnouncements(ANNOUNCEMENTS);
    setMediaList(MEDIA_RECORDS);
    setEvents(JCCF_EVENTS);
    setFellowships(MEMBER_FELLOWSHIPS);
    setExecutives(CENTRAL_EXECUTIVES);
    setResources(RESOURCES_LIST);
    setDonations(INITIAL_DONATIONS);
    setSettings(DEFAULT_SETTINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
    alert('Factory defaults restored successfully.');
  };

  return (
    <AppContext.Provider
      value={{
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,

        mediaList,
        youtubeChannel,
        isSyncingYouTube,
        fetchYouTubeVideos,
        addMedia,
        updateMedia,
        deleteMedia,

        events,
        addEvent,
        updateEvent,
        deleteEvent,

        fellowships,
        addFellowship,
        updateFellowship,
        deleteFellowship,

        executives,
        addExecutive,
        updateExecutive,
        deleteExecutive,

        historicalExecutives,
        addHistoricalExecutive,
        updateHistoricalExecutive,
        deleteHistoricalExecutive,

        resources,
        addResource,
        updateResource,
        deleteResource,
        incrementResourceDownload,

        serviceUnits,

        donations,
        recordDonation,
        deleteDonation,
        initializePaymentSession,
        verifyPaymentSession,

        settings,
        updateSettings,

        authorizedAdmins,
        addAuthorizedAdmin,
        removeAuthorizedAdmin,
        updateSecurityPins,

        auditLogs,
        addAuditLog,

        isSuperAdmin,
        superAdminUser,
        loginSuperAdmin,
        logoutSuperAdmin,

        isSyncing,
        fetchDbData,

        resetToFactoryDefaults
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
