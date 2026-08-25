import React from 'react';
import { GetInvolvedSection } from '../components/GetInvolvedSection';
import { HandHeart } from 'lucide-react';
import { NavigationPage } from '../types';

interface GetInvolvedPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenGiveModal: () => void;
}

export const GetInvolvedPage: React.FC<GetInvolvedPageProps> = ({ onNavigate, onOpenGiveModal }) => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E5E5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
            <HandHeart className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Kingdom Service & Fellowship</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#171717] tracking-tight">
            Get Involved in <span className="text-[#B5121B]">JCCF FUTA</span>
          </h1>
          <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Discover a life-transforming fellowship community, attend faith-building programs, volunteer your gifts in 8 specialized ministry units, and partner with us.
          </p>
        </div>
      </div>

      <GetInvolvedSection 
        onNavigate={onNavigate} 
        onOpenGiveModal={onOpenGiveModal} 
        showAll={true} 
      />
    </div>
  );
};
