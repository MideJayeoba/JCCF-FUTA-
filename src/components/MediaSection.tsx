import React, { useState, useEffect } from 'react';
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
  Share2,
  ExternalLink,
  RefreshCw,
  Youtube,
  Radio,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../lib/youtube';

interface MediaSectionProps {
  onViewAllMedia?: () => void;
  showAll?: boolean;
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  onViewAllMedia,
  showAll = false
}) => {
  const { mediaList, fetchYouTubeVideos } = useApp();
  const [activeVideoModal, setActiveVideoModal] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hasAttemptedAutoSync, setHasAttemptedAutoSync] = useState(false);

  // Categories
  const categories = ['All', 'Sermon', 'Mega Praise', 'Worship', 'Seminar', 'Podcast'];

  // Auto-sync if mediaList is empty and hasn't synced yet (silently in the background)
  useEffect(() => {
    if (mediaList.length === 0 && !hasAttemptedAutoSync) {
      setHasAttemptedAutoSync(true);
      fetchYouTubeVideos();
    }
  }, [mediaList.length, hasAttemptedAutoSync, fetchYouTubeVideos]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveVideoModal(null);
      }
    };
    if (activeVideoModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeVideoModal]);

  const filteredMedia = mediaList.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.minister.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Highlight top 5 videos for spotlight
  const topFive = filteredMedia.slice(0, 5);
  const remainingVideos = filteredMedia.slice(5);

  return (
    <section id="media" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
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
            Stream spirit-filled sermon teachings, live campus Mega Praise concerts, and discipleship recordings from the official JCCF FUTA vault.
          </p>
        </div>

        {/* Filters and Search - ONLY shown on dedicated Media Page (showAll === true) */}
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

        {/* Empty State Graceful Banner */}
        {filteredMedia.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#E5E5E5] p-12 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FDECEC] text-[#B5121B] flex items-center justify-center mx-auto mb-4">
              <Radio className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#171717] font-heading">Loading Media Broadcasts</h3>
            <p className="text-xs sm:text-sm text-[#666666] mt-2 leading-relaxed">
              Fetching official broadcasts from @jccf_futa...
            </p>
          </div>
        )}

        {/* TOP 5 FEATURED SPOTLIGHT BROADCASTS */}
        {topFive.length > 0 && (
          <div className="space-y-6 mb-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#171717]">
                <Flame className="w-5 h-5 text-[#B5121B]" />
                <h3 className="text-lg sm:text-xl font-extrabold font-heading">
                  Featured & Latest Broadcasts
                </h3>
              </div>
              {!showAll && onViewAllMedia && (
                <button
                  onClick={onViewAllMedia}
                  className="text-xs font-bold text-[#B5121B] hover:text-[#8B0000] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Go to Media Section</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Layout: First item is large Hero Video, next 4 are prominent grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* #1 Main Spotlight Card */}
              {topFive[0] && (
                <div 
                  onClick={() => setActiveVideoModal(topFive[0])}
                  className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#B5121B]/30 hover:border-[#B5121B] overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-[#171717] overflow-hidden">
                    <img
                      src={topFive[0].thumbnail}
                      alt={topFive[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider bg-[#B5121B] text-white px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 fill-white" />
                        <span>Premier Broadcast</span>
                      </span>
                      <span className="text-xs font-bold bg-black/70 text-white px-2.5 py-1 rounded-full">
                        {topFive[0].category}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#B5121B] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 fill-white ml-1" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                      {topFive[0].duration}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-[#171717] group-hover:text-[#B5121B] transition-colors leading-snug line-clamp-2">
                      {topFive[0].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#666666] line-clamp-2 leading-relaxed">
                      {topFive[0].description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[#666666] pt-3 border-t border-[#E5E5E5]">
                      <span>Minister / Channel: <strong className="text-[#171717]">{topFive[0].minister}</strong></span>
                      <span className="font-bold text-[#B5121B] flex items-center gap-1">
                        <Play className="w-3 h-3 fill-current" />
                        {topFive[0].views || 'Official Broadcast'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* #2 to #5 Prominent 2x2 Grid */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topFive.slice(1).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => setActiveVideoModal(item)}
                    className="bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative aspect-video bg-[#171717] overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-black uppercase bg-[#B5121B] text-white px-2 py-0.5 rounded shadow-xs">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#B5121B] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>

                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {item.duration}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-bold font-heading text-[#171717] group-hover:text-[#B5121B] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#666666] line-clamp-1">
                        {item.minister}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* REST OF VIDEOS (Archive) - ONLY shown on dedicated Media Page (showAll === true) */}
        {showAll && remainingVideos.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-[#171717] font-heading flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#666666]" />
                <span>Broadcasts & Sermons Archive</span>
                <span className="text-xs text-[#666666] font-normal">({remainingVideos.length} more)</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {remainingVideos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveVideoModal(item)}
                  className="bg-white rounded-xl border border-[#E5E5E5] hover:border-[#B5121B] overflow-hidden shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative aspect-video bg-[#171717] overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#B5121B] text-white flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                      {item.duration}
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <span className="text-[9px] font-bold text-[#B5121B] uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h5 className="text-xs font-bold text-[#171717] group-hover:text-[#B5121B] transition-colors leading-tight line-clamp-2">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-[#666666] line-clamp-1 pt-1">
                      {item.minister}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prominent Call-to-Action on Homepage to go to full Media Section */}
        {!showAll && onViewAllMedia && (
          <div className="text-center mt-8">
            <button
              onClick={onViewAllMedia}
              className="px-8 py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Go to Media Section</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Video Playback Modal */}
      {activeVideoModal && (
        <div 
          onClick={() => setActiveVideoModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#171717]/85 backdrop-blur-xs animate-in fade-in overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E5E5E5] flex flex-col max-h-[90vh] my-auto"
          >
            
            {/* Sticky Modal Header with Accessible Close Button */}
            <div className="p-3.5 sm:p-4.5 flex items-center justify-between border-b border-[#E5E5E5] bg-[#FAFAFA] shrink-0 sticky top-0 z-10">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2 py-0.5 rounded">
                  {activeVideoModal.category}
                </span>
                <h3 className="text-xs sm:text-base font-bold text-[#171717] mt-1 font-heading truncate">
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                title="Close modal (Esc)"
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-white hover:bg-[#FDECEC] hover:text-[#B5121B] text-[#171717] flex items-center justify-center border border-[#E5E5E5] shadow-xs cursor-pointer shrink-0 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content (Video & Description) */}
            <div className="overflow-y-auto flex-1">
              {/* Video Player Frame */}
              <div className="relative aspect-video bg-black flex items-center justify-center shrink-0">
                {extractYouTubeId(activeVideoModal.youtubeId) ? (
                  <iframe
                    src={getYouTubeEmbedUrl(extractYouTubeId(activeVideoModal.youtubeId)!, true)}
                    title={activeVideoModal.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={activeVideoModal.thumbnail}
                      alt={activeVideoModal.title}
                      className="w-full h-full object-cover opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-3 p-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#B5121B] flex items-center justify-center shadow-xl">
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </div>
                      <span className="text-sm font-bold bg-black/60 px-3 py-1 rounded-full">
                        Broadcast Stream ({activeVideoModal.duration || 'Full Session'})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Description & Info */}
              <div className="p-4 sm:p-5 text-left space-y-3 bg-white">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#666666] block">Description & Message Notes</span>
                  <p className="text-xs sm:text-sm text-[#171717] leading-relaxed whitespace-pre-line">
                    {activeVideoModal.description}
                  </p>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-[#666666] pt-3 border-t border-[#E5E5E5]">
                  <div>
                    <span>Minister: <strong className="text-[#171717]">{activeVideoModal.minister}</strong></span>
                    {activeVideoModal.date && <span className="ml-3">Date: {activeVideoModal.date}</span>}
                  </div>
                  {extractYouTubeId(activeVideoModal.youtubeId) && (
                    <a
                      href={`https://www.youtube.com/watch?v=${extractYouTubeId(activeVideoModal.youtubeId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDECEC] hover:bg-[#F8D0D0] text-[#B5121B] rounded-lg font-bold text-xs transition-colors"
                    >
                      <span>Watch on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Footer / Quick Action Bar */}
            <div className="p-3 bg-[#FAFAFA] border-t border-[#E5E5E5] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-[#666666]">
                Press <kbd className="px-1.5 py-0.5 bg-white border border-[#E5E5E5] rounded text-[10px] font-mono">ESC</kbd> or click outside to close
              </span>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-4 py-1.5 bg-[#171717] hover:bg-[#B5121B] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Video
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
