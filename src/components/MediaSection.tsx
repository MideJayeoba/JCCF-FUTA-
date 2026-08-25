import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MediaItem } from '../types';
import { 
  Play, 
  Clock, 
  Tv, 
  ArrowRight, 
  Sparkles, 
  X, 
  Search,
  CheckCircle,
  Share2
} from 'lucide-react';

interface MediaSectionProps {
  onViewAllMedia?: () => void;
  showAll?: boolean;
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  onViewAllMedia,
  showAll = false
}) => {
  const { mediaList } = useApp();
  const [activeVideoModal, setActiveVideoModal] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Sermon', 'Mega Praise', 'Worship', 'Seminar', 'Podcast'];

  const filteredMedia = mediaList.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.minister.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedMedia = showAll ? filteredMedia : filteredMedia.slice(0, 3);

  return (
    <section id="media" className="py-16 sm:py-24 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F8D0D0]">
            <Tv className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Digital Broadcasts & Sermons</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading tracking-tight">
            Watch & Connect
          </h2>
          <p className="text-[#666666] mt-3 text-sm sm:text-base leading-relaxed">
            Stream spirit-filled sermon teachings, live campus Mega Praise concerts, and mentorship podcasts anytime.
          </p>
        </div>

        {/* Filters on Full Page */}
        {showAll && (
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sermons, ministers, songs..."
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

        {/* 3-Column Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveVideoModal(item)}
              className="bg-[#FAFAFA] hover:bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail with Red Play Button */}
                <div className="h-48 relative overflow-hidden bg-[#171717]">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 via-[#171717]/20 to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2 py-0.5 rounded shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Red Play Button Accent in Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#B5121B] group-hover:bg-[#8B0000] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Pill */}
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {item.duration}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-5 space-y-2.5 text-left">
                  <h3 className="text-sm sm:text-base font-bold font-heading text-[#171717] group-hover:text-[#B5121B] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#666666] pt-2 border-t border-[#E5E5E5]">
                    <span>Minister: <strong>{item.minister}</strong></span>
                    <span>{item.views || 'HD Stream'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Trigger */}
              <div className="p-5 pt-0">
                <button className="w-full py-2.5 bg-white group-hover:bg-[#B5121B] text-[#B5121B] group-hover:text-white border border-[#B5121B] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs">
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Broadcast</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Media Button on Homepage */}
        {!showAll && onViewAllMedia && (
          <div className="text-center mt-12">
            <button
              onClick={onViewAllMedia}
              className="px-8 py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Full Media Archive</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Video Playback Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/90 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E5E5E5] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E5E5E5] bg-[#FAFAFA]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2 py-0.5 rounded">
                  {activeVideoModal.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#171717] mt-1 font-heading">
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#E5E5E5] text-[#171717] flex items-center justify-center border border-[#E5E5E5] cursor-pointer shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Frame / Screen */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={activeVideoModal.thumbnail}
                alt={activeVideoModal.title}
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-3 p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[#B5121B] flex items-center justify-center shadow-xl animate-pulse">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <span className="text-sm font-bold bg-black/60 px-3 py-1 rounded-full">
                  Playing Stream ({activeVideoModal.duration})
                </span>
                <p className="text-xs text-white/80 max-w-md">
                  Audio & Video Stream connected to JCCF FUTA Media Production Cloud
                </p>
              </div>
            </div>

            {/* Video Description & Info */}
            <div className="p-5 text-left space-y-3 bg-white">
              <p className="text-xs sm:text-sm text-[#171717] leading-relaxed">
                {activeVideoModal.description}
              </p>
              <div className="flex items-center justify-between text-xs text-[#666666] pt-2 border-t border-[#E5E5E5]">
                <span>Minister: <strong>{activeVideoModal.minister}</strong></span>
                <span>Broadcast Session: {activeVideoModal.date}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
