import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExecutiveLeader } from '../types';
import { 
  Users, 
  Mail, 
  Phone, 
  ArrowRight, 
  Award, 
  GraduationCap,
  Sparkles,
  Search,
  BookOpen,
  History,
  ShieldCheck
} from 'lucide-react';

interface ExecutivesSectionProps {
  onViewAllExecutives?: () => void;
  showAll?: boolean;
}

export const ExecutivesSection: React.FC<ExecutivesSectionProps> = ({
  onViewAllExecutives,
  showAll = false
}) => {
  const { executives, historicalExecutives } = useApp();
  const [activeTab, setActiveTab] = useState<'current' | 'historical'>('current');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExecutives = executives.filter((exec) => {
    return exec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           exec.office.toLowerCase().includes(searchQuery.toLowerCase()) ||
           exec.department.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const displayedExecutives = showAll ? filteredExecutives : filteredExecutives.slice(0, 4);

  return (
    <section id="executives" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F8D0D0]">
            <Award className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Central Executive Council (CEC)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading tracking-tight">
            Meet the Executive Council
          </h2>
          <p className="text-[#666666] mt-3 text-sm sm:text-base leading-relaxed">
            Dedicated student servant leaders steering the spiritual, ministerial, and administrative affairs of JCCF FUTA for the 2026/2027 session.
          </p>
        </div>

        {/* Tab Toggle on Full Page View */}
        {showAll && (
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-white rounded-2xl border border-[#E5E5E5] shadow-xs">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'current'
                    ? 'bg-[#B5121B] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#171717]'
                }`}
              >
                Current CEC ({executives.length})
              </button>
              <button
                onClick={() => setActiveTab('historical')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'historical'
                    ? 'bg-[#B5121B] text-white shadow-xs'
                    : 'text-[#666666] hover:text-[#171717]'
                }`}
              >
                Past Presidents & Historical CEC ({historicalExecutives.length})
              </button>
            </div>
          </div>
        )}

        {/* Current CEC Grid */}
        {(!showAll || activeTab === 'current') && (
          <div>
            {displayedExecutives.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E5E5E5] p-12 text-center max-w-xl mx-auto shadow-xs">
                <ShieldCheck className="w-12 h-12 text-[#B5121B] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#171717]">No Executive Profiles Listed</h3>
                <p className="text-xs text-[#666666] mt-1">Executive leadership for this session is being confirmed by the election and central committee.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedExecutives.map((exec) => (
                  <div
                    key={exec.id}
                    className="bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Portrait Image */}
                      <div className="h-64 relative overflow-hidden bg-[#171717]">
                        <img
                          src={exec.photoUrl}
                          alt={exec.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/20 to-transparent" />
                        
                        {/* Office Tag */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2 py-0.5 rounded shadow-xs inline-block mb-1">
                            {exec.office}
                          </span>
                          <h3 className="text-base font-bold font-heading text-white line-clamp-1">
                            {exec.name}
                          </h3>
                        </div>
                      </div>

                      {/* Body details */}
                      <div className="p-4 space-y-2.5 text-left">
                        <div className="flex items-center gap-1.5 text-xs text-[#666666]">
                          <GraduationCap className="w-3.5 h-3.5 text-[#B5121B] shrink-0" />
                          <span className="font-semibold text-[#171717]">{exec.level} • {exec.department}</span>
                        </div>

                        {exec.quote && (
                          <p className="text-xs text-[#666666] italic line-clamp-3 bg-[#FAFAFA] p-2.5 rounded-xl border border-[#E5E5E5]">
                            “{exec.quote}”
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer contacts */}
                    <div className="p-4 pt-0 border-t border-[#E5E5E5] mt-2 flex items-center justify-between text-xs text-[#666666]">
                      <a
                        href={`mailto:${exec.email}`}
                        className="hover:text-[#B5121B] flex items-center gap-1 font-medium transition-colors"
                      >
                        <Mail className="w-3 h-3 text-[#B5121B]" />
                        <span>Email</span>
                      </a>
                      <a
                        href={`tel:${exec.phone}`}
                        className="hover:text-[#B5121B] flex items-center gap-1 font-medium transition-colors"
                      >
                        <Phone className="w-3 h-3 text-[#B5121B]" />
                        <span>Contact</span>
                      </a>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Historical Archives Tab */}
        {showAll && activeTab === 'historical' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {historicalExecutives.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] shadow-xs space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider bg-[#B5121B] text-white px-2.5 py-0.5 rounded">
                    {item.tenure}
                  </span>
                  <span className="text-xs font-bold text-[#8B0000] italic">
                    Theme: “{item.theme}”
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.president}
                      className="w-12 h-12 rounded-full object-cover border border-[#E5E5E5]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#FDECEC] text-[#B5121B] flex items-center justify-center font-bold text-sm">
                      {item.president.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-bold text-[#171717] font-heading">
                      {item.president}
                    </h4>
                    <p className="text-xs text-[#666666]">President • {item.tenure} Administration</p>
                    {item.generationName && (
                      <p className="text-[11px] font-bold text-[#B5121B] mt-0.5">
                        {item.generation ? `${item.generation}: ` : ''}{item.generationName}
                      </p>
                    )}
                  </div>
                </div>

                {item.executivesList && (
                  <div className="text-[11px] text-[#666666] pt-1 leading-relaxed">
                    <strong>Executive Officers:</strong> {item.executivesList}
                  </div>
                )}

                {item.keyAchievements && item.keyAchievements.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#E5E5E5]">
                    <span className="text-xs font-bold text-[#666666] block">Key Milestones & Legacy:</span>
                    <ul className="space-y-1 text-xs text-[#171717] list-disc list-inside">
                      {item.keyAchievements.map((ach, aIdx) => (
                        <li key={aIdx} className="leading-relaxed">{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View All CTA on Homepage */}
        {!showAll && onViewAllExecutives && (
          <div className="text-center mt-12">
            <button
              onClick={onViewAllExecutives}
              className="px-8 py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>View Full Council & Past Executives</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
