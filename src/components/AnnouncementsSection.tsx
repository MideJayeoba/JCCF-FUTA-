import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Announcement } from '../types';
import { 
  Bell, 
  ArrowRight, 
  Calendar, 
  User, 
  CheckCircle, 
  X, 
  ChevronRight,
  Search
} from 'lucide-react';

interface AnnouncementsSectionProps {
  onViewAllAnnouncements?: () => void;
  showAll?: boolean;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  onViewAllAnnouncements,
  showAll = false
}) => {
  const { announcements } = useApp();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Official Notice', 'Academic', 'Welfare', 'Spiritual', 'Event Alert'];

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = announcements.find((a) => a.isFeatured) || announcements[0];
  const remaining = filteredAnnouncements.filter((a) => a.id !== featured?.id);

  return (
    <section id="announcements" className="py-16 sm:py-24 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F8D0D0]">
            <Bell className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Official Circulars & News</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading tracking-tight">
            Announcements
          </h2>
          <p className="text-[#666666] mt-3 text-sm sm:text-base leading-relaxed">
            Stay informed with verified notifications, academic support timetables, and campus welfare updates from JCCF Secretariat.
          </p>
        </div>

        {/* Search & Filter on Full Page View */}
        {showAll && (
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#B5121B]"
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
                        : 'bg-[#FAFAFA] text-[#666666] hover:text-[#171717] hover:bg-[#E5E5E5] border border-[#E5E5E5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid Layout: Featured Left, Smaller Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Featured Announcement Card */}
          {featured && (
            <div className="lg:col-span-7 bg-[#FAFAFA] rounded-3xl p-6 sm:p-8 border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2.5 py-1 rounded">
                    Featured Bulletin • {featured.category}
                  </span>
                  <span className="text-xs text-[#666666] font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#B5121B]" />
                    {featured.date}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#171717] group-hover:text-[#B5121B] transition-colors leading-tight">
                  {featured.title}
                </h3>

                <p className="text-sm text-[#666666] leading-relaxed">
                  {featured.summary}
                </p>

                <div className="pt-2 text-xs text-[#666666] flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#B5121B]" />
                  <span>Author: <strong>{featured.author}</strong></span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                <button
                  onClick={() => setSelectedAnnouncement(featured)}
                  className="px-6 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Read Full Notice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold text-[#8B0000] bg-[#FDECEC] px-2.5 py-1 rounded-lg border border-[#F8D0D0]">
                  Verified Circular
                </span>
              </div>
            </div>
          )}

          {/* Smaller Announcement List Cards */}
          <div className="lg:col-span-5 space-y-4">
            {remaining.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAnnouncement(item)}
                className="bg-[#FAFAFA] hover:bg-white p-5 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs hover:shadow-md cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B0000] bg-[#FDECEC] px-2 py-0.5 rounded border border-[#F8D0D0]">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-[#666666]">{item.date}</span>
                  </div>

                  <h4 className="text-sm font-bold text-[#171717] group-hover:text-[#B5121B] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#666666] line-clamp-2">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 mt-1 flex items-center justify-between text-xs font-bold text-[#B5121B]">
                  <span>View announcement</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* View All CTA on Homepage */}
        {!showAll && onViewAllAnnouncements && (
          <div className="text-center mt-12">
            <button
              onClick={onViewAllAnnouncements}
              className="px-8 py-3.5 bg-white hover:bg-[#FDECEC] text-[#B5121B] border-2 border-[#B5121B] font-bold text-sm rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>View All Circulars & Notices</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#E5E5E5] space-y-4 text-left max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2.5 py-0.5 rounded">
                {selectedAnnouncement.category}
              </span>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="w-8 h-8 rounded-full bg-[#FAFAFA] hover:bg-[#E5E5E5] text-[#171717] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-bold font-heading text-[#171717] leading-tight">
              {selectedAnnouncement.title}
            </h3>

            <div className="flex items-center gap-4 text-xs text-[#666666] bg-[#FAFAFA] p-3 rounded-xl border border-[#E5E5E5]">
              <div><strong>Date:</strong> {selectedAnnouncement.date}</div>
              <div><strong>Issued by:</strong> {selectedAnnouncement.author}</div>
            </div>

            <div className="text-xs sm:text-sm text-[#171717] leading-relaxed space-y-3 pt-2">
              <p>{selectedAnnouncement.content}</p>
            </div>

            <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-6 py-2.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Done Reading
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
