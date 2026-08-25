import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Fellowship } from '../types';
import { 
  Users, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  Search,
  ChevronRight,
  X,
  ExternalLink,
  Phone
} from 'lucide-react';

interface FellowshipsSectionProps {
  onViewAllFellowships?: () => void;
  onSelectFellowship?: (fellowship: Fellowship) => void;
  showAll?: boolean;
}

export const FellowshipsSection: React.FC<FellowshipsSectionProps> = ({
  onViewAllFellowships,
  onSelectFellowship,
  showAll = false
}) => {
  const { fellowships } = useApp();
  const [selectedFellowshipModal, setSelectedFellowshipModal] = useState<Fellowship | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Pentecostal', 'Evangelical', 'Inter-denominational', 'Denominational'];

  const filteredFellowships = fellowships.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.meetingVenue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedFellowships = showAll ? filteredFellowships : filteredFellowships.slice(0, 6);

  const handleOpenDetail = (fellowship: Fellowship) => {
    if (onSelectFellowship) {
      onSelectFellowship(fellowship);
    } else {
      setSelectedFellowshipModal(fellowship);
    }
  };

  return (
    <section id="fellowships" className="py-16 sm:py-24 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F8D0D0]">
            <Users className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Member Fellowship Directory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading tracking-tight">
            Find Your Fellowship
          </h2>
          <p className="text-[#666666] mt-3 text-sm sm:text-base leading-relaxed">
            Discover Christian fellowships across FUTA and find a community where you can grow spiritually, academically, and socially.
          </p>
        </div>

        {/* Filters & Search (if full page or expanded) */}
        {showAll && (
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, acronym, venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl text-xs sm:text-sm text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#B5121B] focus:bg-white"
                />
              </div>

              {/* Category Pills */}
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

        {/* Fellowships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedFellowships.map((fellowship) => (
            <div
              key={fellowship.id}
              className="bg-[#FAFAFA] hover:bg-white rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Top Image Banner */}
                <div className="h-44 relative overflow-hidden bg-[#171717]">
                  <img
                    src={fellowship.bannerImage}
                    alt={fellowship.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/30 to-transparent" />
                  
                  {/* Category & Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2 py-0.5 rounded shadow-xs">
                      {fellowship.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[11px] font-bold text-[#FDECEC] block">
                      {fellowship.acronym}
                    </span>
                    <h3 className="text-base font-bold font-heading text-white line-clamp-1">
                      {fellowship.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed italic">
                    “{fellowship.motto}”
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#E5E5E5] text-xs text-[#171717]">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#B5121B] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#171717]">{fellowship.meetingDays}</span>
                        <span className="block text-[11px] text-[#666666]">{fellowship.meetingTime}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#B5121B] shrink-0 mt-0.5" />
                      <span className="text-[#666666] line-clamp-1">{fellowship.meetingVenue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleOpenDetail(fellowship)}
                  className="w-full py-2.5 px-4 bg-white group-hover:bg-[#B5121B] text-[#B5121B] group-hover:text-white border border-[#B5121B] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>View Fellowship</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button on Homepage */}
        {!showAll && onViewAllFellowships && (
          <div className="text-center mt-12">
            <button
              onClick={onViewAllFellowships}
              className="px-8 py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>View All 15+ Fellowships</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Individual Fellowship Detail Modal */}
      {selectedFellowshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171717]/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E5E5E5] flex flex-col max-h-[90vh]">
            
            {/* Header Image */}
            <div className="h-48 sm:h-56 relative bg-[#171717]">
              <img
                src={selectedFellowshipModal.bannerImage}
                alt={selectedFellowshipModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/40 to-transparent" />
              
              <button
                onClick={() => setSelectedFellowshipModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#B5121B] text-white px-2 py-0.5 rounded">
                  {selectedFellowshipModal.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
                  {selectedFellowshipModal.name} ({selectedFellowshipModal.acronym})
                </h3>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B0000] block mb-1">Motto:</span>
                <p className="text-sm font-semibold text-[#171717] italic">
                  “{selectedFellowshipModal.motto}”
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#666666] block">Overview:</span>
                <p className="text-xs sm:text-sm text-[#171717] leading-relaxed">
                  {selectedFellowshipModal.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
                  <span className="text-[#666666] block text-[11px] font-medium">Meeting Venue (FUTA):</span>
                  <strong className="text-[#171717] mt-0.5 block">{selectedFellowshipModal.meetingVenue}</strong>
                </div>

                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
                  <span className="text-[#666666] block text-[11px] font-medium">Weekly Meeting Days & Time:</span>
                  <strong className="text-[#171717] mt-0.5 block">{selectedFellowshipModal.meetingTime}</strong>
                </div>

                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
                  <span className="text-[#666666] block text-[11px] font-medium">Fellowship President:</span>
                  <strong className="text-[#171717] mt-0.5 block">{selectedFellowshipModal.presidentName}</strong>
                </div>

                <div className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
                  <span className="text-[#666666] block text-[11px] font-medium">Secretariat Contact:</span>
                  <strong className="text-[#B5121B] mt-0.5 block">{selectedFellowshipModal.presidentContact}</strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#E5E5E5]">
                <span className="text-xs text-[#666666]">Established in FUTA: <strong>{selectedFellowshipModal.establishedYear}</strong></span>
                <button
                  onClick={() => setSelectedFellowshipModal(null)}
                  className="px-5 py-2 bg-[#B5121B] text-white font-bold text-xs rounded-xl hover:bg-[#8B0000] cursor-pointer"
                >
                  Close Details
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
