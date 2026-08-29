import React from 'react';
import { useApp } from '../context/AppContext';
import { JCCFLogo } from './JCCFLogo';
import { 
  ArrowRight, 
  Users, 
  MapPin, 
  Flame, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface HeroProps {
  onExploreJCCF?: () => void;
  onFindFellowship?: () => void;
  onNavigate?: (page: any) => void;
  onOpenGiveModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreJCCF,
  onFindFellowship,
  onNavigate,
  onOpenGiveModal
}) => {
  const { settings, fellowships } = useApp();

  const handleExplore = onExploreJCCF || (() => onNavigate?.('about'));
  const handleFellowships = onFindFellowship || (() => onNavigate?.('fellowships'));

  return (
    <section className="relative bg-[#FAFAFA] overflow-hidden border-b border-[#E5E5E5]">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#B5121B_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Red Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDECEC] border border-[#F8D0D0] text-[#8B0000] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#B5121B] animate-pulse" />
              <span>Federal University of Technology, Akure • Apex Christian Body</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#171717] tracking-tight leading-[1.1] font-heading">
              Building Faith. <br />
              <span className="text-[#B5121B]">Connecting Fellowships.</span> <br />
              Transforming Campus.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#666666] max-w-2xl leading-relaxed font-normal">
              Welcome to JCCF FUTA — coordinating, empowering, and uniting Christian fellowships, students, and leaders across the Federal University of Technology Akure for spiritual depth, covenant unity, and kingdom impact.
            </p>

            {/* CTAs in Red & White System */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={handleExplore}
                className="px-7 py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-sm sm:text-base rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore JCCF</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleFellowships}
                className="px-7 py-3.5 bg-white hover:bg-[#FDECEC] text-[#B5121B] border-2 border-[#B5121B] font-bold text-sm sm:text-base rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Users className="w-4 h-4" />
                <span>Find a Fellowship</span>
              </button>
            </div>

            {/* Key Campus Stat */}
            <div className="pt-6 border-t border-[#E5E5E5] flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3.5 bg-white px-4 py-3 rounded-2xl border border-[#E5E5E5] shadow-xs">
                <span className="text-3xl sm:text-4xl font-black text-[#B5121B] font-heading">24+</span>
                <div className="text-left">
                  <span className="text-sm font-extrabold text-[#171717] block font-heading">Fellowships Across FUTA</span>
                  <span className="text-xs text-[#666666]">Registered Christian campus fellowships united under JCCF</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Image / Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Editorial Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/5] bg-[#FAFAFA]">
                <img
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1000&q=80"
                  alt="FUTA Christian Students Fellowship Gathering"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#8B0000]/80 via-transparent to-transparent" />

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-[#E5E5E5] shadow-md text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#B5121B] block">
                        Annual Fellowship Theme
                      </span>
                      <h4 className="text-sm font-extrabold text-[#171717] font-heading">
                        {settings.annualTheme}
                      </h4>
                      <p className="text-[11px] text-[#666666] italic">
                        {settings.themeScripture}
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center shrink-0 border border-[#F8D0D0]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Official Crest Badge */}
              <div className="absolute -top-4 -left-4 bg-white p-2.5 rounded-2xl shadow-lg border border-[#E5E5E5] flex items-center gap-2.5">
                <div className="shrink-0">
                  <JCCFLogo size={36} />
                </div>
                <div className="text-left pr-2">
                  <span className="text-[10px] text-[#666666] uppercase font-bold block">FUTA Apex Body</span>
                  <span className="text-xs font-black text-[#171717]">Official Crest</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

