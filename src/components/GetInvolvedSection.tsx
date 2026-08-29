import React from 'react';
import { 
  Users, 
  Calendar, 
  HandHeart, 
  Building2, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';
import { SERVICE_UNITS } from '../data/units';
import { NavigationPage } from '../types';

interface GetInvolvedSectionProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenGiveModal: () => void;
  showAll?: boolean;
}

export const GetInvolvedSection: React.FC<GetInvolvedSectionProps> = ({
  onNavigate,
  onOpenGiveModal,
  showAll = false
}) => {
  const pathways = [
    {
      id: 'join',
      title: 'Join a Fellowship',
      description: 'Connect with a vibrant family of campus worshippers across 24+ member fellowships.',
      icon: Users,
      actionText: 'Browse Fellowships',
      onClick: () => onNavigate('fellowships'),
      badge: 'Spiritual Home'
    },
    {
      id: 'attend',
      title: 'Attend an Event',
      description: 'Join thousands of students at our upcoming Mega Praise, prayer assemblies, and Teaching Weekend.',
      icon: Calendar,
      actionText: 'View Upcoming Events',
      onClick: () => onNavigate('events'),
      badge: 'Experience Revival'
    },
    {
      id: 'volunteer',
      title: 'Explore Service Units',
      description: 'Learn about the Household Central Mass Choir, Drama troupe, Publicity & Media crew, Ushering, and Organizing directorates.',
      icon: HandHeart,
      actionText: 'View Service Units',
      onClick: () => onNavigate('get-involved'),
      badge: 'Kingdom Service'
    },
    {
      id: 'partner',
      title: 'Partner With Us',
      description: 'Support student welfare relief, campus evangelism tracts, and joint fellowship operations.',
      icon: Building2,
      actionText: 'Partner & Give',
      onClick: onOpenGiveModal,
      badge: 'Kingdom Seed'
    }
  ];

  return (
    <section id="get-involved" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F8D0D0]">
            <HandHeart className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Serve & Connect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading tracking-tight">
            Get Involved in JCCF
          </h2>
          <p className="text-[#666666] mt-3 text-sm sm:text-base leading-relaxed">
            Be part of what God is doing at FUTA. Connect with a member fellowship, participate in joint assemblies, and learn about our central service units.
          </p>
        </div>

        {/* 4 Involvement Pathway Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pathways.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs hover:shadow-md flex flex-col justify-between group text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#FDECEC] text-[#B5121B] group-hover:bg-[#B5121B] group-hover:text-white transition-colors flex items-center justify-center border border-[#F8D0D0]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded border border-[#F8D0D0]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-[#171717] group-hover:text-[#B5121B] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#666666] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    onClick={item.onClick}
                    className="w-full py-2.5 bg-[#FAFAFA] group-hover:bg-[#B5121B] text-[#171717] group-hover:text-white border border-[#E5E5E5] group-hover:border-[#B5121B] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ministry Directorates & Service Units Overview (When viewed on Full Page or Get Involved tab) */}
        {showAll && (
          <div className="mt-16 pt-16 border-t border-[#E5E5E5]">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h3 className="text-2xl font-bold font-heading text-[#171717]">
                Household Ministry Directorates & Service Units
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-2">
                Overview of the central service units that power the worship, publicity, technical logistics, and operations of the Joint Christian Campus Fellowship.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {SERVICE_UNITS.map((unit) => (
                <div
                  key={unit.id}
                  className="bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B]/40 shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#FDECEC] text-[#8B0000] px-2.5 py-1 rounded-md border border-[#F8D0D0]">
                        {unit.shortName}
                      </span>
                      <span className="text-[11px] font-semibold text-[#666666] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#B5121B]" />
                        <span>Central Unit</span>
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#171717] font-heading">
                      {unit.name}
                    </h4>

                    {unit.motto && (
                      <p className="text-xs font-medium italic text-[#B5121B] bg-[#FAFAFA] p-2.5 rounded-xl border border-[#E5E5E5]">
                        "{unit.motto}"
                      </p>
                    )}

                    <p className="text-xs text-[#666666] leading-relaxed">
                      {unit.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E5]">
                    <div className="text-[11px] text-[#666666]">
                      Leadership: <strong className="text-[#171717]">{unit.headTitle}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
