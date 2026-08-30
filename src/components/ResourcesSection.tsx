import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceItem } from '../types';
import { 
  FileText, 
  Download, 
  BookOpen, 
  Headphones, 
  ArrowRight, 
  Search, 
  FolderArchive,
  ShieldCheck,
  Send
} from 'lucide-react';

interface ResourcesSectionProps {
  onViewAllResources?: () => void;
  showAll?: boolean;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  onViewAllResources,
  showAll = false
}) => {
  const { resources, incrementResourceDownload } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const categories = ['All', 'Constitutional', 'Manuals', 'Sermons', 'Documents', 'Bulletins'];

  const filteredResources = resources.filter((res) => {
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedResources = showAll ? filteredResources : filteredResources.slice(0, 4);

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    incrementResourceDownload(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Downloading resource: "${title}". File is saved to your downloads.`);
    }, 800);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Constitutional':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Manuals':
        return <BookOpen className="w-5 h-5" />;
      case 'Sermons':
        return <Headphones className="w-5 h-5" />;
      case 'Documents':
      case 'Bulletins':
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <section id="resources" className="py-16 sm:py-24 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-3 border border-[#F8D0D0]">
            <BookOpen className="w-3.5 h-3.5 text-[#B5121B]" />
            <span>Digital Vault & Constitution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171717] font-heading tracking-tight">
            Official Documents & Publications
          </h2>
          <p className="text-[#666666] mt-3 text-sm sm:text-base leading-relaxed">
            Free access to the reviewed JCCF Constitution, fellowship registration guidelines, teaching weekend study manuals, and scripture companions.
          </p>
        </div>

        {/* Category & Search (Full Page) */}
        {showAll && (
          <div className="mb-10 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search constitution, study manuals, guidelines..."
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

        {/* Resource Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedResources.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAFAFA] hover:bg-white p-6 rounded-2xl border border-[#E5E5E5] hover:border-[#B5121B] transition-all shadow-xs hover:shadow-md flex flex-col justify-between group text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FDECEC] text-[#B5121B] flex items-center justify-center border border-[#F8D0D0]">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#FDECEC] text-[#8B0000] px-2 py-0.5 rounded border border-[#F8D0D0]">
                      {item.fileType} • {item.fileSize}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold font-heading text-[#171717] group-hover:text-[#B5121B] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#666666] leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[#E5E5E5] flex items-center justify-between">
                <span className="text-[11px] text-[#666666]">
                  <strong>{(Number(item.downloadCount) || 0).toLocaleString()}</strong> downloads
                </span>

                <button
                  onClick={() => handleDownload(item.id, item.title)}
                  disabled={downloadingId === item.id}
                  className="px-4 py-2 bg-[#B5121B] hover:bg-[#8B0000] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === item.id ? 'Downloading...' : 'Download File'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA on Homepage */}
        {!showAll && onViewAllResources && (
          <div className="text-center mt-12">
            <button
              onClick={onViewAllResources}
              className="px-8 py-3.5 bg-[#B5121B] hover:bg-[#8B0000] text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Documents & Manuals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Telegram call for resources */}
        <div className="mt-12 p-6 bg-gradient-to-br from-[#8B0000] via-[#A30F16] to-[#B5121B] border border-[#B5121B]/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 text-left max-w-4xl mx-auto shadow-md relative overflow-hidden group">
          {/* Decorative Back Light */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          
          <div className="space-y-1 relative z-10">
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Access More Fellowship Resources</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-white/90 font-medium leading-relaxed max-w-xl">
              Join our Telegram channel to access our digital archives, weekly hymnal guidelines, sessional study manuals, Christian e-books, and sessional flyers.
            </p>
          </div>
          <div className="relative z-10">
            <a 
              href="https://t.me/jccf_futa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#E6F3FA] text-[#0088cc] hover:scale-105 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram Channel</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
