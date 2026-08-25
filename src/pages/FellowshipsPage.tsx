import React from 'react';
import { FellowshipsSection } from '../components/FellowshipsSection';
import { Users, Search, Sparkles } from 'lucide-react';
import { Fellowship } from '../types';

interface FellowshipsPageProps {
  onSelectFellowship?: (fellowship: Fellowship) => void;
}

export const FellowshipsPage: React.FC<FellowshipsPageProps> = ({ onSelectFellowship }) => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E5E5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
            <Users className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Campus Fellowship Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#171717] tracking-tight">
            Christian Fellowships in <span className="text-[#B5121B]">FUTA</span>
          </h1>
          <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Browse all officially registered member Christian fellowships in FUTA across ETF Hall, SEET Complex, School of Sciences, and Hilltop.
          </p>
        </div>
      </div>

      <FellowshipsSection showAll={true} onSelectFellowship={onSelectFellowship} />
    </div>
  );
};
