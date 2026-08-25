import React from 'react';
import { JCCF_HISTORY_MILESTONES } from '../data/history';
import { Clock, ShieldCheck, Sparkles, BookOpen, Flag } from 'lucide-react';

export const HistorySection: React.FC = () => {
  return (
    <section id="history" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F8D0D0]">
            <Clock className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>40+ Years of Faith & Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading tracking-tight">
            Our Story
          </h2>
          <p className="text-[#666666] mt-3 text-sm sm:text-base leading-relaxed">
            The transformative journey of JCCF FUTA — from a humble prayer gathering in 1982 to the unifying spiritual pillar of the university.
          </p>
        </div>

        {/* Visual Timeline with Red Indicators on Off-White */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#B5121B]/30 space-y-12 ml-4 sm:ml-12">
          {JCCF_HISTORY_MILESTONES.map((milestone, idx) => (
            <div key={idx} className="relative group text-left">
              
              {/* Red Timeline Node / Indicator */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-6 h-6 rounded-full bg-white border-4 border-[#B5121B] group-hover:scale-125 transition-transform shadow-xs" />

              {/* Milestone Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl sm:text-2xl font-black text-[#B5121B] font-heading">
                      {milestone.year}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FDECEC] text-[#8B0000] px-2.5 py-0.5 rounded border border-[#F8D0D0]">
                      {milestone.tag}
                    </span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-heading text-[#171717]">
                  {milestone.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                  {milestone.description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
