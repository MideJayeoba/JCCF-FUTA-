import React from 'react';
import { Users, Calendar, PlayCircle, Heart, ArrowRight } from 'lucide-react';
import { NavigationPage } from '../types';

interface QuickActionsProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenGiveModal: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNavigate,
  onOpenGiveModal
}) => {
  const actions = [
    {
      id: 'fellowships',
      title: 'Find a Fellowship',
      description: 'Discover your Christian denomination and weekly meeting location in FUTA.',
      icon: Users,
      action: () => onNavigate('fellowships'),
      badge: '24+ Fellowships'
    },
    {
      id: 'events',
      title: 'Upcoming Events',
      description: 'Mega Praise, prayer vigils, teaching weekends, and conference timetables.',
      icon: Calendar,
      action: () => onNavigate('events'),
      badge: 'Next Service'
    },
    {
      id: 'media',
      title: 'Watch Media',
      description: 'Stream anointed sermon teachings, mass choir worship, and podcasts.',
      icon: PlayCircle,
      action: () => onNavigate('media'),
      badge: 'HD Video & Audio'
    },
    {
      id: 'give',
      title: 'Give to JCCF',
      description: 'Partner with campus evangelism, student welfare food bank, and projects.',
      icon: Heart,
      action: onOpenGiveModal,
      badge: 'Kingdom Seed'
    }
  ];

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {actions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="bg-[#FAFAFA] hover:bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs hover:shadow-md text-left flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#FDECEC] text-[#B5121B] group-hover:bg-[#B5121B] group-hover:text-white transition-colors flex items-center justify-center border border-[#F8D0D0]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded border border-[#F8D0D0]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#171717] font-heading group-hover:text-[#B5121B] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#666666] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 flex items-center gap-1 text-xs font-bold text-[#B5121B] group-hover:text-[#8B0000]">
                  <span>Access Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
