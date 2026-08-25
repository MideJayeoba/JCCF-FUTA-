import React from 'react';
import { EventsSection } from '../components/EventsSection';
import { WEEKLY_SCHEDULE } from '../data/events';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

export const EventsPage: React.FC = () => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-[#E5E5E5] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider border border-[#F8D0D0]">
            <Calendar className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Calendar of Events</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#171717] tracking-tight">
            Events & <span className="text-[#B5121B]">Weekly Schedule</span>
          </h1>
          <p className="text-sm sm:text-base text-[#666666] max-w-2xl mx-auto leading-relaxed">
            Never miss a joint service, Mega Praise night, prayer walk, or academic coaching seminar at FUTA.
          </p>
        </div>
      </div>

      {/* Main Events Grid */}
      <EventsSection showAll={true} />

      {/* Weekly Schedule Section */}
      <div className="py-16 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2.5 py-1 rounded border border-[#F8D0D0]">
              Regular Service Timetable
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#171717] mt-3">
              Weekly Campus Gatherings
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-2">
              Join brethren across all departments for deep Bible digging, power miracles, and Sunday communion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {WEEKLY_SCHEDULE.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAFAFA] hover:bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider bg-[#B5121B] text-white px-2.5 py-0.5 rounded">
                    {item.day}
                  </span>
                  <span className="text-[11px] font-bold text-[#8B0000]">
                    Weekly
                  </span>
                </div>

                <h3 className="text-base font-bold font-heading text-[#171717]">
                  {item.name}
                </h3>

                <p className="text-xs text-[#666666] leading-relaxed">
                  {item.focus}
                </p>

                <div className="pt-2 border-t border-[#E5E5E5] space-y-1 text-xs text-[#171717]">
                  <div className="flex items-center gap-1.5 text-[#8B0000] font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#B5121B]" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#666666]">
                    <MapPin className="w-3.5 h-3.5 text-[#B5121B]" />
                    <span className="line-clamp-1">{item.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};
