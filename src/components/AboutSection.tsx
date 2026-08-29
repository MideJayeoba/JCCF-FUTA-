import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, BookOpen, Flame, Heart } from 'lucide-react';

interface AboutSectionProps {
  onLearnMore: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Strong Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white aspect-[4/3] bg-white">
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=80"
                alt="JCCF FUTA Campus Believers Assembled"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#8B0000]/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#B5121B] px-2 py-0.5 rounded">
                  Since 1996/97
                </span>
                <p className="text-xs sm:text-sm font-semibold mt-1 drop-shadow-sm">
                  Unbroken Campus Inter-Denominational Fellowship & Revival at FUTA
                </p>
              </div>
            </div>

            {/* Accent Card */}
            <div className="hidden sm:flex absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-[#E5E5E5] items-center gap-3 max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center shrink-0 border border-[#F8D0D0]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#171717] block">24+ Member Fellowships</span>
                <span className="text-[11px] text-[#666666]">Formally Registered Under FUTA Management</span>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Pillars */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
              <span>About JCCF FUTA (The Household)</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight font-heading leading-tight">
              Till We All Come In The <br />
              <span className="text-[#B5121B]">Unity of Faith</span>
            </h2>

            <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
              The Joint Christian Campus Fellowship (JCCF) FUTA is the apex non-denominational body representing Protestant Christian fellowships across the Federal University of Technology, Akure.
            </p>

            <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
              Founded on the scriptural mandate of Ephesians 4:13, our emphasis is not merely the conglomeration of campus fellowships, but the oneness of purpose pressing towards the mark of growing into the measure of the stature of the fullness of Christ.
            </p>

            {/* Quick Feature Checklist in Red/White */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#171717]">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0" />
                <span>Inter-Fellowship Unity & Harmony</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#171717]">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0" />
                <span>Combined Resumption Prayers & Vigils</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#171717]">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0" />
                <span>Sessional Change of Pulpit</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#171717]">
                <CheckCircle2 className="w-4 h-4 text-[#B5121B] shrink-0" />
                <span>25+ Registered Constituent Fellowships</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3">
              <button
                onClick={onLearnMore}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md"
              >
                <span>Learn More About JCCF</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
