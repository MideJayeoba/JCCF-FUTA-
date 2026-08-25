import React from 'react';
import { Heart, ArrowRight, ShieldCheck, Gift, Sparkles, Building2 } from 'lucide-react';

interface GivingSectionProps {
  onOpenGiveModal: () => void;
}

export const GivingSection: React.FC<GivingSectionProps> = ({ onOpenGiveModal }) => {
  return (
    <section id="give" className="py-16 sm:py-24 bg-[#8B0000] text-white relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-[radial-gradient(#D62828_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider border border-white/20">
            <Heart className="w-3.5 h-3.5 fill-white/80" />
            <span>Kingdom Stewardship</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white leading-tight">
            Support the Work of God in FUTA
          </h2>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-white/90 leading-relaxed font-normal">
            Your sacrificial giving sustains campus evangelism, finances the Student Welfare Food Bank for indigent students, provides free academic tutorial manuals, and powers the Annual Mega Praise.
          </p>

          {/* Key Giving Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80 block">Student Welfare</span>
              <p className="text-xs text-white/90 mt-1">Emergency food packs, fees, and distress accommodation relief.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80 block">Evangelism & Media</span>
              <p className="text-xs text-white/90 mt-1">Gospel tracts, rural village mission trips, and digital live streaming.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
              <span className="text-xs font-bold uppercase tracking-wider text-white/80 block">Mega Praise 2026</span>
              <p className="text-xs text-white/90 mt-1">Mass choir staging, sound consoles, and security logistics.</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-6">
            <button
              onClick={onOpenGiveModal}
              className="px-9 py-4 bg-white hover:bg-[#FDECEC] text-[#8B0000] font-black text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Heart className="w-5 h-5 fill-[#8B0000]" />
              <span>Give Now (Online & Direct Transfer)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-white/70 italic pt-2">
            “Every man according as he purposeth in his heart, so let him give; not grudgingly... for God loveth a cheerful giver.” — 2 Corinthians 9:7
          </p>

        </div>
      </div>
    </section>
  );
};
