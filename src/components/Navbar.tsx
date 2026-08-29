import React, { useState, useEffect } from 'react';
import { NavigationPage } from '../types';
import { 
  Menu, 
  X, 
  Heart, 
  ChevronRight,
  Lock,
  LogIn,
  LogOut,
  User as UserIcon,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { JCCFLogo } from './JCCFLogo';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenGiveModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenGiveModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, userProfile, isSuperAdmin: authIsSuperAdmin, isFirebaseConfigured, loginWithGoogle, logout } = useAuth();
  const { isSuperAdmin: appIsSuperAdmin, isSyncing } = useApp();

  const isSuper = authIsSuperAdmin || appIsSuperAdmin;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: NavigationPage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About', page: 'about' },
    { label: 'Fellowships', page: 'fellowships' },
    { label: 'Executives', page: 'executives' },
    { label: 'Events', page: 'events' },
    { label: 'Media', page: 'media' },
    { label: 'Resources', page: 'resources' }
  ];

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoogleAuth = async () => {
    try {
      if (currentUser) {
        await logout();
      } else {
        if (!isFirebaseConfigured) {
          onNavigate('admin');
          return;
        }
        await loginWithGoogle();
      }
    } catch (err: any) {
      console.warn('Navbar sign-in notice:', err?.message || err);
      onNavigate('admin');
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E5E5E5]'
          : 'bg-white border-b border-[#E5E5E5]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* JCCF FUTA Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            aria-label="JCCF FUTA Home"
          >
            {/* Official Logo Emblem */}
            <div className="relative group-hover:scale-105 transition-transform duration-200">
              <JCCFLogo size={46} />
            </div>

            {/* Wordmark */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#171717] font-heading">
                  JCCF FUTA
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#FDECEC] text-[#8B0000] border border-[#F8D0D0]">
                  Official
                </span>
              </div>
              <span className="block text-[11px] text-[#666666] font-medium leading-none">
                Joint Christian Campus Fellowship
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#B5121B] bg-[#FDECEC]'
                      : 'text-[#171717] hover:text-[#B5121B] hover:bg-[#FAFAFA]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Database sync status pill */}
            <div 
              title={isSyncing ? "Syncing with PostgreSQL..." : "Connected to Cloud SQL PostgreSQL"}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAFAFA] border border-[#E5E5E5] text-[11px] text-[#666666]"
            >
              <Database className={`w-3 h-3 ${isSyncing ? 'text-amber-500 animate-spin' : 'text-emerald-600'}`} />
              <span className="hidden xl:inline font-mono">PostgreSQL</span>
            </div>

            {/* User Account / Google Sign-in */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl px-2 py-1">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="avatar" 
                    className="w-7 h-7 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#B5121B] text-white flex items-center justify-center text-xs font-bold">
                    {currentUser.displayName?.[0] || 'U'}
                  </div>
                )}
                <div className="text-left leading-tight hidden xl:block">
                  <span className="block text-xs font-bold text-[#171717] truncate max-w-[100px]">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <span className="text-[10px] text-[#8B0000] font-semibold uppercase">
                    {userProfile?.role || (isSuper ? 'Superadmin' : 'Member')}
                  </span>
                </div>
                <button
                  onClick={handleGoogleAuth}
                  title="Sign out"
                  className="p-1 hover:bg-[#FDECEC] text-[#666666] hover:text-[#8B0000] rounded-md transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleAuth}
                className="px-3 py-1.5 border border-[#E5E5E5] hover:border-[#B5121B] bg-white hover:bg-[#FAFAFA] text-xs font-semibold text-[#171717] rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                title="Sign in with Google"
              >
                <LogIn className="w-3.5 h-3.5 text-[#B5121B]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Admin Portal Button */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                currentPage === 'admin'
                  ? 'bg-[#B5121B] text-white'
                  : isSuper
                  ? 'bg-[#FDECEC] text-[#8B0000] border border-[#F8D0D0]'
                  : 'text-[#666666] hover:text-[#171717] hover:bg-[#FAFAFA]'
              }`}
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="text-xs">{isSuper ? 'Console' : 'Admin'}</span>
            </button>

            {/* Give Button */}
            <button
              onClick={onOpenGiveModal}
              className="px-5 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 hover:shadow-md"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span>Give</span>
            </button>
          </div>

          {/* Mobile Menu & Give Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenGiveModal}
              className="px-3.5 py-1.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Give</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#171717] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E5E5] px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#FDECEC] text-[#B5121B]'
                    : 'text-[#171717] hover:bg-[#FAFAFA]'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#B5121B]' : 'text-[#666666]'}`} />
              </button>
            );
          })}

          <div className="pt-3 border-t border-[#E5E5E5] flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5]">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-[#B5121B]" />
                  <div className="text-xs text-[#171717] font-bold">
                    {currentUser.displayName || currentUser.email}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-[#8B0000] font-bold underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold text-[#171717] bg-[#FAFAFA] border border-[#E5E5E5] cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#B5121B]" />
                <span>Sign In with Google</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('announcements')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#666666] hover:bg-[#FAFAFA] text-left cursor-pointer"
            >
              <span>Announcements & News</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#8B0000] bg-[#FDECEC] text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Admin Console</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
