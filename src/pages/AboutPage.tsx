import React from 'react';
import { HistorySection } from '../components/HistorySection';
import { ShieldCheck, Heart, Flame, BookOpen, Target, Compass, Award, ArrowRight } from 'lucide-react';
import { NavigationPage } from '../types';

interface AboutPageProps {
  onNavigate: (page: NavigationPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E5E5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>About JCCF FUTA</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#171717] tracking-tight">
            One Fellowship. <span className="text-[#B5121B]">Many Fellowships.</span> One Purpose.
          </h1>
          <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Uniting campus Christian fellowships, raising holy and academically dominant leaders, and transforming the Federal University of Technology Akure since 1982.
          </p>
        </div>
      </div>

      {/* Vision, Mission & Core Values Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Vision */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center border border-[#F8D0D0]">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#171717]">
              Our Vision
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              To raise a consecrated, spirit-filled generation of Christian undergraduates in FUTA who excel in unbroken holiness, achieve unmatched academic dominance, and emerge as ethical nation builders in their professional callings.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center border border-[#F8D0D0]">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#171717]">
              Our Mission
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              To foster genuine inter-fellowship brotherhood, organize unified mass worship and prayer assemblies, provide free faculty academic tutoring, and provide compassionate welfare support to every student on campus.
            </p>
          </div>

          {/* Core Values */}
          <div className="bg-white p-8 rounded-3xl border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center border border-[#F8D0D0]">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#171717]">
              Core Pillars
            </h2>
            <ul className="text-xs sm:text-sm text-[#666666] space-y-2 list-disc list-inside">
              <li><strong>Spiritual Fire:</strong> Prayer, holy living, and sound doctrine.</li>
              <li><strong>Academic Brilliance:</strong> Diligence, tutorials, and top CGPAs.</li>
              <li><strong>Kingdom Unity:</strong> Harmony among all Christian denominations.</li>
              <li><strong>Student Compassion:</strong> Active food aid and indigent welfare.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Visual Timeline Section */}
      <HistorySection />

      {/* Organogram & Institutional Governance */}
      <div className="py-16 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#171717]">
              Institutional Structure & Governance
            </h2>
            <p className="text-xs sm:text-sm text-[#666666]">
              How JCCF FUTA operates with high accountability under university regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                Apex Tier
              </span>
              <h3 className="text-sm font-bold text-[#171717]">Central Executive Council</h3>
              <p className="text-xs text-[#666666]">Elected student leaders presiding over administration, finance, academics, prayer, and welfare.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                Legislative
              </span>
              <h3 className="text-sm font-bold text-[#171717]">Council of Presidents (COP)</h3>
              <p className="text-xs text-[#666666]">Comprising Presidents of all 15+ member fellowships for consensus decision-making.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                Operations
              </span>
              <h3 className="text-sm font-bold text-[#171717]">8 Ministry Directorates</h3>
              <p className="text-xs text-[#666666]">Choir, Media, Prayer Force, Academic Board, Ushering, Welfare, Missions, and Drama.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded">
                Oversight
              </span>
              <h3 className="text-sm font-bold text-[#171717]">Advisory Staff Board</h3>
              <p className="text-xs text-[#666666]">Christian university professors, deans, and senior chaplains providing spiritual mentorship.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => onNavigate('fellowships')}
              className="px-7 py-3 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Member Fellowships</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
