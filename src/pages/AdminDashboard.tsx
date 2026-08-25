import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  LayoutDashboard, 
  Bell, 
  Calendar, 
  Users, 
  Award, 
  BookOpen, 
  Tv, 
  Heart, 
  Settings, 
  ShieldCheck, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff,
  CheckCircle, 
  CheckCircle2,
  X, 
  Download, 
  ArrowLeft,
  Filter,
  Save,
  LogOut,
  Key,
  KeyRound,
  UserPlus,
  Copy,
  AlertCircle,
  Shield,
  Clock,
  Sparkles,
  Zap,
  Check,
  Play,
  RotateCcw,
  LogIn,
  Database,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Announcement, 
  FellowshipEvent, 
  Fellowship, 
  ExecutiveLeader, 
  ResourceItem, 
  MediaItem,
  DonationRecord,
  AuthorizedAdmin
} from '../types';

interface AdminDashboardProps {
  onNavigateHome: () => void;
}

type AdminTab = 
  | 'overview' 
  | 'announcements' 
  | 'media' 
  | 'events' 
  | 'fellowships' 
  | 'executives' 
  | 'resources' 
  | 'donations' 
  | 'access'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateHome }) => {
  const { currentUser, userProfile, isSuperAdmin: authIsSuperAdmin, loginWithGoogle, logout: authLogout } = useAuth();
  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,

    mediaList,
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

    resources,
    addResource,
    updateResource,
    deleteResource,

    donations,
    deleteDonation,

    settings,
    updateSettings,

    authorizedAdmins,
    addAuthorizedAdmin,
    removeAuthorizedAdmin,
    updateSecurityPins,

    auditLogs,
    isSuperAdmin: appIsSuperAdmin,
    superAdminUser,
    loginSuperAdmin,
    logoutSuperAdmin,
    fetchDbData,
    isSyncing,
    resetToFactoryDefaults
  } = useApp();

  const isSuperAdmin = authIsSuperAdmin || appIsSuperAdmin;

  // Login Form States
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Navigation Tab
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Access Control States
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'superadmin' | 'admin' | 'executive'>('admin');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [adminActionFeedback, setAdminActionFeedback] = useState('');

  const [superadminPinInput, setSuperadminPinInput] = useState(settings.superadminPin || '778899');
  const [executivePinInput, setExecutivePinInput] = useState(settings.executivePin || '123456');
  const [showSuperadminPin, setShowSuperadminPin] = useState(false);
  const [showExecutivePin, setShowExecutivePin] = useState(false);
  const [pinActionFeedback, setPinActionFeedback] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (settings.superadminPin) setSuperadminPinInput(settings.superadminPin);
    if (settings.executivePin) setExecutivePinInput(settings.executivePin);
  }, [settings.superadminPin, settings.executivePin]);

  // Modals - Announcement
  const [announcementModalMode, setAnnouncementModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeAnnouncement, setActiveAnnouncement] = useState<Partial<Announcement>>({});

  // Modals - Media
  const [mediaModalMode, setMediaModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeMedia, setActiveMedia] = useState<Partial<MediaItem>>({});
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  // Modals - Events
  const [eventModalMode, setEventModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeEvent, setActiveEvent] = useState<Partial<FellowshipEvent>>({});

  // Modals - Fellowships
  const [fellowshipModalMode, setFellowshipModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeFellowship, setActiveFellowship] = useState<Partial<Fellowship>>({});

  // Modals - Executives
  const [executiveModalMode, setExecutiveModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeExecutive, setActiveExecutive] = useState<Partial<ExecutiveLeader>>({});

  // Modals - Resources
  const [resourceModalMode, setResourceModalMode] = useState<'create' | 'edit' | null>(null);
  const [activeResource, setActiveResource] = useState<Partial<ResourceItem>>({});

  // Donations Filter
  const [donationFilter, setDonationFilter] = useState<'All' | 'OPay' | 'PalmPay' | 'Bank Transfer' | 'Card'>('All');

  // Settings Edit State
  const [tempSettings, setTempSettings] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ================= AUTHENTICATION HANDLERS =================
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await loginSuperAdmin(loginInput, passwordInput);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleQuickDemoLogin = async () => {
    await loginSuperAdmin('778899');
  };

  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      setAdminActionFeedback('Please enter a valid Google email address.');
      return;
    }
    setIsAddingAdmin(true);
    setAdminActionFeedback('');
    try {
      await addAuthorizedAdmin({
        email: newAdminEmail.trim(),
        name: newAdminName.trim() || newAdminEmail.trim().split('@')[0],
        role: newAdminRole
      });
      setNewAdminEmail('');
      setNewAdminName('');
      setAdminActionFeedback(`Successfully authorized ${newAdminEmail} as ${newAdminRole.toUpperCase()}!`);
      setTimeout(() => setAdminActionFeedback(''), 4000);
    } catch (err: any) {
      setAdminActionFeedback(err.message || 'Failed to authorize administrator.');
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleUpdatePinsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinActionFeedback('');
    try {
      await updateSecurityPins({
        superadminPin: superadminPinInput.trim(),
        executivePin: executivePinInput.trim()
      });
      setPinActionFeedback('Master & Executive PINs updated and synced with database!');
      setTimeout(() => setPinActionFeedback(''), 4000);
    } catch (err: any) {
      setPinActionFeedback(err.message || 'Failed to update PINs.');
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  // If user is not authenticated as Superadmin, show the dedicated Superadmin Login Portal
  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-4 sm:p-6 text-left">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#B5121B] text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
              <Lock className="w-3 h-3 text-[#B5121B]" />
              <span>Superadmin Authentication</span>
            </div>
            <h1 className="text-2xl font-black font-heading text-[#171717] tracking-tight">
              JCCF Central Console
            </h1>
            <p className="text-xs text-[#666666]">
              Secure administrative access for FUTA Central Executive Council & Secretariat.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-[#FDECEC] border border-[#F8D0D0] rounded-xl text-xs font-semibold text-[#8B0000] animate-in fade-in">
              {loginError}
            </div>
          )}

          {/* Secure Firebase Google Sign-In */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={async () => {
                setLoginError('');
                try {
                  await loginWithGoogle();
                } catch (err: any) {
                  setLoginError(err.message || 'Google authentication failed');
                }
              }}
              className="w-full py-3 bg-white hover:bg-[#FAFAFA] border-2 border-[#E5E5E5] hover:border-[#B5121B] text-[#171717] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google (Secure OAuth)</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#E5E5E5]"></div>
              <span className="text-[10px] uppercase font-bold text-[#999999] tracking-wider">or enter credentials</span>
              <div className="flex-1 h-px bg-[#E5E5E5]"></div>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#171717] block mb-1">
                Superadmin PIN or Official Email:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 778899 or jayeobapeace19459@gmail.com"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171717] block mb-1">
                Password / Master Key (If using Email):
              </label>
              <input
                type="password"
                placeholder="Master Key or leave blank for PIN"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Verify & Access Superadmin Console</span>
            </button>
          </form>

          {/* Quick Access Helper */}
          <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-[#E5E5E5] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#8B0000]">Quick Superadmin Access:</span>
              <span className="text-[10px] text-[#666666]">Instant PIN</span>
            </div>
            <div className="text-[11px] text-[#666666] space-y-0.5">
              <div>Master PIN: <strong className="font-mono text-[#171717]">778899</strong></div>
              <div>Primary Admin: <strong className="font-mono text-[#171717]">jayeobapeace19459@gmail.com</strong></div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 bg-[#FDECEC] hover:bg-[#F8D0D0] text-[#8B0000] font-bold text-xs rounded-lg transition-colors cursor-pointer border border-[#F8D0D0] mt-1"
            >
              One-Click Superadmin Login
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onNavigateHome}
              className="text-xs text-[#666666] hover:text-[#171717] font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ================= SAVE HANDLERS FOR CRUD =================
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAnnouncement.title || !activeAnnouncement.content) return;

    if (announcementModalMode === 'edit' && activeAnnouncement.id) {
      updateAnnouncement(activeAnnouncement.id, activeAnnouncement);
    } else {
      addAnnouncement({
        title: activeAnnouncement.title || '',
        category: activeAnnouncement.category as any || 'Official Notice',
        author: activeAnnouncement.author || 'JCCF Secretariat',
        summary: activeAnnouncement.summary || (activeAnnouncement.content?.slice(0, 100) + '...'),
        content: activeAnnouncement.content || '',
        date: activeAnnouncement.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        isFeatured: activeAnnouncement.isFeatured || false
      });
    }
    setAnnouncementModalMode(null);
    setActiveAnnouncement({});
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMedia.title || !activeMedia.minister) return;

    if (mediaModalMode === 'edit' && activeMedia.id) {
      updateMedia(activeMedia.id, activeMedia);
    } else {
      addMedia({
        title: activeMedia.title || '',
        category: activeMedia.category as any || 'Sermon',
        duration: activeMedia.duration || '1 hr 15 mins',
        date: activeMedia.date || 'August 2026',
        minister: activeMedia.minister || 'JCCF Minister',
        thumbnail: activeMedia.thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
        youtubeId: activeMedia.youtubeId || 'dQw4w9WgXcQ',
        description: activeMedia.description || '',
        views: activeMedia.views || '1.2K views'
      });
    }
    setMediaModalMode(null);
    setActiveMedia({});
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEvent.title || !activeEvent.venue) return;

    if (eventModalMode === 'edit' && activeEvent.id) {
      updateEvent(activeEvent.id, activeEvent);
    } else {
      addEvent({
        title: activeEvent.title || '',
        category: activeEvent.category as any || 'Mega Service',
        date: activeEvent.date || 'Friday, Oct 30, 2026',
        time: activeEvent.time || '5:00 PM',
        venue: activeEvent.venue || 'Chapel Pavilion',
        description: activeEvent.description || '',
        theme: activeEvent.theme || '',
        minister: activeEvent.minister || 'JCCF Executive Council',
        isUpcoming: activeEvent.isUpcoming ?? true,
        image: activeEvent.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
      });
    }
    setEventModalMode(null);
    setActiveEvent({});
  };

  const handleSaveFellowship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFellowship.name || !activeFellowship.acronym) return;

    if (fellowshipModalMode === 'edit' && activeFellowship.id) {
      updateFellowship(activeFellowship.id, activeFellowship);
    } else {
      addFellowship({
        name: activeFellowship.name || '',
        acronym: activeFellowship.acronym || '',
        motto: activeFellowship.motto || '',
        category: activeFellowship.category as any || 'Denominational',
        meetingVenue: activeFellowship.meetingVenue || 'FUTA Campus Venue',
        meetingDays: activeFellowship.meetingDays || 'Wednesdays & Sundays',
        meetingTime: activeFellowship.meetingTime || '5:00 PM',
        presidentName: activeFellowship.presidentName || '',
        presidentContact: activeFellowship.presidentContact || '',
        bannerImage: activeFellowship.bannerImage || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
        description: activeFellowship.description || '',
        establishedYear: activeFellowship.establishedYear || '1995',
        futaLocation: activeFellowship.futaLocation || 'FUTA Main Campus'
      });
    }
    setFellowshipModalMode(null);
    setActiveFellowship({});
  };

  const handleSaveExecutive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExecutive.name || !activeExecutive.office) return;

    if (executiveModalMode === 'edit' && activeExecutive.id) {
      updateExecutive(activeExecutive.id, activeExecutive);
    } else {
      addExecutive({
        name: activeExecutive.name || '',
        office: activeExecutive.office || 'Council Officer',
        level: activeExecutive.level || '500L',
        department: activeExecutive.department || 'Engineering',
        quote: activeExecutive.quote || '',
        photoUrl: activeExecutive.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        phone: activeExecutive.phone || '+234 800 000 0000',
        email: activeExecutive.email || 'executive@jccf-futa.org',
        tenure: activeExecutive.tenure || '2026/2027'
      });
    }
    setExecutiveModalMode(null);
    setActiveExecutive({});
  };

  const handleSaveResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResource.title || !activeResource.category) return;

    if (resourceModalMode === 'edit' && activeResource.id) {
      updateResource(activeResource.id, activeResource);
    } else {
      addResource({
        title: activeResource.title || '',
        category: activeResource.category as any || 'Study Materials',
        fileType: activeResource.fileType as any || 'PDF',
        fileSize: activeResource.fileSize || '3.5 MB',
        downloadCount: activeResource.downloadCount || 0,
        dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        description: activeResource.description || '',
        downloadUrl: activeResource.downloadUrl || '#',
        level: activeResource.level || '100L'
      });
    }
    setResourceModalMode(null);
    setActiveResource({});
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(tempSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const filteredDonations = donations.filter(d => {
    if (donationFilter === 'All') return true;
    return d.paymentMethod === donationFilter;
  });

  const totalDonationsAmount = donations.reduce((sum, d) => sum + (d?.status === 'Completed' ? (Number(d?.amount) || 0) : 0), 0);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'announcements', label: 'Announcements & News', icon: Bell, count: announcements.length },
    { id: 'media', label: 'Media & Sermons', icon: Tv, count: mediaList.length },
    { id: 'events', label: 'Events Calendar', icon: Calendar, count: events.length },
    { id: 'fellowships', label: 'Fellowships Directory', icon: Users, count: fellowships.length },
    { id: 'executives', label: 'Executive Council', icon: Award, count: executives.length },
    { id: 'resources', label: 'Past Questions & Library', icon: BookOpen, count: resources.length },
    { id: 'donations', label: 'Donations & Stewardship', icon: Heart, count: `₦${((Number(totalDonationsAmount) || 0) / 1000).toFixed(0)}k` },
    { id: 'access', label: 'Admin Access & PINs', icon: ShieldCheck, count: authorizedAdmins.length },
    { id: 'settings', label: 'Portal & Security', icon: Settings }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-[#171717]">
      
      {/* Top Superadmin Navigation Header */}
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateHome}
                className="p-2 rounded-lg text-[#666666] hover:text-[#171717] hover:bg-[#FAFAFA] transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Website</span>
              </button>

              <div className="h-5 w-px bg-[#E5E5E5]" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#B5121B] text-white flex items-center justify-center font-black text-xs font-heading">
                  JCCF
                </div>
                <div>
                  <span className="text-sm font-black text-[#171717] font-heading block leading-none">
                    Superadmin Console
                  </span>
                  <span className="text-[10px] text-[#8B0000] font-semibold">
                    {settings.academicSession}
                  </span>
                </div>
              </div>
            </div>

            {/* Database Sync Status & Profile & Logout */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchDbData()}
                title="Sync from PostgreSQL Cloud SQL Database"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAFAFA] hover:bg-[#FDECEC] border border-[#E5E5E5] hover:border-[#B5121B] rounded-xl text-xs font-semibold text-[#171717] transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#B5121B]' : 'text-[#666666]'}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync DB'}</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-[#E5E5E5]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="text-xs font-semibold text-[#666666] leading-tight">
                  <span className="block text-[#171717] font-bold">
                    {currentUser?.displayName || currentUser?.email || superAdminUser?.name || 'Superadmin'}
                  </span>
                  <span className="text-[10px] text-[#8B0000] uppercase font-bold">
                    {userProfile?.role || 'Superadmin'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  logoutSuperAdmin();
                  if (currentUser) authLogout();
                }}
                className="px-3 py-1.5 bg-[#FDECEC] hover:bg-[#B5121B] text-[#8B0000] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-[#F8D0D0]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Admin Body Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 bg-white p-3 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-1">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#8B0000] flex items-center justify-between">
              <span>Superadmin Modules</span>
              <Shield className="w-3 h-3" />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id as AdminTab);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#B5121B] text-white shadow-xs'
                      : 'text-[#171717] hover:bg-[#FAFAFA] hover:text-[#B5121B]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#FAFAFA] text-[#666666] border border-[#E5E5E5]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main Module Content Area */}
          <main className="lg:col-span-9 space-y-6 text-left">
            
            {/* ================= TAB 1: OVERVIEW ================= */}
            {currentTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-1 shadow-xs">
                    <span className="text-[11px] font-bold text-[#666666] uppercase">Active Bulletins</span>
                    <h3 className="text-2xl font-black text-[#171717] font-heading">{announcements.length} Published</h3>
                    <span className="text-[10px] text-[#8B0000] font-semibold block">{announcements.filter(a => a.isFeatured).length} Pinned on Homepage</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-1 shadow-xs">
                    <span className="text-[11px] font-bold text-[#666666] uppercase">Media & Sermons</span>
                    <h3 className="text-2xl font-black text-[#B5121B] font-heading">{mediaList.length} Videos</h3>
                    <span className="text-[10px] text-[#666666] block">YouTube Streams Linked</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-1 shadow-xs">
                    <span className="text-[11px] font-bold text-[#666666] uppercase">Study Past Questions</span>
                    <h3 className="text-2xl font-black text-[#171717] font-heading">{resources.length} Archives</h3>
                    <span className="text-[10px] text-[#8B0000] font-semibold block">All 9 Schools Covered</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#E5E5E5] space-y-1 shadow-xs">
                    <span className="text-[11px] font-bold text-[#666666] uppercase">Donations & Stewardship</span>
                    <h3 className="text-2xl font-black text-[#8B0000] font-heading">₦{(Number(totalDonationsAmount) || 0).toLocaleString()}</h3>
                    <span className="text-[10px] text-[#008753] font-bold block">{donations.length} Verified Donors</span>
                  </div>
                </div>

                {/* Quick Action Shortcuts */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-4">
                  <h3 className="text-base font-bold font-heading text-[#171717]">
                    Quick Superadmin Controls
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setActiveAnnouncement({ category: 'Official Notice', isFeatured: false });
                        setAnnouncementModalMode('create');
                      }}
                      className="px-4 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Post Announcement</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveMedia({ category: 'Sermon' });
                        setMediaModalMode('create');
                      }}
                      className="px-4 py-2.5 bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] border border-[#E5E5E5] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Video / Sermon</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveEvent({ category: 'Mega Service', isUpcoming: true });
                        setEventModalMode('create');
                      }}
                      className="px-4 py-2.5 bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] border border-[#E5E5E5] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Schedule Event</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveResource({ category: 'Study Materials', fileType: 'PDF' });
                        setResourceModalMode('create');
                      }}
                      className="px-4 py-2.5 bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] border border-[#E5E5E5] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Past Question</span>
                    </button>
                  </div>
                </div>

                {/* Live Announcements Preview */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-heading text-[#171717]">
                      Live Bulletins on JCCF Website ({announcements.length})
                    </h3>
                    <button
                      onClick={() => setCurrentTab('announcements')}
                      className="text-xs font-bold text-[#B5121B] hover:underline"
                    >
                      Manage & Edit All →
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {announcements.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5] flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded border border-[#F8D0D0]">
                              {item.category}
                            </span>
                            {item.isFeatured && (
                              <span className="text-[10px] font-bold uppercase text-[#008753] bg-[#00B875]/10 px-1.5 py-0.5 rounded">
                                Pinned
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-[#171717] block truncate mt-1">{item.title}</span>
                          <span className="text-[11px] text-[#666666] block">{item.date} • {item.author}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setActiveAnnouncement(item);
                              setAnnouncementModalMode('edit');
                            }}
                            className="p-1.5 text-[#666666] hover:text-[#B5121B] hover:bg-white rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${item.title}"?`)) deleteAnnouncement(item.id);
                            }}
                            className="p-1.5 text-[#666666] hover:text-[#B5121B] hover:bg-white rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Trail */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-3">
                  <h3 className="text-base font-bold font-heading text-[#171717] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8B0000]" />
                    <span>Recent Administrative Audit Logs</span>
                  </h3>
                  <div className="divide-y divide-[#E5E5E5] text-xs">
                    {auditLogs.slice(0, 5).map(log => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                        <div>
                          <span className="font-bold text-[#171717]">{log.action}: </span>
                          <span className="text-[#666666]">{log.target}</span>
                        </div>
                        <span className="text-[10px] text-[#666666] shrink-0 font-mono">{log.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ================= TAB 2: ANNOUNCEMENTS MANAGER ================= */}
            {currentTab === 'announcements' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-[#171717]">
                      Announcements & News Manager ({announcements.length})
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Create, edit, pin, and manage circulars broadcasted to the entire campus website.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveAnnouncement({
                        category: 'Official Notice',
                        author: 'JCCF Secretariat',
                        isFeatured: false,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      });
                      setAnnouncementModalMode('create');
                    }}
                    className="px-4 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Announcement</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {announcements.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5] space-y-2 hover:border-[#B5121B] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          {item.isFeatured && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FDECEC] text-[#8B0000] px-2 py-0.5 rounded border border-[#F8D0D0]">
                              Pinned on Home
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#666666]">{item.date}</span>
                      </div>

                      <h4 className="text-sm font-bold text-[#171717]">{item.title}</h4>
                      <p className="text-xs text-[#666666] leading-relaxed line-clamp-2">{item.content}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5] text-xs text-[#666666]">
                        <span>Issued by: <strong>{item.author}</strong></span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveAnnouncement(item);
                              setAnnouncementModalMode('edit');
                            }}
                            className="px-3 py-1 bg-white hover:bg-[#FAFAFA] text-[#171717] rounded-lg border border-[#E5E5E5] text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3 text-[#B5121B]" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete announcement "${item.title}"?`)) deleteAnnouncement(item.id);
                            }}
                            className="px-3 py-1 bg-white hover:bg-[#FDECEC] text-[#8B0000] rounded-lg border border-[#E5E5E5] text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 3: MEDIA & VIDEOS MANAGER ================= */}
            {currentTab === 'media' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-[#171717]">
                      Digital Media & Sermons Vault ({mediaList.length})
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Add, edit, or remove sermon recordings, worship streams, and YouTube IDs.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveMedia({
                        category: 'Sermon',
                        duration: '1 hr 15 mins',
                        date: 'August 2026',
                        youtubeId: 'dQw4w9WgXcQ'
                      });
                      setMediaModalMode('create');
                    }}
                    className="px-4 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Video</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {mediaList.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] space-y-3 flex flex-col justify-between hover:border-[#B5121B] transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-[#B5121B] bg-[#FDECEC] px-2 py-0.5 rounded border border-[#F8D0D0]">
                            {m.category} • {m.duration}
                          </span>
                          <span className="text-[11px] text-[#666666] font-mono">YouTube: {m.youtubeId}</span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-[#171717] line-clamp-2">{m.title}</h4>
                        <p className="text-xs text-[#666666] line-clamp-2">{m.description}</p>
                        <div className="text-xs text-[#666666]">
                          Minister: <strong className="text-[#171717]">{m.minister}</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between">
                        <button
                          onClick={() => setPreviewMedia(m)}
                          className="text-xs font-bold text-[#B5121B] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-[#B5121B]" />
                          <span>Preview Video</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveMedia(m);
                              setMediaModalMode('edit');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-[#FAFAFA] text-[#171717] rounded-lg border border-[#E5E5E5] text-xs font-bold cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3 text-[#B5121B]" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${m.title}"?`)) deleteMedia(m.id);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-[#FDECEC] text-[#8B0000] rounded-lg border border-[#E5E5E5] text-xs font-bold cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 4: EVENTS CALENDAR MANAGER ================= */}
            {currentTab === 'events' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-[#171717]">
                      Events & Calendar Manager ({events.length})
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Schedule, edit, or announce fellowship programs, Mega Praise, and prayer treks.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveEvent({
                        category: 'Mega Service',
                        isUpcoming: true,
                        time: '5:00 PM',
                        venue: 'Chapel Main Auditorium'
                      });
                      setEventModalMode('create');
                    }}
                    className="px-4 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Event</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-4 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] space-y-2.5 flex flex-col justify-between hover:border-[#B5121B] transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-[#B5121B] bg-[#FDECEC] px-2 py-0.5 rounded border border-[#F8D0D0]">
                            {event.category}
                          </span>
                          <span className="text-xs font-bold text-[#8B0000]">{event.date}</span>
                        </div>

                        <h4 className="text-sm font-bold text-[#171717] mt-2">{event.title}</h4>
                        <p className="text-xs text-[#666666] line-clamp-2 mt-1">{event.description}</p>
                        
                        <div className="text-[11px] text-[#666666] mt-2 space-y-0.5">
                          <div>Venue: <strong className="text-[#171717]">{event.venue}</strong></div>
                          <div>Time: <strong>{event.time}</strong></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveEvent(event);
                            setEventModalMode('edit');
                          }}
                          className="px-3 py-1 bg-white hover:bg-[#FAFAFA] text-[#171717] rounded-lg border border-[#E5E5E5] text-xs font-bold cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-[#B5121B]" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove event "${event.title}"?`)) deleteEvent(event.id);
                          }}
                          className="px-3 py-1 bg-white hover:bg-[#FDECEC] text-[#8B0000] rounded-lg border border-[#E5E5E5] text-xs font-bold cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 5: FELLOWSHIPS MANAGER ================= */}
            {currentTab === 'fellowships' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-[#171717]">
                      Member Fellowships Registry ({fellowships.length})
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Official roster of registered Christian student fellowships in FUTA.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveFellowship({
                        category: 'Denominational',
                        futaLocation: 'FUTA Main Campus'
                      });
                      setFellowshipModalMode('create');
                    }}
                    className="px-4 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register Fellowship</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {fellowships.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#B5121B]">{f.acronym}</span>
                          <span className="text-[10px] font-bold uppercase text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded border border-[#F8D0D0]">
                            {f.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#171717]">{f.name}</h4>
                        <div className="text-xs text-[#666666]">
                          Venue: <strong>{f.meetingVenue}</strong> • President: <strong>{f.presidentName}</strong> ({f.presidentContact})
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveFellowship(f);
                            setFellowshipModalMode('edit');
                          }}
                          className="p-2 text-[#666666] hover:text-[#B5121B] bg-white rounded-lg border border-[#E5E5E5] transition-colors cursor-pointer shrink-0"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove fellowship "${f.name}"?`)) deleteFellowship(f.id);
                          }}
                          className="p-2 text-[#666666] hover:text-[#B5121B] bg-white rounded-lg border border-[#E5E5E5] transition-colors cursor-pointer shrink-0"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 6: EXECUTIVES COUNCIL MANAGER ================= */}
            {currentTab === 'executives' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-[#171717]">
                      Executive Council Roster ({executives.length})
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Central Executive Council officers, portfolios, and contact details.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveExecutive({
                        level: '500L',
                        department: 'FUTA',
                        tenure: '2026/2027'
                      });
                      setExecutiveModalMode('create');
                    }}
                    className="px-4 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Executive Officer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {executives.map((exec) => (
                    <div
                      key={exec.id}
                      className="p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5] flex items-center gap-3.5"
                    >
                      <img
                        src={exec.photoUrl}
                        alt={exec.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#E5E5E5] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black uppercase text-[#8B0000] block truncate">
                          {exec.office}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#171717] truncate">{exec.name}</h4>
                        <span className="text-[11px] text-[#666666] block truncate">{exec.department} • {exec.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setActiveExecutive(exec);
                            setExecutiveModalMode('edit');
                          }}
                          className="p-1.5 text-[#666666] hover:text-[#B5121B] bg-white rounded-lg border border-[#E5E5E5] transition-colors cursor-pointer shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${exec.name}" from council?`)) deleteExecutive(exec.id);
                          }}
                          className="p-1.5 text-[#666666] hover:text-[#B5121B] bg-white rounded-lg border border-[#E5E5E5] transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 7: STUDY RESOURCES & PAST QUESTIONS ================= */}
            {currentTab === 'resources' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-[#171717]">
                      Study Resources & Past Questions ({resources.length})
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Academic past question repository and spiritual handbook library.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveResource({
                        category: 'Study Materials',
                        fileType: 'PDF',
                        level: '100L'
                      });
                      setResourceModalMode('create');
                    }}
                    className="px-4 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Past Question / Material</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5] flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded border border-[#F8D0D0]">
                            {res.fileType} • {res.fileSize}
                          </span>
                          <span className="text-xs text-[#666666]">{res.category}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#171717] mt-1">{res.title}</h4>
                        <span className="text-[11px] text-[#666666]">Downloads: <strong>{(Number(res.downloadCount) || 0).toLocaleString()}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveResource(res);
                            setResourceModalMode('edit');
                          }}
                          className="p-2 text-[#666666] hover:text-[#B5121B] bg-white rounded-lg border border-[#E5E5E5] cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove resource "${res.title}"?`)) deleteResource(res.id);
                          }}
                          className="p-2 text-[#666666] hover:text-[#B5121B] bg-white rounded-lg border border-[#E5E5E5] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 8: DONATIONS & STEWARDSHIP LEDGER ================= */}
            {currentTab === 'donations' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-lg font-bold font-heading text-[#171717]">
                      Financial Stewardship & Live Donations Ledger
                    </h2>
                    <p className="text-xs text-[#666666]">
                      Real-time payment records from OPay, PalmPay, Bank Transfer, and Card payments.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#666666]">Filter Gateway:</span>
                    <select
                      value={donationFilter}
                      onChange={(e) => setDonationFilter(e.target.value as any)}
                      className="px-3 py-1.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs font-bold text-[#171717] focus:outline-none"
                    >
                      <option value="All">All Gateways ({donations.length})</option>
                      <option value="OPay">OPay</option>
                      <option value="PalmPay">PalmPay</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                </div>

                {/* Summary Banner */}
                <div className="bg-[#8B0000] text-white p-5 rounded-2xl flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-white/80 font-bold block">Total Funds Seeded</span>
                    <h3 className="text-2xl sm:text-3xl font-black font-heading text-white">₦{(Number(totalDonationsAmount) || 0).toLocaleString()}</h3>
                  </div>
                  <div className="text-xs text-white/90 space-y-1 text-right">
                    <div>OPay Merchant: <strong>{settings.opayMerchantAccount}</strong></div>
                    <div>PalmPay Merchant: <strong>{settings.palmpayMerchantAccount}</strong></div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FAFAFA] text-[#666666] border-y border-[#E5E5E5] font-bold">
                      <tr>
                        <th className="p-3">Reference</th>
                        <th className="p-3">Partner Name</th>
                        <th className="p-3">Gateway</th>
                        <th className="p-3">Purpose</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {filteredDonations.map((d) => (
                        <tr key={d.id} className="hover:bg-[#FAFAFA]">
                          <td className="p-3 font-mono font-bold text-[#8B0000]">{d.reference}</td>
                          <td className="p-3 font-semibold text-[#171717]">
                            <div>{d.donorName}</div>
                            {d.donorPhone && <span className="text-[10px] text-[#666666]">{d.donorPhone}</span>}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              d.paymentMethod === 'OPay'
                                ? 'bg-[#00B875]/10 text-[#008753] border border-[#00B875]/30'
                                : d.paymentMethod === 'PalmPay'
                                ? 'bg-[#6F32E2]/10 text-[#6F32E2] border border-[#6F32E2]/30'
                                : 'bg-[#FDECEC] text-[#8B0000] border border-[#F8D0D0]'
                            }`}>
                              {d.paymentMethod}
                            </span>
                          </td>
                          <td className="p-3 text-[#666666] max-w-[200px] truncate">{d.purpose}</td>
                          <td className="p-3 font-bold text-[#171717]">₦{(Number(d?.amount) || 0).toLocaleString()}</td>
                          <td className="p-3 text-[#666666]">{d.date}</td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                if (confirm(`Remove donation record ${d.reference}?`)) deleteDonation(d.id);
                              }}
                              className="p-1 text-[#666666] hover:text-[#B5121B] cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= TAB: ADMIN ACCESS CONTROL & PINS ================= */}
            {currentTab === 'access' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-6">
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h2 className="text-lg font-bold font-heading text-[#171717] flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#B5121B]" />
                        <span>Administrator Access Control & Master PINs</span>
                      </h2>
                      <p className="text-xs text-[#666666] mt-0.5">
                        Manage authorized administrator Google emails, assign executive roles, and configure master security PINs.
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 bg-[#FDECEC] text-[#8B0000] font-bold rounded-full border border-[#F8D0D0]">
                      {authorizedAdmins.length} Authorized Admin{authorizedAdmins.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                {/* Feedback Alerts */}
                {adminActionFeedback && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{adminActionFeedback}</span>
                  </div>
                )}
                {pinActionFeedback && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pinActionFeedback}</span>
                  </div>
                )}

                {/* Public Access Architecture Notice */}
                <div className="p-4 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#B5121B]/10 text-[#B5121B] flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[#171717] block">Campus Fellowship Public Access Architecture</span>
                    <p className="text-[#666666] leading-relaxed">
                      FUTA students and campus fellowship members do <strong>not</strong> need to create accounts or log in. All sermons, study materials, past questions, announcements, fellowship details, and giving channels are open to the public without barriers. Only verified administrators added below can access this management console.
                    </p>
                  </div>
                </div>

                {/* Primary Superadmin Profile */}
                <div className="p-5 bg-gradient-to-r from-[#FDECEC] to-white rounded-2xl border-2 border-[#F8D0D0] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#B5121B] text-white flex items-center justify-center font-bold font-heading text-sm shadow-xs">
                        PRO
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#171717]">Jayeoba Peace Olamide</h3>
                          <span className="text-[10px] px-2 py-0.5 bg-[#B5121B] text-white font-bold rounded-full uppercase tracking-wider">
                            Primary Superadmin
                          </span>
                        </div>
                        <span className="text-xs font-mono text-[#8B0000] font-semibold">
                          jayeobapeace19459@gmail.com
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-[#666666]">
                      <div className="font-bold text-[#171717]">Central Executive Council</div>
                      <div>Public Relations Office (Permanent Root)</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#666666] border-t border-[#F8D0D0] pt-2">
                    This account is the permanent root administrator. Any Google authentication matching this email automatically inherits full Superadmin privileges across all databases, stewardship logs, and system settings.
                  </p>
                </div>

                {/* Grid: Add New Admin + Security PINs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  
                  {/* Card 1: Authorize New Administrator */}
                  <div className="p-5 bg-white rounded-2xl border border-[#E5E5E5] shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
                      <div className="w-7 h-7 rounded-lg bg-[#B5121B]/10 text-[#B5121B] flex items-center justify-center">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#171717]">
                          Authorize New Administrator
                        </h3>
                        <p className="text-[11px] text-[#666666]">
                          Grant access to an executive officer via their Google Email.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleAddAdminSubmit} className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-[#171717] block mb-1">
                          Officer Google Email Address: <span className="text-[#B5121B]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. assistant.pro@gmail.com or president.jccf@futa.edu.ng"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#171717] block mb-1">
                          Officer Full Name & Portfolio:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Bro. Emmanuel Adeleke (President)"
                          value={newAdminName}
                          onChange={(e) => setNewAdminName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#171717] block mb-1">
                          Administrative Privilege Level:
                        </label>
                        <select
                          value={newAdminRole}
                          onChange={(e) => setNewAdminRole(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none cursor-pointer"
                        >
                          <option value="superadmin">Superadmin (Full Access, PINs & Access Control)</option>
                          <option value="admin">Admin (Events, Fellowships, Announcements, Resources)</option>
                          <option value="executive">Executive (Announcements, Media & Study Materials)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isAddingAdmin}
                        className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{isAddingAdmin ? 'Authorizing...' : 'Grant Administrator Privileges'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Card 2: Master & Executive Security PINs */}
                  <div className="p-5 bg-white rounded-2xl border border-[#E5E5E5] shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-3">
                      <div className="w-7 h-7 rounded-lg bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-[#171717]">
                          Security PIN Credentials
                        </h3>
                        <p className="text-[11px] text-[#666666]">
                          Configure instant emergency PINs for quick council console access.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdatePinsSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-[#171717]">Master Superadmin PIN:</label>
                          <button
                            type="button"
                            onClick={() => setShowSuperadminPin(!showSuperadminPin)}
                            className="text-[10px] text-[#666666] hover:text-[#171717] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            {showSuperadminPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showSuperadminPin ? 'Hide PIN' : 'Reveal PIN'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showSuperadminPin ? 'text' : 'password'}
                            required
                            placeholder="e.g. 778899"
                            value={superadminPinInput}
                            onChange={(e) => setSuperadminPinInput(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs font-mono font-bold text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none tracking-wider"
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-[#666666] bg-white px-2 py-0.5 rounded border border-[#E5E5E5]">
                            Full Superadmin
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-[#171717]">Executive Council Officer PIN:</label>
                          <button
                            type="button"
                            onClick={() => setShowExecutivePin(!showExecutivePin)}
                            className="text-[10px] text-[#666666] hover:text-[#171717] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            {showExecutivePin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showExecutivePin ? 'Hide PIN' : 'Reveal PIN'}</span>
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showExecutivePin ? 'text' : 'password'}
                            required
                            placeholder="e.g. 123456"
                            value={executivePinInput}
                            onChange={(e) => setExecutivePinInput(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs font-mono font-bold text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none tracking-wider"
                          />
                          <span className="absolute right-3 top-2.5 text-[10px] font-bold text-[#666666] bg-white px-2 py-0.5 rounded border border-[#E5E5E5]">
                            Council Officers
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#FAFAFA] rounded-xl text-[11px] text-[#666666] space-y-1 border border-[#E5E5E5]">
                        <div className="font-bold text-[#171717] flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#8B0000]" />
                          <span>Instant PIN Usage:</span>
                        </div>
                        <p>Officers can enter either PIN directly in the admin login gateway without requiring a password or Google OAuth.</p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#171717] hover:bg-[#333333] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Update Security PINs in Database</span>
                      </button>
                    </form>
                  </div>

                </div>

                {/* Section: Authorized Administrators Directory */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#171717] flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#B5121B]" />
                      <span>Authorized Administrator Accounts ({authorizedAdmins.length})</span>
                    </h3>
                    <span className="text-[11px] text-[#666666]">
                      Synced with PostgreSQL Cloud SQL & Firebase Auth
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-[#E5E5E5]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAFAFA] text-[#666666] border-b border-[#E5E5E5] font-bold">
                        <tr>
                          <th className="p-3">Administrator / Officer</th>
                          <th className="p-3">Authorized Google Email</th>
                          <th className="p-3">Assigned Role</th>
                          <th className="p-3">Date Added</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5] bg-white">
                        {authorizedAdmins.map((admin) => {
                          const isPrimary = admin.email.toLowerCase() === 'jayeobapeace19459@gmail.com';
                          return (
                            <tr key={admin.email} className="hover:bg-[#FAFAFA]/80 transition-colors">
                              <td className="p-3 font-semibold text-[#171717]">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-[#B5121B]/10 text-[#B5121B] font-bold text-xs flex items-center justify-center shrink-0">
                                    {admin.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#171717]">{admin.name || 'Administrator'}</div>
                                    <div className="text-[10px] text-[#666666]">{admin.addedBy ? `By ${admin.addedBy}` : 'Central Council'}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3 font-mono text-xs text-[#171717]">
                                <div className="flex items-center gap-1.5">
                                  <span>{admin.email}</span>
                                  <button
                                    onClick={() => handleCopyEmail(admin.email)}
                                    title="Copy Email"
                                    className="p-1 hover:bg-[#E5E5E5] rounded text-[#666666] cursor-pointer"
                                  >
                                    {copiedEmail === admin.email ? (
                                      <Check className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>

                              <td className="p-3">
                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                                  admin.role === 'superadmin' 
                                    ? 'bg-[#FDECEC] text-[#8B0000] border border-[#F8D0D0]' 
                                    : admin.role === 'executive'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                  {admin.role || 'Admin'}
                                </span>
                              </td>

                              <td className="p-3 text-[11px] text-[#666666]">
                                {admin.addedAt || 'Permanent'}
                              </td>

                              <td className="p-3 text-right">
                                {isPrimary ? (
                                  <span className="text-[10px] text-[#666666] font-semibold italic">
                                    Permanent Root
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => {
                                      if (confirm(`Revoke administrative access from ${admin.email}?`)) {
                                        removeAuthorizedAdmin(admin.email);
                                      }
                                    }}
                                    className="px-2.5 py-1 bg-[#FDECEC] hover:bg-[#B5121B] text-[#8B0000] hover:text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer border border-[#F8D0D0]"
                                    title="Revoke Admin Access"
                                  >
                                    Revoke
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================= TAB 9: SETTINGS & SECURITY ================= */}
            {currentTab === 'settings' && (
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-xs space-y-6">
                <div>
                  <h2 className="text-lg font-bold font-heading text-[#171717]">
                    Superadmin & System Configuration
                  </h2>
                  <p className="text-xs text-[#666666]">
                    Configure theme parameters, payment merchant credentials, and Superadmin Master PIN.
                  </p>
                </div>

                {settingsSaved && (
                  <div className="p-3 bg-[#FDECEC] text-[#8B0000] border border-[#F8D0D0] rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#B5121B]" />
                    <span>Configuration saved and updated successfully across the entire website!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl">
                  <div className="p-4 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#8B0000] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Superadmin Security Credentials</span>
                    </h3>
                    
                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">Master Superadmin PIN:</label>
                      <input
                        type="text"
                        value={tempSettings.superadminPin}
                        onChange={(e) => setTempSettings({ ...tempSettings, superadminPin: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-xs font-mono font-bold text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#171717] block mb-1">Superadmin Official Email:</label>
                      <input
                        type="email"
                        value={tempSettings.superadminEmail}
                        onChange={(e) => setTempSettings({ ...tempSettings, superadminEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-[#00B875]/5 rounded-2xl border border-[#00B875]/30 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#008753] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>OPay & PalmPay Merchant API Configuration</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#171717] block mb-1">OPay Account No:</label>
                        <input
                          type="text"
                          value={tempSettings.opayMerchantAccount}
                          onChange={(e) => setTempSettings({ ...tempSettings, opayMerchantAccount: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs font-mono text-[#171717]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#171717] block mb-1">OPay Beneficiary:</label>
                        <input
                          type="text"
                          value={tempSettings.opayMerchantName}
                          onChange={(e) => setTempSettings({ ...tempSettings, opayMerchantName: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#171717] block mb-1">PalmPay Account No:</label>
                        <input
                          type="text"
                          value={tempSettings.palmpayMerchantAccount}
                          onChange={(e) => setTempSettings({ ...tempSettings, palmpayMerchantAccount: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs font-mono text-[#171717]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#171717] block mb-1">PalmPay Beneficiary:</label>
                        <input
                          type="text"
                          value={tempSettings.palmpayMerchantName}
                          onChange={(e) => setTempSettings({ ...tempSettings, palmpayMerchantName: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#171717] block mb-1">Annual Theme:</label>
                    <input
                      type="text"
                      value={tempSettings.annualTheme}
                      onChange={(e) => setTempSettings({ ...tempSettings, annualTheme: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#171717] block mb-1">Theme Scripture Anchor:</label>
                    <input
                      type="text"
                      value={tempSettings.themeScripture}
                      onChange={(e) => setTempSettings({ ...tempSettings, themeScripture: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save System Configuration</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Reset entire app to factory sample dataset?')) resetToFactoryDefaults();
                      }}
                      className="px-4 py-3 bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#8B0000] border border-[#E5E5E5] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Factory Reset</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* ================= MODAL: CREATE / EDIT ANNOUNCEMENT ================= */}
      {announcementModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E5E5] space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold font-heading text-[#171717]">
                {announcementModalMode === 'edit' ? 'Edit Bulletin' : 'Create Announcement Bulletin'}
              </h3>
              <button onClick={() => setAnnouncementModalMode(null)} className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Headline / Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100L Physics Mock Timetable"
                  value={activeAnnouncement.title || ''}
                  onChange={(e) => setActiveAnnouncement({ ...activeAnnouncement, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] focus:ring-2 focus:ring-[#B5121B] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Category:</label>
                  <select
                    value={activeAnnouncement.category || 'Official Notice'}
                    onChange={(e) => setActiveAnnouncement({ ...activeAnnouncement, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  >
                    <option value="Official Notice">Official Notice</option>
                    <option value="Academic">Academic</option>
                    <option value="Welfare">Welfare</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Event Alert">Event Alert</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Author / Office:</label>
                  <input
                    type="text"
                    value={activeAnnouncement.author || ''}
                    onChange={(e) => setActiveAnnouncement({ ...activeAnnouncement, author: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Brief Summary:</label>
                <input
                  type="text"
                  placeholder="Short 1-sentence summary"
                  value={activeAnnouncement.summary || ''}
                  onChange={(e) => setActiveAnnouncement({ ...activeAnnouncement, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Full Content / Circular Body:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed circular text..."
                  value={activeAnnouncement.content || ''}
                  onChange={(e) => setActiveAnnouncement({ ...activeAnnouncement, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ann-feat"
                  checked={activeAnnouncement.isFeatured || false}
                  onChange={(e) => setActiveAnnouncement({ ...activeAnnouncement, isFeatured: e.target.checked })}
                />
                <label htmlFor="ann-feat" className="text-xs font-semibold text-[#171717]">Pin as Featured Bulletin on Homepage</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
              >
                {announcementModalMode === 'edit' ? 'Update & Save Changes' : 'Publish Bulletin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT MEDIA ================= */}
      {mediaModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E5E5] space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold font-heading text-[#171717]">
                {mediaModalMode === 'edit' ? 'Edit Sermon / Media Record' : 'Add New Sermon or Broadcast'}
              </h3>
              <button onClick={() => setMediaModalMode(null)} className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Sermon / Video Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking in Academic Dominion"
                  value={activeMedia.title || ''}
                  onChange={(e) => setActiveMedia({ ...activeMedia, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Category:</label>
                  <select
                    value={activeMedia.category || 'Sermon'}
                    onChange={(e) => setActiveMedia({ ...activeMedia, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  >
                    <option value="Sermon">Sermon</option>
                    <option value="Mega Praise">Mega Praise</option>
                    <option value="Worship">Worship</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Minister / Speaker:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pastor Adeola Samuel"
                    value={activeMedia.minister || ''}
                    onChange={(e) => setActiveMedia({ ...activeMedia, minister: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">YouTube Video ID:</label>
                  <input
                    type="text"
                    placeholder="e.g. dQw4w9WgXcQ"
                    value={activeMedia.youtubeId || ''}
                    onChange={(e) => setActiveMedia({ ...activeMedia, youtubeId: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717] font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Duration:</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 hr 15 mins"
                    value={activeMedia.duration || ''}
                    onChange={(e) => setActiveMedia({ ...activeMedia, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Thumbnail Image URL:</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={activeMedia.thumbnail || ''}
                  onChange={(e) => setActiveMedia({ ...activeMedia, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Description:</label>
                <textarea
                  rows={3}
                  placeholder="Brief sermon excerpt..."
                  value={activeMedia.description || ''}
                  onChange={(e) => setActiveMedia({ ...activeMedia, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
              >
                {mediaModalMode === 'edit' ? 'Update Media Record' : 'Publish to Media Vault'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/85 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#E5E5E5] space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-heading text-[#171717]">{previewMedia.title}</h3>
              <button onClick={() => setPreviewMedia(null)} className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-md">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewMedia.youtubeId}?autoplay=1`}
                title={previewMedia.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT EVENT ================= */}
      {eventModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E5E5] space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold font-heading text-[#171717]">
                {eventModalMode === 'edit' ? 'Edit Fellowship Event' : 'Schedule New Fellowship Event'}
              </h3>
              <button onClick={() => setEventModalMode(null)} className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Event Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mega Praise 2026"
                  value={activeEvent.title || ''}
                  onChange={(e) => setActiveEvent({ ...activeEvent, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Category:</label>
                  <select
                    value={activeEvent.category || 'Mega Service'}
                    onChange={(e) => setActiveEvent({ ...activeEvent, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  >
                    <option value="Mega Service">Mega Service</option>
                    <option value="Academic">Academic</option>
                    <option value="Prayer">Prayer</option>
                    <option value="Conference">Conference</option>
                    <option value="Special">Special</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Date:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Friday, Nov 14, 2026"
                    value={activeEvent.date || ''}
                    onChange={(e) => setActiveEvent({ ...activeEvent, date: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Time:</label>
                  <input
                    type="text"
                    placeholder="5:00 PM Prompt"
                    value={activeEvent.time || ''}
                    onChange={(e) => setActiveEvent({ ...activeEvent, time: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Venue (FUTA Campus):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2500 Capacity Auditorium"
                    value={activeEvent.venue || ''}
                    onChange={(e) => setActiveEvent({ ...activeEvent, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Description:</label>
                <textarea
                  rows={3}
                  placeholder="Program theme and overview..."
                  value={activeEvent.description || ''}
                  onChange={(e) => setActiveEvent({ ...activeEvent, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
              >
                {eventModalMode === 'edit' ? 'Save Event Changes' : 'Publish to Calendar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT FELLOWSHIP ================= */}
      {fellowshipModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E5E5] space-y-4 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold font-heading text-[#171717]">
                {fellowshipModalMode === 'edit' ? 'Edit Member Fellowship' : 'Register Fellowship'}
              </h3>
              <button onClick={() => setFellowshipModalMode(null)} className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFellowship} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#171717] block mb-1">Fellowship Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Redeemed Christian Fellowship"
                    value={activeFellowship.name || ''}
                    onChange={(e) => setActiveFellowship({ ...activeFellowship, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Acronym:</label>
                  <input
                    type="text"
                    required
                    placeholder="RCF"
                    value={activeFellowship.acronym || ''}
                    onChange={(e) => setActiveFellowship({ ...activeFellowship, acronym: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Category:</label>
                  <select
                    value={activeFellowship.category || 'Denominational'}
                    onChange={(e) => setActiveFellowship({ ...activeFellowship, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  >
                    <option value="Denominational">Denominational</option>
                    <option value="Evangelical">Evangelical</option>
                    <option value="Pentecostal">Pentecostal</option>
                    <option value="Inter-denominational">Inter-denominational</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Campus Venue:</label>
                  <input
                    type="text"
                    placeholder="e.g. EFT Block Hall"
                    value={activeFellowship.meetingVenue || ''}
                    onChange={(e) => setActiveFellowship({ ...activeFellowship, meetingVenue: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">President Name:</label>
                  <input
                    type="text"
                    value={activeFellowship.presidentName || ''}
                    onChange={(e) => setActiveFellowship({ ...activeFellowship, presidentName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">President Phone:</label>
                  <input
                    type="text"
                    value={activeFellowship.presidentContact || ''}
                    onChange={(e) => setActiveFellowship({ ...activeFellowship, presidentContact: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Fellowship Motto / Vision:</label>
                <input
                  type="text"
                  value={activeFellowship.motto || ''}
                  onChange={(e) => setActiveFellowship({ ...activeFellowship, motto: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
              >
                {fellowshipModalMode === 'edit' ? 'Update Fellowship Data' : 'Add to Official Directory'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT EXECUTIVE ================= */}
      {executiveModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E5E5] space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold font-heading text-[#171717]">
                {executiveModalMode === 'edit' ? 'Edit Executive Officer' : 'Add Council Leader'}
              </h3>
              <button onClick={() => setExecutiveModalMode(null)} className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveExecutive} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bro. Emmanuel Adeleke"
                  value={activeExecutive.name || ''}
                  onChange={(e) => setActiveExecutive({ ...activeExecutive, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Office / Portfolio:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Public Relations Officer"
                    value={activeExecutive.office || ''}
                    onChange={(e) => setActiveExecutive({ ...activeExecutive, office: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Department:</label>
                  <input
                    type="text"
                    placeholder="e.g. Mechanical Engineering"
                    value={activeExecutive.department || ''}
                    onChange={(e) => setActiveExecutive({ ...activeExecutive, department: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Phone Number:</label>
                  <input
                    type="text"
                    value={activeExecutive.phone || ''}
                    onChange={(e) => setActiveExecutive({ ...activeExecutive, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Photo URL:</label>
                  <input
                    type="text"
                    value={activeExecutive.photoUrl || ''}
                    onChange={(e) => setActiveExecutive({ ...activeExecutive, photoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
              >
                {executiveModalMode === 'edit' ? 'Update Council Member' : 'Add to Roster'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT RESOURCE ================= */}
      {resourceModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E5E5] space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <h3 className="text-base font-bold font-heading text-[#171717]">
                {resourceModalMode === 'edit' ? 'Edit Study Material' : 'Upload Past Question / Material'}
              </h3>
              <button onClick={() => setResourceModalMode(null)} className="w-8 h-8 rounded-full bg-[#FAFAFA] flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#171717] block mb-1">Resource Title & Course Code:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MEE 201 Applied Mechanics Solved Past Questions (2018-2025)"
                  value={activeResource.title || ''}
                  onChange={(e) => setActiveResource({ ...activeResource, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Category:</label>
                  <select
                    value={activeResource.category || 'Study Materials'}
                    onChange={(e) => setActiveResource({ ...activeResource, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  >
                    <option value="Study Materials">Study Materials</option>
                    <option value="Sermons">Sermons</option>
                    <option value="Documents">Documents</option>
                    <option value="Publications">Publications</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">Level:</label>
                  <input
                    type="text"
                    placeholder="100L / 200L / All"
                    value={activeResource.level || ''}
                    onChange={(e) => setActiveResource({ ...activeResource, level: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">File Format:</label>
                  <select
                    value={activeResource.fileType || 'PDF'}
                    onChange={(e) => setActiveResource({ ...activeResource, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="MP3">MP3</option>
                    <option value="ZIP">ZIP</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#171717] block mb-1">File Size:</label>
                  <input
                    type="text"
                    placeholder="e.g. 4.2 MB"
                    value={activeResource.fileSize || ''}
                    onChange={(e) => setActiveResource({ ...activeResource, fileSize: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs text-[#171717]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
              >
                {resourceModalMode === 'edit' ? 'Update Resource' : 'Publish Resource'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
