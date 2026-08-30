import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WEEKLY_SCHEDULE } from '../data/events';
import { FellowshipEvent } from '../types';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Share2, 
  X,
  Bell,
  Search,
  Phone,
  ShieldCheck,
  Youtube
} from 'lucide-react';

interface EventsSectionProps {
  onViewAllEvents?: () => void;
  showAll?: boolean;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  onViewAllEvents,
  showAll = false
}) => {
  const { events } = useApp();
  const [selectedEventModal, setSelectedEventModal] = useState<FellowshipEvent | null>(null);
  const [rsvpedEvents, setRsvpedEvents] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Mega Service', 'Teaching Weekend', 'Prayer', 'Conference', 'Special'];

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ev.theme && ev.theme.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 3);

  const handleRsvp = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRsvpedEvents(prev => ({ ...prev, [id]: true }));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <section id="events" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F8D0D0]">
            <Calendar className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Gatherings & Conferences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading tracking-tight">
            Upcoming Events
          </h2>
          <p className="text-[#666666] mt-3 text-sm sm:text-base leading-relaxed">
            Experience the move of God across FUTA campus in our united conferences, prayer vigils, and teaching weekends.
          </p>
        </div>

        {/* Filters & Search on Full View */}
        {showAll && (
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events by title, venue, theme..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#B5121B]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#B5121B] text-white shadow-xs'
                        : 'bg-white text-[#666666] hover:text-[#171717] hover:bg-[#E5E5E5] border border-[#E5E5E5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3 Event Cards Grid (or all) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((event) => {
            const isRsvped = rsvpedEvents[event.id];
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Event Thumbnail */}
                  <div className="h-48 relative overflow-hidden bg-[#171717]">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/85 via-transparent to-transparent" />

                    {/* Category Label */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2.5 py-0.5 rounded shadow-xs">
                        {event.category}
                      </span>
                    </div>

                    {/* Red Date Accent Pill */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#E5E5E5] text-xs font-bold text-[#8B0000] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B5121B]" />
                      <span>{event.date}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold font-heading text-[#171717] group-hover:text-[#B5121B] transition-colors leading-snug">
                      {event.title}
                    </h3>

                    {event.theme && (
                      <p className="text-xs font-semibold text-[#8B0000] bg-[#FDECEC] px-2.5 py-1 rounded-lg border border-[#F8D0D0] inline-block">
                        Theme: {event.theme}
                      </p>
                    )}

                    <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-[#E5E5E5] text-xs text-[#171717]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#B5121B] shrink-0" />
                        <span className="text-[#666666]">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#B5121B] shrink-0" />
                        <span className="text-[#666666] line-clamp-1">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedEventModal(event)}
                    className="flex-1 py-2.5 px-3 bg-[#FAFAFA] hover:bg-[#FDECEC] text-[#171717] hover:text-[#B5121B] border border-[#E5E5E5] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleRsvp(event.id, e)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                      isRsvped
                        ? 'bg-[#FDECEC] text-[#8B0000] border border-[#F8D0D0]'
                        : 'bg-[#B5121B] hover:bg-[#8B0000] text-white shadow-xs'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isRsvped ? 'Saved' : 'Remind'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Events CTA on Homepage */}
        {!showAll && onViewAllEvents && (
          <div className="text-center mt-12">
            <button
              onClick={onViewAllEvents}
              className="px-8 py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>View All Events & Weekly Timetable</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Social Announcement Sub-Banner */}
        <div className="mt-12 p-6 bg-gradient-to-br from-[#8B0000] via-[#A30F16] to-[#B5121B] border border-[#B5121B]/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 text-left max-w-4xl mx-auto shadow-md relative overflow-hidden group">
          {/* Decorative Back Light */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          
          <div className="space-y-1 relative z-10">
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Stay Connected & Stream Live</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-white/90 font-medium leading-relaxed max-w-xl">
              Get direct live stream broadcasts, sessional program timelines, weekly study notifications, and digital flyers sent directly to your phone.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 relative z-10">
            <a 
              href="https://chat.whatsapp.com/LkLMVfYoOI216cfr4pD3gm" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#E8F8EF] text-[#25D366] hover:scale-105 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Group</span>
            </a>
            <a 
              href="https://whatsapp.com/channel/0029Vay9yRR3wtb1yrhKOh3w" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#E8F8EF] text-[#25D366] hover:scale-105 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WhatsApp Channel</span>
            </a>
            <a 
              href="https://www.youtube.com/@jccf_futa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#FEECEC] text-[#FF0000] hover:scale-105 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube Live</span>
            </a>
          </div>
        </div>

      </div>

      {/* Event Details Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E5E5E5] flex flex-col max-h-[90vh]">
            
            {/* Header Image */}
            <div className="h-48 relative bg-[#171717]">
              <img
                src={selectedEventModal.image}
                alt={selectedEventModal.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/40 to-transparent" />
              
              <button
                onClick={() => setSelectedEventModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2 py-0.5 rounded">
                  {selectedEventModal.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white mt-1">
                  {selectedEventModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-left">
              {selectedEventModal.theme && (
                <div className="p-3 bg-[#FDECEC] rounded-xl border border-[#F8D0D0] text-xs font-bold text-[#8B0000]">
                  Theme: {selectedEventModal.theme}
                </div>
              )}

              <p className="text-xs sm:text-sm text-[#171717] leading-relaxed">
                {selectedEventModal.description}
              </p>

              {selectedEventModal.minister && (
                <div className="text-xs text-[#666666]">
                  <strong>Ministers / Facilitators:</strong> {selectedEventModal.minister}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
                  <span className="text-[#666666] block font-medium">Date & Time:</span>
                  <strong className="text-[#8B0000] block">{selectedEventModal.date}</strong>
                  <span className="text-[#171717] block">{selectedEventModal.time}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
                  <span className="text-[#666666] block font-medium">Venue (FUTA Campus):</span>
                  <strong className="text-[#171717] block">{selectedEventModal.venue}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#E5E5E5]">
                <button
                  onClick={() => {
                    setRsvpedEvents(prev => ({ ...prev, [selectedEventModal.id]: true }));
                    alert(`Reminder set for "${selectedEventModal.title}"! We look forward to fellowshiping with you.`);
                    setSelectedEventModal(null);
                  }}
                  className="px-5 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Set Event Reminder
                </button>

                <button
                  onClick={() => setSelectedEventModal(null)}
                  className="px-4 py-2 bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
