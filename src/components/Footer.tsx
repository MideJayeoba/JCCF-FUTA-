import React from 'react';
import { NavigationPage } from '../types';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Lock, 
  ArrowUp, 
  ShieldCheck,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';
import { JCCFLogo } from './JCCFLogo';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenGiveModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenGiveModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: NavigationPage) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#8B0000] text-white pt-16 pb-12 border-t border-[#B5121B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/15 text-left">
          
          {/* Col 1 & 2: Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white p-0.5 shadow-md flex items-center justify-center">
                <JCCFLogo size={44} />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white font-heading block leading-none">
                  JCCF FUTA
                </span>
                <span className="text-[11px] text-white/80 font-medium">
                  Joint Christian Campus Fellowship
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm">
              The apex coordinating Christian fellowship body at the Federal University of Technology Akure, committed to spiritual revival, student welfare, inter-fellowship unity, and kingdom impact.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenGiveModal}
                className="px-4 py-2 bg-white text-[#8B0000] hover:bg-[#FDECEC] font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Heart className="w-3.5 h-3.5 fill-[#8B0000]" />
                <span>Give / Partner</span>
              </button>

              <button
                onClick={() => handleNav('admin')}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-white/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition-colors cursor-pointer">
                  About JCCF & Story
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('fellowships')} className="hover:text-white transition-colors cursor-pointer">
                  Member Fellowships (24+)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('executives')} className="hover:text-white transition-colors cursor-pointer">
                  Executive Council
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('events')} className="hover:text-white transition-colors cursor-pointer">
                  Upcoming Events & Calendar
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources & Media */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90">
              Spiritual & Secretariat
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => handleNav('announcements')} className="hover:text-white transition-colors cursor-pointer">
                  Official Bulletins & Notices
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-white transition-colors cursor-pointer">
                  Study Manuals & Hymnals
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-white transition-colors cursor-pointer">
                  JCCF Constitution (2024)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('media')} className="hover:text-white transition-colors cursor-pointer">
                  YouTube Broadcasts & Media
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('get-involved')} className="hover:text-white transition-colors cursor-pointer">
                  Household Service Units (5)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Secretariat & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90">
              Secretariat Location
            </h4>
            <div className="space-y-2.5 text-xs text-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <span>Chapel Secretariat, Near South Gate, FUTA Main Campus, Akure, Ondo State.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                <span>+234 803 111 2233 / +234 813 888 9900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white shrink-0" />
                <span>secretariat.jccf@futa.edu.ng</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} JCCF FUTA. All rights reserved. Joint Christian Campus Fellowship, Federal University of Technology Akure.
          </p>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer border border-white/20"
            title="Scroll to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
