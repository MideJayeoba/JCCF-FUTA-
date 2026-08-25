import React from 'react';
import { ResourcesSection } from '../components/ResourcesSection';
import { BookOpen } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E5E5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
            <BookOpen className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Academic & Spiritual Vault</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#171717] tracking-tight">
            Resources & <span className="text-[#B5121B]">Study Materials</span>
          </h1>
          <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Download solved science & engineering past questions (100L-500L), course revision handbooks, the JCCF Constitution, and devotionals.
          </p>
        </div>
      </div>

      <ResourcesSection showAll={true} />
    </div>
  );
};
