import React, { useState } from 'react';
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
  Youtube,
  Send,
  X
} from 'lucide-react';
import { JCCFLogo } from './JCCFLogo';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenGiveModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenGiveModal }) => {
  const [isTributeOpen, setIsTributeOpen] = useState(false);
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

            {/* Social Media Stay In Touch */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://chat.whatsapp.com/LkLMVfYoOI216cfr4pD3gm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all shadow-xs border border-white/10 hover:border-[#25D366]"
                title="WhatsApp Group"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029Vay9yRR3wtb1yrhKOh3w"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all shadow-xs border border-white/10 hover:border-[#25D366]"
                title="WhatsApp Channel"
              >
                <ShieldCheck className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/jccffuta_gram?igsh=MXJ0djVtYnBhNmgyNQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#E1306C] text-white flex items-center justify-center transition-all shadow-xs border border-white/10 hover:border-[#E1306C]"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/jccf_futa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#0088cc] text-white flex items-center justify-center transition-all shadow-xs border border-white/10 hover:border-[#0088cc]"
                title="Telegram Channel"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/people/JCCF-FUTA/100067526830978/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all shadow-xs border border-white/10 hover:border-[#1877F2]"
                title="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@jccf_futa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all shadow-xs border border-white/10 hover:border-[#FF0000]"
                title="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

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
                  JCCF Household
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
              Resources & Media
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button onClick={() => handleNav('announcements')} className="hover:text-white transition-colors cursor-pointer">
                  Official releases
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-white transition-colors cursor-pointer">
                  Available resources
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-white transition-colors cursor-pointer">
                  Available resources
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
                <span>JCCF Secretariat, Airforce 1 axis, Off South Gate, FUTA, Akure, Ondo State.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                <span>+234 803 111 2233 / +234 813 888 9900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white shrink-0" />
                <span>futajccf@gmail.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Developer Tribute Ribbon/Banner (Spreads full width under all columns) */}
        <div
          onClick={() => setIsTributeOpen(true)}
          className="mt-8 p-5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer transition-all w-full group shadow-xs hover:shadow-md hover:scale-[1.01]"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/20 bg-black/25">
              <img
                src="/mide.png"
                alt="Jayeoba Peace (Mide)"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80";
                }}
              />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase text-[#B5121B] bg-white px-2 py-0.5 rounded shadow-sm inline-block mb-1.5 tracking-wider leading-none">
                Web Architect & Developer
              </span>
              <h4 className="text-sm font-bold text-white leading-tight font-heading">
                Meet the Developer: Jayeoba Peace (Mide)
              </h4>
              <p className="text-[11px] text-white/70 mt-0.5">
                The 28th Generation JCCF PRO who engineered this portal for our fellowship's digital operations.
              </p>
            </div>
          </div>
          <button
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FDECEC] text-[#8B0000] font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 group-hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              setIsTributeOpen(true);
            }}
          >
            <span>Check out</span>
            <ArrowUp className="w-3.5 h-3.5 rotate-90" />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div className="text-center sm:text-left space-y-1">
            <p>
              © {new Date().getFullYear()} JCCF FUTA. All rights reserved. Joint Campus Christian Fellowship, Federal University of Technology Akure.
            </p>
          </div>

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
      {/* Developer Tribute Modal */}
      {isTributeOpen && (
        <div
          onClick={() => setIsTributeOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/85 backdrop-blur-xs animate-in fade-in overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E5E5E5] flex flex-col md:flex-row text-left max-h-[90vh] my-auto text-[#171717] animate-in slide-in-from-bottom duration-300"
          >
            {/* Left Column: Portrait photo in full height */}
            <div className="md:w-1/2 w-full h-80 md:h-[480px] relative overflow-hidden bg-[#FAFAFA] shrink-0 border-r border-[#E5E5E5]">
              <img
                src="/mide.png"
                alt="Jayeoba Peace (Mide)"
                className="w-full h-full object-cover object-top animate-in fade-in duration-500"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent md:hidden" />
              <div className="absolute bottom-4 left-4 right-4 md:hidden text-white">
                <span className="text-[9px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2 py-0.5 rounded shadow-md">
                  Software Developer
                </span>
                <h3 className="text-lg font-black font-heading mt-1">Jayeoba Peace Olamide</h3>
                <p className="text-xs text-white/90">28th Generation JCCF PRO</p>
              </div>
            </div>

            {/* Right Column: Tribute Content */}
            <div className="md:w-1/2 w-full p-6 flex flex-col justify-between overflow-y-auto max-h-[480px]">
              <div className="space-y-4">
                {/* Header for desktop only */}
                <div className="hidden md:flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black uppercase text-[#B5121B] bg-[#FDECEC] border border-[#F8D0D0] px-2 py-0.5 rounded shadow-2xs inline-block mb-1.5 tracking-wider">
                      Software Developer
                    </span>
                    <h3 className="text-base font-black text-[#171717] font-heading leading-tight">
                      Jayeoba Peace Olamide
                    </h3>
                    <p className="text-xs text-[#666666] font-semibold mt-0.5">
                      28th Generation JCCF PRO
                    </p>
                  </div>
                  <button
                    onClick={() => setIsTributeOpen(false)}
                    className="w-7 h-7 rounded-full bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Story text */}
                <div className="text-xs space-y-3.5 leading-relaxed text-[#666666] pt-1">
                  <p>
                    This unified digital platform was envisioned, designed, and developed by <strong>Jayeoba Peace Olamide (Mide)</strong> during his tenure as the Public Relations Officer of the 28th JCCF Administration — Restorers Generation (2025/2026).
                  </p>
                  <p>
                    Born from a vision to create a transparent, accessible, and centralized digital hub for the FUTA campus church, the platform brings together essential JCCF activities and resources, including registry of fellowships information, the executives, Past presidents, sermon archives, giving records, and more.
                  </p>
                  <p>
                    Beyond technology, Peace is a skillful and spirit-filled <strong>Music Minister</strong>, worship leader, keyboardist, and creative, with a passion for using technology to solve problems, improve experiences, and build meaningful digital solutions.
                  </p>
                  <p className="italic font-semibold text-[#171717] border-l-2 border-[#B5121B] pl-2.5 mt-2 bg-[#FAFAFA] py-1.5 rounded-r-lg">
                    "He believes technology is not just about building software, but about building solutions that serve people."
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-[#E5E5E5] space-y-2 mt-4">
                <a
                  href="https://api.whatsapp.com/send/?phone=%2B2349067333517&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20b855] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                >
                  <Phone className="w-4 h-4" />
                  <span>Connect with Mide on WhatsApp</span>
                </a>
                <button
                  onClick={() => setIsTributeOpen(false)}
                  className="w-full py-2.5 bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] border border-[#E5E5E5] font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Done / Return to Page
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </footer>
  );
};
